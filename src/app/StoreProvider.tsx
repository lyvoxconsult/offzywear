/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CatalogRepository,
  CommerceRepository,
  ContentRepository,
  CouponRepository,
  CustomerRepository,
  DemoControlRepository,
  FulfillmentRepository,
  OrderRepository,
} from '../application/ports/repositories';
import { addCartItem, updateCartQuantity, type CartItem } from '../domain/cart/cart';
import type {
  Address,
  Category,
  Collection,
  CustomerProfile,
  HomeContent,
  Product,
  ShippingOption,
  StoreSettings,
} from '../domain/catalog/entities';
import {
  createDemoOrder,
  type DemoPaymentMethod,
  type Order,
  type OrderStatus,
} from '../domain/orders/order';
import type { Coupon } from '../domain/pricing/pricing';
import { offzySeed } from '../data/seeds/offzySeed';
import { createDemoRepositories } from '../infrastructure/demo/adapters/createDemoRepositories';

type StoreRepositories = CatalogRepository &
  CommerceRepository &
  ContentRepository &
  CouponRepository &
  CustomerRepository &
  DemoControlRepository &
  FulfillmentRepository &
  OrderRepository;

export interface StoreState {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  cart: CartItem[];
  favoriteProductIds: string[];
  coupons: Coupon[];
  orders: Order[];
  profile: CustomerProfile;
  addresses: Address[];
  shippingOptions: ShippingOption[];
  homeContent: HomeContent;
  settings: StoreSettings;
  loading: boolean;
  error: string | null;
  appliedCouponCode?: string;
}

export interface PlaceOrderInput {
  addressId: string;
  shippingOptionId: string;
  paymentMethod: DemoPaymentMethod;
  couponCode?: string;
}

