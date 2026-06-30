import type { Product } from '../catalog/entities';
import type { CartItem } from '../cart/cart';

export type CouponType = 'percentage' | 'fixed' | 'free-shipping';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minimumInCents: number;
  startsAt: string;
  expiresAt: string;
  enabled: boolean;
  commercialValidationStatus: 'pending' | 'approved';
}

export interface PriceSummary {
  subtotalInCents: number;
  discountInCents: number;
  shippingInCents: number;
  totalInCents: number;
  appliedCouponCode?: string;
}

export interface PricingContext {
  shippingInCents: number;
  freeShippingThresholdInCents: number;
  coupon?: Coupon;
  now?: Date;
}

export function effectiveProductPrice(product: Product): number {
  if (
    product.salePriceInCents !== undefined &&
    product.salePriceInCents >= 0 &&
    product.salePriceInCents < product.basePriceInCents
  ) {
    return product.salePriceInCents;
  }

  return product.basePriceInCents;
}

export function calculateSubtotal(cart: readonly CartItem[], products: readonly Product[]): number {
  return cart.reduce((subtotal, item) => {
    const { product } = assertPurchasableCartItem(item, products);
    return subtotal + effectiveProductPrice(product) * item.quantity;
  }, 0);
}

export function assertPurchasableCartItem(
  item: CartItem,
  products: readonly Product[],
): { product: Product; variant: Product['variants'][number] } {
  const product = products.find((candidate) => candidate.id === item.productId);
  if (!product) throw new Error('Produto do carrinho não encontrado.');
  if (product.status !== 'active' && product.status !== 'active-demo') {
    throw new Error('Produto indisponível para compra.');
  }

  const variant = product.variants.find((candidate) => candidate.id === item.variantId);
  if (!variant || variant.productId !== product.id) {
    throw new Error('Variante não pertence ao produto.');
  }
  if (!variant.enabled) throw new Error('Variante indisponível para compra.');
  if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > variant.stock) {
    throw new Error('Quantidade incompatível com o estoque.');
  }

  return { product, variant };
}

export function validateCoupon(
  coupon: Coupon,
  subtotalInCents: number,
  now = new Date(),
): { valid: true } | { valid: false; reason: string } {
  if (!coupon.enabled) return { valid: false, reason: 'Cupom inativo.' };
  if (now < new Date(coupon.startsAt)) return { valid: false, reason: 'Cupom ainda não iniciou.' };
  if (now > new Date(coupon.expiresAt)) return { valid: false, reason: 'Cupom expirado.' };
  if (subtotalInCents < coupon.minimumInCents) {
    return { valid: false, reason: 'Valor mínimo do cupom não atingido.' };
  }
  if (coupon.type === 'percentage' && (coupon.value <= 0 || coupon.value > 100)) {
    return { valid: false, reason: 'Percentual do cupom inválido.' };
  }
  if (coupon.type === 'fixed' && coupon.value <= 0) {
    return { valid: false, reason: 'Valor do cupom inválido.' };
  }
  return { valid: true };
}

export function calculatePriceSummary(
  input: {
    cart: readonly CartItem[];
    products: readonly Product[];
  } & PricingContext,
): PriceSummary {
  if (!Number.isInteger(input.shippingInCents) || input.shippingInCents < 0) {
    throw new Error('Valor de frete inválido.');
  }
  if (
    !Number.isInteger(input.freeShippingThresholdInCents) ||
    input.freeShippingThresholdInCents < 0
  ) {
    throw new Error('Limite de frete grátis inválido.');
  }
  const subtotalInCents = calculateSubtotal(input.cart, input.products);
  const baseShipping =
    subtotalInCents >= input.freeShippingThresholdInCents ? 0 : input.shippingInCents;
  let shippingInCents = baseShipping;
  let discountInCents = 0;
  let appliedCouponCode: string | undefined;

  if (input.coupon) {
    const validation = validateCoupon(input.coupon, subtotalInCents, input.now);
    if (validation.valid) {
      appliedCouponCode = input.coupon.code;
      if (input.coupon.type === 'percentage') {
        discountInCents = Math.round(subtotalInCents * (input.coupon.value / 100));
      } else if (input.coupon.type === 'fixed') {
        discountInCents = Math.min(subtotalInCents, input.coupon.value);
      } else {
        shippingInCents = 0;
      }
    }
  }

  return {
    subtotalInCents,
    discountInCents,
    shippingInCents,
    totalInCents: Math.max(0, subtotalInCents - discountInCents + shippingInCents),
    ...(appliedCouponCode ? { appliedCouponCode } : {}),
  };
}
