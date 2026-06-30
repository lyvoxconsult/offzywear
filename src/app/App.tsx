import { Navigate, Route, Routes } from 'react-router-dom';
import { StoreLayout } from './StoreLayout';
import { StoreProvider } from './StoreProvider';
import {
  AboutPage,
  CatalogPage,
  ContactPage,
  FaqPage,
  HomePage,
  NotFoundPage,
  PolicyPage,
  ProductPage,
  SizeGuidePage,
} from '../features/storefront';
import { CartPage } from '../features/commerce/CartPage';
import { CheckoutPage } from '../features/commerce/CheckoutPage';
import { CheckoutSuccessPage } from '../features/commerce/CheckoutSuccessPage';
import { FavoritesPage } from '../features/commerce/FavoritesPage';
import { ProfilePage } from '../features/account/ProfilePage';
import { AddressesPage } from '../features/account/AddressesPage';
import { OrdersPage } from '../features/account/OrdersPage';
import { OrderDetailPage } from '../features/account/OrderDetailPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { ProductsAdminPage } from '../features/admin/ProductsAdminPage';
import {
  AdminContentPage,
  AdminCouponsPage,
  AdminOrdersPage,
  AdminSettingsPage,
} from '../features/admin/AdminPages';

export function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="loja" element={<CatalogPage />} />
          <Route path="produtos" element={<Navigate replace to="/loja" />} />
          <Route path="categoria/:slug" element={<CatalogPage mode="category" />} />
          <Route path="colecoes/:slug" element={<CatalogPage mode="collection" />} />
          <Route path="colecao/:slug" element={<CatalogPage mode="collection" />} />
          <Route path="busca" element={<CatalogPage mode="search" />} />
          <Route path="produto/:slug" element={<ProductPage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="carrinho" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/sucesso/:orderId" element={<CheckoutSuccessPage />} />
          <Route path="pedido-confirmado/:orderId" element={<CheckoutSuccessPage />} />
          <Route path="conta" element={<Navigate replace to="/conta/perfil" />} />
          <Route path="conta/perfil" element={<ProfilePage />} />
          <Route path="conta/enderecos" element={<AddressesPage />} />
          <Route path="conta/pedidos" element={<OrdersPage />} />
          <Route path="conta/pedidos/:orderId" element={<OrderDetailPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="manifesto" element={<AboutPage />} />
          <Route path="guia-de-medidas" element={<SizeGuidePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="politica-de-trocas" element={<Navigate replace to="/politicas/trocas" />} />
          <Route
            path="politica-de-privacidade"
            element={<Navigate replace to="/politicas/privacidade" />}
          />
          <Route path="termos-de-uso" element={<Navigate replace to="/politicas/termos" />} />
          <Route path="politicas/:slug" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="admin/produtos" element={<ProductsAdminPage />} />
        <Route path="admin/pedidos" element={<AdminOrdersPage />} />
        <Route path="admin/cupons" element={<AdminCouponsPage />} />
        <Route path="admin/conteudo" element={<AdminContentPage />} />
        <Route path="admin/configuracoes" element={<AdminSettingsPage />} />
      </Routes>
    </StoreProvider>
  );
}
