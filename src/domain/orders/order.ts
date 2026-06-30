import type { Address, CustomerProfile, Product, ShippingOption } from '../catalog/entities';
import type { CartItem } from '../cart/cart';
import {
  assertPurchasableCartItem,
  calculatePriceSummary,
  effectiveProductPrice,
  type PriceSummary,
  type PricingContext,
} from '../pricing/pricing';

export type OrderStatus = 'created' | 'confirmed' | 'preparing' | 'shipped' | 'delivered';
export type DemoPaymentMethod = 'pix-demo' | 'card-demo';

export interface OrderStatusEvent {
  status: OrderStatus;
  occurredAt: string;
  label: string;
}

export type CustomerSnapshot = Pick<CustomerProfile, 'id' | 'name' | 'email' | 'phone'>;
export type AddressSnapshot = Omit<Address, 'isDefault'>;
export type ShippingOptionSnapshot = ShippingOption;

export interface OrderItemSnapshot {
  productId: string;
  variantId: string;
  productName: string;
  slug: string;
  sku: string;
  colorName: string;
  size: string;
  imageUrl: string;
  unitPriceInCents: number;
  quantity: number;
  subtotalInCents: number;
}

export interface Order {
  id: string;
  publicCode: string;
  items: OrderItemSnapshot[];
  totals: PriceSummary;
  customerSnapshot: CustomerSnapshot;
  deliveryAddressSnapshot: AddressSnapshot;
  shippingSnapshot: ShippingOptionSnapshot;
  paymentMethod: DemoPaymentMethod;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
}

export function createOrderItemSnapshots(
  cart: readonly CartItem[],
  products: readonly Product[],
): OrderItemSnapshot[] {
  return cart.map((item) => {
    const { product, variant } = assertPurchasableCartItem(item, products);

    const unitPriceInCents = effectiveProductPrice(product);
    return {
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      slug: product.slug,
      sku: variant.sku,
      colorName: variant.colorName,
      size: variant.size,
      imageUrl: product.images[0]?.src ?? '',
      unitPriceInCents,
      quantity: item.quantity,
      subtotalInCents: unitPriceInCents * item.quantity,
    };
  });
}

export function createDemoOrder(input: {
  id: string;
  publicCode: string;
  cart: readonly CartItem[];
  products: readonly Product[];
  pricing: Omit<PricingContext, 'shippingInCents'>;
  customer: CustomerProfile;
  deliveryAddress: Address;
  shipping: ShippingOption;
  paymentMethod: DemoPaymentMethod;
  createdAt?: string;
}): Order {
  if (input.cart.length === 0) throw new Error('Carrinho vazio.');

  const totals = calculatePriceSummary({
    cart: input.cart,
    products: input.products,
    shippingInCents: input.shipping.priceInCents,
    ...input.pricing,
  });
  const items = createOrderItemSnapshots(input.cart, input.products);
  const createdAt = input.createdAt ?? new Date().toISOString();

  return {
    id: input.id,
    publicCode: input.publicCode,
    items,
    totals,
    customerSnapshot: {
      id: input.customer.id,
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
    },
    deliveryAddressSnapshot: {
      id: input.deliveryAddress.id,
      label: input.deliveryAddress.label,
      recipientName: input.deliveryAddress.recipientName,
      postalCode: input.deliveryAddress.postalCode,
      street: input.deliveryAddress.street,
      number: input.deliveryAddress.number,
      ...(input.deliveryAddress.complement ? { complement: input.deliveryAddress.complement } : {}),
      neighborhood: input.deliveryAddress.neighborhood,
      city: input.deliveryAddress.city,
      state: input.deliveryAddress.state,
      demoData: true,
    },
    shippingSnapshot: { ...input.shipping },
    paymentMethod: input.paymentMethod,
    status: 'created',
    statusHistory: [{ status: 'created', occurredAt: createdAt, label: 'Pedido criado' }],
    createdAt,
  };
}
