import { describe, expect, it } from 'vitest';
import { offzySeed } from '../../data/seeds/offzySeed';
import { createDemoOrder } from './order';

describe('order snapshot', () => {
  const orderParty = {
    customer: offzySeed.customerProfile,
    deliveryAddress: offzySeed.addresses[0]!,
    shipping: offzySeed.shippingOptions[0]!,
  };

  it('keeps copied product and variant values', () => {
    const products = structuredClone(offzySeed.products);
    const product = products[0]!;
    const variant = product.variants[0]!;
    const cart = [
      {
        productId: product.id,
        variantId: variant.id,
        quantity: 2,
        addedAt: '2026-06-30T12:00:00.000Z',
      },
    ];
    const order = createDemoOrder({
      id: 'order-1',
      publicCode: 'OFF-00001',
      cart,
      products,
      pricing: { freeShippingThresholdInCents: 0 },
      ...orderParty,
      paymentMethod: 'pix-demo',
      createdAt: '2026-06-30T12:00:00.000Z',
    });

    product.name = 'Nome alterado';
    variant.sku = 'SKU-ALTERADO';
    expect(order.items[0]?.productName).toBe('Camiseta Presença');
    expect(order.items[0]?.sku).toBe('OFF-CAM-001-PT-P');
    expect(order.items[0]?.subtotalInCents).toBe(29980);
  });

  it('rejects an empty cart', () => {
    expect(() =>
      createDemoOrder({
        id: 'order-1',
        publicCode: 'OFF-00001',
        cart: [],
        products: offzySeed.products,
        pricing: { freeShippingThresholdInCents: 0 },
        ...orderParty,
        paymentMethod: 'pix-demo',
      }),
    ).toThrow('Carrinho vazio.');
  });

  it('recalculates subtotal, discount, shipping and total', () => {
    const product = offzySeed.products[0]!;
    const order = createDemoOrder({
      id: 'order-2',
      publicCode: 'OFF-00002',
      cart: [
        {
          productId: product.id,
          variantId: product.variants[0]!.id,
          quantity: 1,
          addedAt: '2026-06-30T12:00:00.000Z',
        },
      ],
      products: offzySeed.products,
      pricing: {
        freeShippingThresholdInCents: 39900,
        coupon: offzySeed.coupons[0],
        now: new Date('2026-06-30T12:00:00.000Z'),
      },
      ...orderParty,
      paymentMethod: 'pix-demo',
    });

    expect(order.totals).toEqual({
      subtotalInCents: 14990,
      discountInCents: 1499,
      shippingInCents: 2490,
      totalInCents: 15981,
      appliedCouponCode: 'DEMO10',
    });
    expect(order.customerSnapshot).toEqual({
      id: offzySeed.customerProfile.id,
      name: offzySeed.customerProfile.name,
      email: offzySeed.customerProfile.email,
      phone: offzySeed.customerProfile.phone,
    });
    expect(order.deliveryAddressSnapshot.id).toBe(offzySeed.addresses[0]!.id);
    expect(order.shippingSnapshot.simulation).toBe(true);
    expect(order.statusHistory).toEqual([
      {
        status: 'created',
        occurredAt: order.createdAt,
        label: 'Pedido criado',
      },
    ]);
  });
});
