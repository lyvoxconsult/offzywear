import { describe, expect, it } from 'vitest';
import { offzySeed } from '../../../data/seeds/offzySeed';
import {
  createVersionedDemoStore,
  DemoStorageQuotaError,
  DEMO_STORAGE_KEY,
  UnsupportedStorageVersionError,
  type StorageLike,
} from './versionedStorage';

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  public getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  public removeItem(key: string) {
    this.values.delete(key);
  }
}

describe('versioned demo storage', () => {
  it('initializes an empty storage from validated seed', () => {
    const storage = new MemoryStorage();
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    expect(store.load().products).toHaveLength(3);
    expect(JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? '{}')).toMatchObject({
      schemaVersion: 2,
      revision: 0,
    });
  });

  it('recovers from malformed storage', () => {
    const storage = new MemoryStorage();
    storage.setItem(DEMO_STORAGE_KEY, '{malformed');
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    expect(store.load().seedRevision).toBe(1);
  });

  it('rejects invalid writes', () => {
    const storage = new MemoryStorage();
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    const invalid = { ...structuredClone(offzySeed), seedRevision: 0 };
    expect(() => store.save(invalid)).toThrow();
  });

  it('persists isolated copies', () => {
    const storage = new MemoryStorage();
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    const loaded = store.load();
    loaded.products[0]!.name = 'Mutated outside store';
    expect(store.load().products[0]!.name).toBe('Camiseta Presença');
  });

  it('migrates an explicit version zero envelope', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 0, revision: 7, data: offzySeed }),
    );
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    expect(store.load().products).toHaveLength(3);
    expect(JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? '{}')).toMatchObject({
      schemaVersion: 2,
      revision: 7,
    });
  });

  it('migrates legacy orders to complete customer, address, shipping and status snapshots', () => {
    const storage = new MemoryStorage();
    const legacy = structuredClone(offzySeed) as unknown as Record<string, unknown>;
    delete legacy.customerProfile;
    delete legacy.addresses;
    delete legacy.shippingOptions;
    legacy.products = (legacy.products as Array<Record<string, unknown>>).map((product) => ({
      ...product,
      images: (product.images as Array<Record<string, unknown>>).map((image) => {
        const result = { ...image };
        delete result.kind;
        return result;
      }),
    }));
    legacy.orders = [
      {
        id: 'legacy-order',
        publicCode: 'OFF-LEGACY',
        items: [
          {
            productId: 'product-camiseta-presenca',
            variantId: 'product-camiseta-presenca-pt-p',
            productName: 'Camiseta Presença',
            slug: 'camiseta-presenca',
            sku: 'OFF-CAM-001-PT-P',
            colorName: 'Preto',
            size: 'P',
            imageUrl: '/assets/brand/offzy-brand-board.jpeg',
            unitPriceInCents: 14990,
            quantity: 1,
            subtotalInCents: 14990,
          },
        ],
        totals: {
          subtotalInCents: 14990,
          discountInCents: 0,
          shippingInCents: 2490,
          totalInCents: 17480,
        },
        paymentMethod: 'pix-demo',
        status: 'created',
        createdAt: '2026-06-30T12:00:00.000Z',
      },
    ];
    storage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, revision: 3, data: legacy }),
    );

    const migrated = createVersionedDemoStore({ storage, seed: offzySeed }).load();
    expect(migrated.orders[0]).toMatchObject({
      customerSnapshot: { id: 'customer-demo-migrated' },
      deliveryAddressSnapshot: { id: 'address-demo-migrated' },
      shippingSnapshot: { priceInCents: 2490, simulation: true },
      statusHistory: [{ status: 'created', label: 'Pedido migrado' }],
    });
    expect(migrated.products[0]?.images[0]).toMatchObject({
      kind: 'placeholder',
      contentApproved: false,
    });
  });

  it('does not overwrite a future unknown version', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 99, revision: 0, data: offzySeed }),
    );
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    expect(() => store.load()).toThrow(UnsupportedStorageVersionError);
  });

  it('wraps quota failures in a recoverable storage error', () => {
    const storage: StorageLike = {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new DOMException('quota', 'QuotaExceededError');
      },
    };
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    expect(() => store.load()).toThrow(DemoStorageQuotaError);
    try {
      store.load();
    } catch (error) {
      expect((error as DemoStorageQuotaError).recoverable).toBe(true);
    }
  });

  it('rejects duplicate catalog relationships', () => {
    const storage = new MemoryStorage();
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    const duplicate = structuredClone(offzySeed);
    duplicate.products[1]!.slug = duplicate.products[0]!.slug;
    expect(() => store.save(duplicate)).toThrow();
  });

  it('rejects brand references presented as approved product photography', () => {
    const storage = new MemoryStorage();
    const store = createVersionedDemoStore({ storage, seed: offzySeed });
    const invalid = structuredClone(offzySeed);
    invalid.products[0]!.images[0]!.kind = 'product';
    invalid.products[0]!.images[0]!.contentApproved = true;
    expect(() => store.save(invalid)).toThrow(
      'Asset de marca não pode ser tratado como fotografia aprovada de produto.',
    );
  });
});
