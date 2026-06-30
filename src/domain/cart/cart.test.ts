import { describe, expect, it } from 'vitest';
import { offzySeed } from '../../data/seeds/offzySeed';
import { addCartItem, cartItemKey, updateCartQuantity } from './cart';

describe('cart', () => {
  const product = offzySeed.products[0]!;
  const firstVariant = product.variants[0]!;
  const secondVariant = product.variants[1]!;

  it('identifies items by product and variant', () => {
    expect(cartItemKey({ productId: product.id, variantId: firstVariant.id })).not.toBe(
      cartItemKey({ productId: product.id, variantId: secondVariant.id }),
    );
  });

  it('keeps two sizes as different items', () => {
    const first = addCartItem([], product, firstVariant.id, 1);
    const second = addCartItem(first, product, secondVariant.id, 1);
    expect(second).toHaveLength(2);
  });

  it('caps quantity at variant stock', () => {
    const cart = addCartItem([], product, firstVariant.id, firstVariant.stock + 10);
    expect(cart[0]?.quantity).toBe(firstVariant.stock);
  });

  it('removes an item when quantity becomes zero', () => {
    const cart = addCartItem([], product, firstVariant.id, 1);
    expect(updateCartQuantity(cart, product, firstVariant.id, 0)).toEqual([]);
  });
});
