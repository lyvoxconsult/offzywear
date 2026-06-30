import type {
  CatalogRepository,
  CommerceRepository,
  ContentRepository,
  CouponRepository,
  CustomerRepository,
  DemoControlRepository,
  FulfillmentRepository,
  OrderRepository,
} from '../../../application/ports/repositories';
import type {
  Address,
  Category,
  Collection,
  CustomerProfile,
  HomeContent,
  Product,
  StoreSettings,
} from '../../../domain/catalog/entities';
import type { CartItem } from '../../../domain/cart/cart';
import type { Order, OrderStatus, OrderStatusEvent } from '../../../domain/orders/order';
import type { Coupon } from '../../../domain/pricing/pricing';
import type { DemoDatabaseStore } from '../storage/versionedStorage';

export class DemoStoreRepository
  implements
    CatalogRepository,
    CommerceRepository,
    CouponRepository,
    OrderRepository,
    CustomerRepository,
    ContentRepository,
    FulfillmentRepository,
    DemoControlRepository
{
  public constructor(private readonly store: DemoDatabaseStore) {}

  public async listProducts() {
    return structuredClone(this.store.load().products);
  }

  public async findProductBySlug(slug: string) {
    return structuredClone(this.store.load().products.find((product) => product.slug === slug));
  }

  public async saveProduct(product: Product) {
    this.store.update((database) => {
      const index = database.products.findIndex((candidate) => candidate.id === product.id);
      if (index >= 0) database.products[index] = structuredClone(product);
      else database.products.push(structuredClone(product));
      return database;
    });
  }

  public async deleteProduct(id: string) {
    this.store.update((database) => ({
      ...database,
      products: database.products.filter((item) => item.id !== id),
      cart: database.cart.filter((item) => item.productId !== id),
      favoriteProductIds: database.favoriteProductIds.filter((productId) => productId !== id),
    }));
  }

  public async listCategories() {
    return structuredClone(this.store.load().categories);
  }

  public async saveCategory(category: Category) {
    this.store.update((database) => {
      const index = database.categories.findIndex((item) => item.id === category.id);
      if (index >= 0) database.categories[index] = structuredClone(category);
      else database.categories.push(structuredClone(category));
      return database;
    });
  }

  public async deleteCategory(id: string) {
    this.store.update((database) => {
      if (database.products.some((product) => product.categoryId === id)) {
        throw new Error('Categoria em uso não pode ser excluída.');
      }
      database.categories = database.categories.filter((item) => item.id !== id);
      return database;
    });
  }

  public async listCollections() {
    return structuredClone(this.store.load().collections);
  }

  public async saveCollection(collection: Collection) {
    this.store.update((database) => {
      const index = database.collections.findIndex((item) => item.id === collection.id);
      if (index >= 0) database.collections[index] = structuredClone(collection);
      else database.collections.push(structuredClone(collection));
      return database;
    });
  }

  public async deleteCollection(id: string) {
    this.store.update((database) => {
      if (database.products.some((product) => product.collectionIds.includes(id))) {
        throw new Error('Coleção em uso não pode ser excluída.');
      }
      database.collections = database.collections.filter((item) => item.id !== id);
      return database;
    });
  }

  public async getCart() {
    return structuredClone(this.store.load().cart);
  }

  public async saveCart(cart: readonly CartItem[]) {
    this.store.update((database) => ({
      ...database,
      cart: cart.map((item) => ({ ...item })),
    }));
  }

  public async getFavoriteProductIds() {
    return [...this.store.load().favoriteProductIds];
  }

  public async saveFavoriteProductIds(productIds: readonly string[]) {
    this.store.update((database) => ({
      ...database,
      favoriteProductIds: [...new Set(productIds)],
    }));
  }

  public async listCoupons() {
    return structuredClone(this.store.load().coupons);
  }

  public async saveCoupon(coupon: Coupon) {
    this.store.update((database) => {
      const index = database.coupons.findIndex((item) => item.id === coupon.id);
      if (index >= 0) database.coupons[index] = structuredClone(coupon);
      else database.coupons.push(structuredClone(coupon));
      return database;
    });
  }

  public async deleteCoupon(id: string) {
    this.store.update((database) => ({
      ...database,
      coupons: database.coupons.filter((item) => item.id !== id),
    }));
  }

  public async listOrders() {
    return structuredClone(this.store.load().orders);
  }

  public async getOrder(id: string) {
    return structuredClone(this.store.load().orders.find((order) => order.id === id));
  }

  public async saveOrder(order: Order) {
    this.store.update((database) => {
      if (database.orders.some((candidate) => candidate.id === order.id)) {
        throw new Error('Pedido duplicado.');
      }
      if (
        database.orders.some(
          (candidate) => candidate.publicCode.toUpperCase() === order.publicCode.toUpperCase(),
        )
      ) {
        throw new Error('Código público de pedido duplicado.');
      }
      database.orders.unshift(structuredClone(order));
      return database;
    });
  }

  public async updateOrderStatus(id: string, status: OrderStatus, event: OrderStatusEvent) {
    if (event.status !== status) throw new Error('Evento de status inconsistente.');
    this.store.update((database) => {
      const order = database.orders.find((item) => item.id === id);
      if (!order) throw new Error('Pedido não encontrado.');
      order.status = status;
      order.statusHistory.push(structuredClone(event));
      return database;
    });
  }

  public async getProfile() {
    return structuredClone(this.store.load().customerProfile);
  }

  public async saveProfile(profile: CustomerProfile) {
    this.store.update((database) => ({ ...database, customerProfile: structuredClone(profile) }));
  }

  public async listAddresses() {
    return structuredClone(this.store.load().addresses);
  }

  public async saveAddress(address: Address) {
    this.store.update((database) => {
      if (address.isDefault) {
        database.addresses = database.addresses.map((item) => ({ ...item, isDefault: false }));
      }
      const index = database.addresses.findIndex((item) => item.id === address.id);
      if (index >= 0) database.addresses[index] = structuredClone(address);
      else database.addresses.push(structuredClone(address));
      return database;
    });
  }

  public async deleteAddress(id: string) {
    this.store.update((database) => ({
      ...database,
      addresses: database.addresses.filter((item) => item.id !== id),
    }));
  }

  public async getHomeContent() {
    return structuredClone(this.store.load().homeContent);
  }

  public async saveHomeContent(content: HomeContent) {
    this.store.update((database) => ({ ...database, homeContent: structuredClone(content) }));
  }

  public async getSettings() {
    return structuredClone(this.store.load().settings);
  }

  public async saveSettings(settings: StoreSettings) {
    this.store.update((database) => ({ ...database, settings: structuredClone(settings) }));
  }

  public async listShippingOptions() {
    return structuredClone(this.store.load().shippingOptions);
  }

  public async reset() {
    this.store.reset();
  }

  public async exportData() {
    return JSON.stringify(this.store.load(), null, 2);
  }
}