export interface StoreActions {
  refresh(): Promise<void>;
  addToCart(product: Product, variantId: string, quantity?: number): Promise<void>;
  updateCart(product: Product, variantId: string, quantity: number): Promise<void>;
  updateCartQuantity(product: Product, variantId: string, quantity: number): Promise<void>;
  removeCart(productId: string, variantId: string): Promise<void>;
  removeFromCart(productId: string, variantId: string): Promise<void>;
  clearCart(): Promise<void>;
  toggleFavorite(productId: string): Promise<void>;
  setAppliedCouponCode(code?: string): void;
  createOrder(input: PlaceOrderInput): Promise<Order>;
  placeDemoOrder(input: PlaceOrderInput): Promise<Order>;
  repurchaseOrder(orderId: string): Promise<void>;
  saveProfile(profile: CustomerProfile): Promise<void>;
  saveAddress(address: Address): Promise<void>;
  deleteAddress(id: string): Promise<void>;
  saveProduct(product: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  saveCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  saveCollection(collection: Collection): Promise<void>;
  deleteCollection(id: string): Promise<void>;
  saveCoupon(coupon: Coupon): Promise<void>;
  deleteCoupon(id: string): Promise<void>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
  saveHomeContent(content: HomeContent): Promise<void>;
  saveSettings(settings: StoreSettings): Promise<void>;
  resetDemo(): Promise<void>;
}

interface StoreContextValue {
  state: StoreState;
  actions: StoreActions;
}

const initialState: StoreState = {
  products: structuredClone(offzySeed.products),
  categories: structuredClone(offzySeed.categories),
  collections: structuredClone(offzySeed.collections),
  cart: [],
  favoriteProductIds: [],
  coupons: structuredClone(offzySeed.coupons),
  orders: [],
  profile: structuredClone(offzySeed.customerProfile),
  addresses: structuredClone(offzySeed.addresses),
  shippingOptions: structuredClone(offzySeed.shippingOptions),
  homeContent: structuredClone(offzySeed.homeContent),
  settings: structuredClone(offzySeed.settings),
  loading: true,
  error: null,
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível concluir a operação.';
}

function createId(prefix: string): string {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}-${suffix}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const repositories = useMemo<StoreRepositories>(
    () => createDemoRepositories(window.localStorage),
    [],
  );
  const [state, setState] = useState<StoreState>(initialState);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const [
        products,
        categories,
        collections,
        cart,
        favoriteProductIds,
        coupons,
        orders,
        profile,
        addresses,
        shippingOptions,
        homeContent,
        settings,
      ] = await Promise.all([
        repositories.listProducts(),
        repositories.listCategories(),
        repositories.listCollections(),
        repositories.getCart(),
        repositories.getFavoriteProductIds(),
        repositories.listCoupons(),
        repositories.listOrders(),
        repositories.getProfile(),
        repositories.listAddresses(),
        repositories.listShippingOptions(),
        repositories.getHomeContent(),
        repositories.getSettings(),
      ]);
      setState((current) => ({
        ...current,
        products,
        categories,
        collections,
        cart,
        favoriteProductIds,
        coupons,
        orders,
        profile,
        addresses,
        shippingOptions,
        homeContent,
        settings,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: errorMessage(error) }));
    }
  }, [repositories]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runAndRefresh = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        await operation();
        await refresh();
      } catch (error) {
        const message = errorMessage(error);
        setState((current) => ({ ...current, error: message, loading: false }));
        throw error;
      }
    },
    [refresh],
  );

  const addToCartAction = useCallback(
    async (product: Product, variantId: string, quantity = 1) => {
      await runAndRefresh(async () => {
        const cart = await repositories.getCart();
        await repositories.saveCart(addCartItem(cart, product, variantId, quantity));
      });
    },
    [repositories, runAndRefresh],
  );

  const updateCartAction = useCallback(
    async (product: Product, variantId: string, quantity: number) => {
      await runAndRefresh(async () => {
        const cart = await repositories.getCart();
        await repositories.saveCart(updateCartQuantity(cart, product, variantId, quantity));
      });
    },
    [repositories, runAndRefresh],
  );

  const removeCartAction = useCallback(
    async (productId: string, variantId: string) => {
      await runAndRefresh(async () => {
        const cart = await repositories.getCart();
        await repositories.saveCart(
          cart.filter((item) => item.productId !== productId || item.variantId !== variantId),
        );
      });
    },
    [repositories, runAndRefresh],
  );

  const placeOrder = useCallback(
    async (input: PlaceOrderInput) => {
      const [cart, products, profile, addresses, shippingOptions, coupons] = await Promise.all([
        repositories.getCart(),
        repositories.listProducts(),
        repositories.getProfile(),
        repositories.listAddresses(),
        repositories.listShippingOptions(),
        repositories.listCoupons(),
      ]);
      const deliveryAddress = addresses.find((item) => item.id === input.addressId);
      const shipping = shippingOptions.find((item) => item.id === input.shippingOptionId);
      if (!deliveryAddress) throw new Error('Selecione um endereço de entrega.');
      if (!shipping) throw new Error('Selecione uma opção de frete.');
      const couponCode = input.couponCode?.trim().toUpperCase();
      const coupon = couponCode
        ? coupons.find((item) => item.code.toUpperCase() === couponCode)
        : undefined;
      if (couponCode && !coupon) throw new Error('Cupom não encontrado.');
      const createdAt = new Date().toISOString();
      const order = createDemoOrder({
        id: createId('order'),
        publicCode: `OFF-${Date.now().toString().slice(-8)}`,
        cart,
        products,
        pricing: {
          freeShippingThresholdInCents: state.settings.freeShippingThresholdInCents,
          ...(coupon ? { coupon } : {}),
        },
        customer: profile,
        deliveryAddress,
        shipping,
        paymentMethod: input.paymentMethod,
        createdAt,
      });
      await repositories.saveOrder(order);
      await repositories.saveCart([]);
      setState((current) => ({ ...current, appliedCouponCode: undefined }));
      await refresh();
      return order;
    },
    [refresh, repositories, state.settings.freeShippingThresholdInCents],
  );

  const actions = useMemo<StoreActions>(
    () => ({
      refresh,
      addToCart: addToCartAction,
      updateCart: updateCartAction,
      updateCartQuantity: updateCartAction,
      removeCart: removeCartAction,
      removeFromCart: removeCartAction,
      async clearCart() {
        await runAndRefresh(() => repositories.saveCart([]));
      },
      async toggleFavorite(productId) {
        await runAndRefresh(async () => {
          const current = await repositories.getFavoriteProductIds();
          await repositories.saveFavoriteProductIds(
            current.includes(productId)
              ? current.filter((id) => id !== productId)
              : [...current, productId],
          );
        });
      },
      setAppliedCouponCode(code) {
        setState((current) => ({ ...current, appliedCouponCode: code }));
      },
      createOrder: placeOrder,
      placeDemoOrder: placeOrder,
      async repurchaseOrder(orderId) {
        const [order, products, cart] = await Promise.all([
          repositories.getOrder(orderId),
          repositories.listProducts(),
          repositories.getCart(),
        ]);
        if (!order) throw new Error('Pedido não encontrado.');
        let nextCart = cart;
        for (const item of order.items) {
          const product = products.find((candidate) => candidate.id === item.productId);
          if (!product) continue;
          try {
            nextCart = addCartItem(nextCart, product, item.variantId, item.quantity);
          } catch {
            // Produto histórico pode não estar mais disponível; demais itens continuam.
          }
        }
        if (nextCart.length === cart.length) throw new Error('Nenhum item está disponível.');
        await repositories.saveCart(nextCart);
        await refresh();
      },
      async saveProfile(profile) {
        await runAndRefresh(() => repositories.saveProfile(profile));
      },
      async saveAddress(address) {
        await runAndRefresh(() => repositories.saveAddress(address));
      },
      async deleteAddress(id) {
        await runAndRefresh(() => repositories.deleteAddress(id));
      },
      async saveProduct(product) {
        await runAndRefresh(() => repositories.saveProduct(product));
      },
      async deleteProduct(id) {
        await runAndRefresh(() => repositories.deleteProduct(id));
      },
      async saveCategory(category) {
        await runAndRefresh(() => repositories.saveCategory(category));
      },
      async deleteCategory(id) {
        await runAndRefresh(() => repositories.deleteCategory(id));
      },
      async saveCollection(collection) {
        await runAndRefresh(() => repositories.saveCollection(collection));
      },
      async deleteCollection(id) {
        await runAndRefresh(() => repositories.deleteCollection(id));
      },
      async saveCoupon(coupon) {
        await runAndRefresh(() => repositories.saveCoupon(coupon));
      },
      async deleteCoupon(id) {
        await runAndRefresh(() => repositories.deleteCoupon(id));
      },
      async updateOrderStatus(id, status) {
        await runAndRefresh(() =>
          repositories.updateOrderStatus(id, status, {
            status,
            occurredAt: new Date().toISOString(),
            label: status,
          }),
        );
      },
      async saveHomeContent(content) {
        await runAndRefresh(() => repositories.saveHomeContent(content));
      },
      async saveSettings(settings) {
        await runAndRefresh(() => repositories.saveSettings(settings));
      },
      async resetDemo() {
        await repositories.reset();
        setState(initialState);
        await refresh();
      },
    }),
    [
      addToCartAction,
      placeOrder,
      refresh,
      removeCartAction,
      repositories,
      runAndRefresh,
      updateCartAction,
    ],
  );

  return <StoreContext.Provider value={{ state, actions }}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore precisa estar dentro de StoreProvider.');
  return context;
}
