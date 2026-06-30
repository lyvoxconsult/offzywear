import { describe, expect, it } from 'vitest';
import { offzySeed } from '../../data/seeds/offzySeed';
import { calculatePriceSummary, effectiveProductPrice, validateCoupon } from './pricing';

describe('pricing', () => {
  it('uses a valid lower sale price', () => {
    const product = { ...offzySeed.products[0]!, salePriceInCents: 9990 };
    expect(effectiveProductPrice(product)).toBe(9990);
  });

  it('ignores a sale price higher than base price', () => {
    const product = { ...offzySeed.products[0]!, salePriceInCents: 999_999 };
    expect(effectiveProductPrice(product)).toBe(product.basePriceInCents);
  });

  it('calculates percentage coupon and paid shipping', () => {
    const product = offzySeed.products[0]!;
    const summary = calculatePriceSummary({
      cart: [
        {
          productId: product.id,
          variantId: product.variants[0]!.id,
          quantity: 1,
          addedAt: '2026-06-30T12:00:00.000Z',
        },
      ],
      products: offzySeed.products,
      shippingInCents: 2490,
      freeShippingThresholdInCents: 39900,
      coupon: offzySeed.coupons[0],
      now: new Date('2026-06-30T12:00:00.000Z'),
    });

    expect(summary).toEqual({
      subtotalInCents: 24990,
      discountInCents: 2499,
      shippingInCents: 2490,
      totalInCents: 24981,
      appliedCouponCode: 'DEMO10',
    });
  });

  it('rejects expired coupons', () => {
    const coupon = { ...offzySeed.coupons[0]!, expiresAt: '2025-01-01T00:00:00.000Z' };
    expect(validateCoupon(coupon, 20_000, new Date('2026-06-30T12:00:00.000Z'))).toEqual({
      valid: false,
      reason: 'Cupom expirado.',
    });
  });

  it('rejects a variant that belongs to another product', () => {
    const product = offzySeed.products[0]!;
    expect(() =>
      calculatePriceSummary({
        cart: [
          {
            productId: product.id,
            variantId: offzySeed.products[1]!.variants[0]!.id,
            quantity: 1,
            addedAt: '2026-06-30T12:00:00.000Z',
          },
        ],
        products: offzySeed.products,
        shippingInCents: 0,
        freeShippingThresholdInCents: 0,
      }),
    ).toThrow('Variante não pertence ao produto.');
  });

  const availabilityCases: Array<
    [string, { productStatus?: 'draft'; variantEnabled?: boolean; quantity?: number }, string]
  > = [
    ['produto inativo', { productStatus: 'draft' as const }, 'Produto indisponível'],
    ['variante inativa', { variantEnabled: false }, 'Variante indisponível'],
    ['estoque insuficiente', { quantity: 999 }, 'Quantidade incompatível'],
  ];

  it.each(availabilityCases)('rejects %s', (_label, override, expectedMessage) => {
    const products = structuredClone(offzySeed.products);
    const product = products[0]!;
    if (override.productStatus) product.status = override.productStatus;
    if (override.variantEnabled === false) product.variants[0]!.enabled = false;

    expect(() =>
      calculatePriceSummary({
        cart: [
          {
            productId: product.id,
            variantId: product.variants[0]!.id,
            quantity: override.quantity ?? 1,
            addedAt: '2026-06-30T12:00:00.000Z',
          },
        ],
        products,
        shippingInCents: 0,
        freeShippingThresholdInCents: 0,
      }),
    ).toThrow(expectedMessage);
  });

  it.each([
    ['fixed' as const, 99_999, 2490, 24990],
    ['free-shipping' as const, 0, 0, 0],
  ])('applies %s coupon', (type, value, expectedShipping, expectedDiscount) => {
    const product = offzySeed.products[0]!;
    const summary = calculatePriceSummary({
      cart: [
        {
          productId: product.id,
          variantId: product.variants[0]!.id,
          quantity: 1,
          addedAt: '2026-06-30T12:00:00.000Z',
        },
      ],
      products: offzySeed.products,
      shippingInCents: 2490,
      freeShippingThresholdInCents: 999_999,
      coupon: { ...offzySeed.coupons[0]!, type, value },
      now: new Date('2026-06-30T12:00:00.000Z'),
    });

    expect(summary.shippingInCents).toBe(expectedShipping);
    expect(summary.discountInCents).toBe(expectedDiscount);
  });
});
