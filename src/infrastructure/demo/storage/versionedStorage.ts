import { demoDatabaseSchema, storageEnvelopeSchema, type DemoDatabase } from './schema';

export const DEMO_STORAGE_KEY = 'offzy.demo.store.v1';
export const CURRENT_SCHEMA_VERSION = 2 as const;

export class DemoStorageError extends Error {
  public readonly recoverable = true;
}

export class UnsupportedStorageVersionError extends DemoStorageError {
  public constructor(version: number) {
    super(`Versão de storage não suportada: ${version}.`);
    this.name = 'UnsupportedStorageVersionError';
  }
}

export class DemoStorageQuotaError extends DemoStorageError {
  public constructor(options?: ErrorOptions) {
    super('Espaço local insuficiente para salvar a demonstração.', options);
    this.name = 'DemoStorageQuotaError';
  }
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface DemoDatabaseStore {
  load(): DemoDatabase;
  save(data: DemoDatabase): DemoDatabase;
  update(mutator: (current: DemoDatabase) => DemoDatabase): DemoDatabase;
  reset(): DemoDatabase;
}

function cloneDatabase(data: DemoDatabase): DemoDatabase {
  return structuredClone(data);
}

type StorageMigration = (envelope: Record<string, unknown>) => Record<string, unknown>;

export const storageMigrations: Readonly<Record<number, StorageMigration>> = {
  0: (envelope) => ({ ...envelope, schemaVersion: 1 }),
  1: (envelope) => {
    const data = envelope.data as Record<string, unknown>;
    const products = Array.isArray(data.products)
      ? data.products.map((value) => {
          const product = value as Record<string, unknown>;
          const images = Array.isArray(product.images)
            ? product.images.map((imageValue) => ({
                ...(imageValue as Record<string, unknown>),
                kind: 'placeholder',
                contentApproved: false,
              }))
            : [];
          return { ...product, images };
        })
      : [];
    const customerProfile = {
      id: 'customer-demo-migrated',
      name: 'Cliente demonstração',
      email: 'migrated.demo@example.invalid',
      phone: '(00) 00000-0000',
      demoData: true,
    };
    const addresses = [
      {
        id: 'address-demo-migrated',
        label: 'Endereço demonstrativo migrado',
        recipientName: 'Cliente demonstração',
        postalCode: '00000-000',
        street: 'Endereço não informado',
        number: 'S/N',
        neighborhood: 'Bairro não informado',
        city: 'Cidade de demonstração',
        state: 'SP',
        isDefault: true,
        demoData: true,
      },
    ];
    const shippingOptions = [
      {
        id: 'shipping-demo-migrated',
        name: 'Envio simulado migrado',
        priceInCents: 0,
        estimatedMinDays: 0,
        estimatedMaxDays: 0,
        simulation: true,
      },
    ];
    const orders = Array.isArray(data.orders)
      ? data.orders.map((value) => {
          const order = value as Record<string, unknown>;
          const totals = order.totals as Record<string, unknown>;
          const createdAt = String(order.createdAt);
          const status = String(order.status);
          return {
            ...order,
            customerSnapshot: {
              id: customerProfile.id,
              name: customerProfile.name,
              email: customerProfile.email,
              phone: customerProfile.phone,
            },
            deliveryAddressSnapshot: { ...addresses[0], isDefault: undefined },
            shippingSnapshot: {
              ...shippingOptions[0],
              priceInCents: Number(totals.shippingInCents ?? 0),
            },
            statusHistory: [{ status, occurredAt: createdAt, label: 'Pedido migrado' }],
          };
        })
      : [];
    return {
      ...envelope,
      schemaVersion: 2,
      data: {
        ...data,
        products,
        orders,
        customerProfile,
        addresses,
        shippingOptions,
      },
    };
  },
};

function migrateEnvelope(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;

  let envelope = value as Record<string, unknown>;
  if (typeof envelope.schemaVersion !== 'number') return value;
  let version = envelope.schemaVersion;

  if (!Number.isInteger(version) || version < 0 || version > CURRENT_SCHEMA_VERSION) {
    throw new UnsupportedStorageVersionError(version);
  }

  while (version < CURRENT_SCHEMA_VERSION) {
    const migration = storageMigrations[version];
    if (!migration) throw new UnsupportedStorageVersionError(version);
    envelope = migration(envelope);
    version += 1;
  }

  return envelope;
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

export function createVersionedDemoStore(input: {
  storage: StorageLike;
  seed: DemoDatabase;
  key?: string;
}): DemoDatabaseStore {
  const key = input.key ?? DEMO_STORAGE_KEY;
  const validSeed = demoDatabaseSchema.parse(input.seed);

  function readEnvelope(): { schemaVersion: 2; revision: number; data: DemoDatabase } | undefined {
    const raw = input.storage.getItem(key);
    if (!raw) return undefined;

    try {
      const parsed: unknown = JSON.parse(raw);
      const result = storageEnvelopeSchema.safeParse(migrateEnvelope(parsed));
      if (!result.success) return undefined;
      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed) &&
        (parsed as Record<string, unknown>).schemaVersion !== CURRENT_SCHEMA_VERSION
      ) {
        try {
          input.storage.setItem(key, JSON.stringify(result.data));
        } catch (error) {
          if (isQuotaError(error)) throw new DemoStorageQuotaError({ cause: error });
          throw error;
        }
      }
      return result.data;
    } catch (error) {
      if (error instanceof UnsupportedStorageVersionError) throw error;
      return undefined;
    }
  }

  function write(data: DemoDatabase, revision: number): DemoDatabase {
    const validated = demoDatabaseSchema.parse(data);
    try {
      input.storage.setItem(
        key,
        JSON.stringify({
          schemaVersion: CURRENT_SCHEMA_VERSION,
          revision,
          data: validated,
        }),
      );
    } catch (error) {
      if (isQuotaError(error)) throw new DemoStorageQuotaError({ cause: error });
      throw error;
    }
    return cloneDatabase(validated);
  }

  const load = () => {
    const envelope = readEnvelope();
    if (!envelope) return write(validSeed, 0);
    if (envelope.data.seedRevision < validSeed.seedRevision) {
      return write(validSeed, envelope.revision + 1);
    }
    return cloneDatabase(envelope.data);
  };

  const save = (data: DemoDatabase) => {
    const nextRevision = (readEnvelope()?.revision ?? -1) + 1;
    return write(data, nextRevision);
  };

  return {
    load,
    save,
    update(mutator) {
      return save(mutator(cloneDatabase(load())));
    },
    reset() {
      input.storage.removeItem(key);
      return write(validSeed, 0);
    },
  };
}
