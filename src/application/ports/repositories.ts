import type {
  Address,
  Category,
  Collection,
  CustomerProfile,
  HomeContent,
  Product,
  ShippingOption,
  StoreSettings,
} from '../../domain/catalog/entities';
import type { CartItem } from '../../domain/cart/cart';
import type { Order, OrderStatus, OrderStatusEvent } from '../../domain/orders/order';
import type { Coupon } from '../../domain/pricing/pricing';

export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
  findProductBySlug(slug: string): Promise<Product | undefined>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  listCategories(): Promise<Category[]>;
  saveCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  listCollections(): Promise<Collection[]>;
  saveCollection(collection: Collection): Promise<void>;
  deleteCollection(id: string): Promise<void>;
}

export interface CommerceRepository {
  getCart(): Promise<CartItem[]>;
  saveCart(cart: readonly CartItem[]): Promise<void>;
  getFavoriteProductIds(): Promise<string[]>;
  saveFavoriteProductIds(productIds: readonly string[]): Promise<void>;
}

export interface CouponRepository {
  listCoupons(): Promise<Coupon[]>;
  saveCoupon(coupon: Coupon): Promise<void>;
  deleteCoupon(id: string): Promise<void>;
}

export interface OrderRepository {
  listOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  saveOrder(order: Order): Promise<void>;
  updateOrderStatus(id: string, status: OrderStatus, event: OrderStatusEvent): Promise<void>;
}

export interface CustomerRepository {
  getProfile(): Promise<CustomerProfile>;
  saveProfile(profile: CustomerProfile): Promise<void>;
  listAddresses(): Promise<Address[]>;
  saveAddress(address: Address): Promise<void>;
  deleteAddress(id: string): Promise<void>;
}

export interface ContentRepository {
  getHomeContent(): Promise<HomeContent>;
  saveHomeContent(content: HomeContent): Promise<void>;
  getSettings(): Promise<StoreSettings>;
  saveSettings(settings: StoreSettings): Promise<void>;
}

export interface FulfillmentRepository {
  listShippingOptions(): Promise<ShippingOption[]>;
}

export interface DemoControlRepository {
  reset(): Promise<void>;
  exportData(): Promise<string>;
}
