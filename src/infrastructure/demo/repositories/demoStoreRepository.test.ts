import { describe, expect, it } from 'vitest';
import { offzySeed } from '../../../data/seeds/offzySeed';
import { createDemoOrder } from '../../../domain/orders/order';
import { createVersionedDemoStore, type StorageLike } from '../storage/versionedStorage';
import { DemoStoreRepository } from './demoStoreRepository';

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

function createRepository() {
  return new DemoStoreRepository(
    createVersionedDemoStore({ storage: new MemoryStorage(), seed: offzySeed }),
  );
}

const orderParty = {
  customer: offzySeed.customerProfile,
  deliveryAddress: offzySeed.addresses[0]!,
  shipping: offzySeed.shippingOptions[0]!,
};

describe('DemoStoreRepository', () => {
  it('persists catalog edits without mutating seed', async () => {
    const repository = createRepository();
    const product = (await repository.listProducts())[0]!;
    await repository.saveProduct({ ...product, name: 'Nome administrativo' });

    expect((await repository.findProductBySlug(product.slug))?.name).toBe('Nome administrativo');
    expect(offzySeed.products[0]?.name).toBe('OFFZY Essential Jogger Black');
  });

  it('deduplicates favorites', async () => {
    const repository = createRepository();
    const productId = offzySeed.products[0]!.id;
    await repository.saveFavoriteProductIds([productId, productId]);
    expect(await repository.getFavoriteProductIds()).toEqual([productId]);
  });

  it('blocks duplicate orders', async () => {
    const repository = createRepository();
    const product = offzySeed.products[0]!;
    const order = createDemoOrder({
      id: 'order-1',
      publicCode: 'OFF-00001',
      cart: [
        {
          productId: product.id,
          variantId: product.variants[0]!.id,
          quantity: 1,
          addedAt: '2026-06-30T12:00:00.000Z',
        },
      ],
      products: offzySeed.products,
      pricing: { freeShippingThresholdInCents: 0 },
      ...orderParty,
      paymentMethod: 'pix-demo',
    });

    await repository.saveOrder(order);
    await expect(repository.saveOrder(order)).rejects.toThrow('Pedido duplicado.');
  });

  it('blocks duplicate public order codes', async () => {
    const repository = createRepository();
    const product = offzySeed.products[0]!;
    const base = {
      publicCode: 'OFF-00003',
      cart: [
        {
          productId: product.id,
          variantId: product.variants[0]!.id,
          quantity: 1,
          addedAt: '2026-06-30T12:00:00.000Z',
        },
      ],
      products: offzySeed.products,
      pricing: { freeShippingThresholdInCents: 0 },
      ...orderParty,
      paymentMethod: 'pix-demo' as const,
    };
    await repository.saveOrder(createDemoOrder({ ...base, id: 'order-3' }));
    await expect(repository.saveOrder(createDemoOrder({ ...base, id: 'order-4' }))).rejects.toThrow(
      'Código público de pedido duplicado.',
    );
  });

  it('rejects duplicated or orphan cart relationships', async () => {
    const repository = createRepository();
    const product = offzySeed.products[0]!;
    const item = {
      productId: product.id,
      variantId: product.variants[0]!.id,
      quantity: 1,
      addedAt: '2026-06-30T12:00:00.000Z',
    };

    await expect(repository.saveCart([item, item])).rejects.toThrow();
    await expect(repository.saveCart([{ ...item, variantId: 'missing' }])).rejects.toThrow();
  });

  it('exposes aggregate operations without leaking the database store', async () => {
    const repository = createRepository();
    const home = await repository.getHomeContent();
    await repository.saveHomeContent({ ...home, heroTitle: 'Nova direção demo' });
    expect((await repository.getHomeContent()).heroTitle).toBe('Nova direção demo');

    const profile = await repository.getProfile();
    await repository.saveProfile({ ...profile, name: 'Perfil atualizado' });
    expect((await repository.getProfile()).name).toBe('Perfil atualizado');

    await repository.saveAddress({
      ...offzySeed.addresses[0]!,
      id: 'address-demo-2',
      label: 'Segundo endereço demo',
      isDefault: true,
    });
    expect((await repository.listAddresses()).filter((item) => item.isDefault)).toHaveLength(1);

    const product = offzySeed.products[0]!;
    const order = createDemoOrder({
      id: 'order-status',
      publicCode: 'OFF-STATUS',
      cart: [
        {
          productId: product.id,
          variantId: product.variants[0]!.id,
          quantity: 1,
          addedAt: '2026-06-30T12:00:00.000Z',
        },
      ],
      products: offzySeed.products,
      pricing: { freeShippingThresholdInCents: 0 },
      ...orderParty,
      paymentMethod: 'pix-demo',
      createdAt: '2026-06-30T12:00:00.000Z',
    });
    await repository.saveOrder(order);
    await repository.updateOrderStatus('order-status', 'confirmed', {
      status: 'confirmed',
      occurredAt: '2026-06-30T13:00:00.000Z',
      label: 'Pedido confirmado',
    });
    expect((await repository.getOrder('order-status'))?.status).toBe('confirmed');
    expect(JSON.parse(await repository.exportData())).toHaveProperty('customerProfile');
  });
});
