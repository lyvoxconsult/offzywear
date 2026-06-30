import type { Product, ProductVariant } from '../catalog/entities';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  addedAt: string;
}

export function cartItemKey(item: Pick<CartItem, 'productId' | 'variantId'>): string {
  return `${item.productId}:${item.variantId}`;
}

export function findVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId && variant.enabled);
}

export function addCartItem(
  cart: readonly CartItem[],
  product: Product,
  variantId: string,
  quantity = 1,
  now = new Date().toISOString(),
): CartItem[] {
  const variant = findVariant(product, variantId);

  if (!variant) throw new Error('Variante indisponível.');
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Quantidade inválida.');
  if (variant.stock < 1) throw new Error('Produto sem estoque.');

  const key = `${product.id}:${variantId}`;
  const current = cart.find((item) => cartItemKey(item) === key);
  const nextQuantity = Math.min(variant.stock, (current?.quantity ?? 0) + quantity);

  if (current) {
    return cart.map((item) =>
      cartItemKey(item) === key ? { ...item, quantity: nextQuantity } : item,
    );
  }

  return [...cart, { productId: product.id, variantId, quantity: nextQuantity, addedAt: now }];
}

export function updateCartQuantity(
  cart: readonly CartItem[],
  product: Product,
  variantId: string,
  quantity: number,
): CartItem[] {
  const variant = findVariant(product, variantId);
  if (!variant) throw new Error('Variante indisponível.');
  if (!Number.isInteger(quantity)) throw new Error('Quantidade inválida.');

  const key = `${product.id}:${variantId}`;
  if (quantity <= 0) return cart.filter((item) => cartItemKey(item) !== key);

  return cart.map((item) =>
    cartItemKey(item) === key ? { ...item, quantity: Math.min(quantity, variant.stock) } : item,
  );
}
