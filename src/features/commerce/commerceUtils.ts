import type { CartItem } from '../../domain/cart/cart';
import type { Product } from '../../domain/catalog/entities';
import { effectiveProductPrice } from '../../domain/pricing/pricing';

export function cartDetails(cart: CartItem[], products: Product[]) {
  return cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
    return product && variant ? [{ item, product, variant }] : [];
  });
}

export function cartSubtotal(cart: CartItem[], products: Product[]) {
  return cartDetails(cart, products).reduce(
    (total, row) => total + effectiveProductPrice(row.product) * row.item.quantity,
    0,
  );
}

export function orderStatusLabel(status: string) {
  return (
    {
      created: 'Criado',
      confirmed: 'Confirmado',
      preparing: 'Em preparação',
      shipped: 'Enviado',
      delivered: 'Entregue',
    }[status] ?? status
  );
}
