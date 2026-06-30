import { Link } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import { formatCurrency } from '../../shared/validation/format';
import { AdminShell } from './AdminShell';

export function AdminDashboardPage() {
  const { state } = useStore();
  const revenue = state.orders.reduce((total, order) => total + order.totals.totalInCents, 0);
  const lowStock = state.products
    .flatMap((product) => product.variants)
    .filter((variant) => variant.enabled && variant.stock <= 3).length;
  return (
    <AdminShell title="Visão geral">
      <section className="admin-metrics">
        <article>
          <span>Produtos</span>
          <strong>{state.products.length}</strong>
          <Link to="/admin/produtos">Gerenciar</Link>
        </article>
        <article>
          <span>Pedidos demo</span>
          <strong>{state.orders.length}</strong>
          <Link to="/admin/pedidos">Acompanhar</Link>
        </article>
        <article>
          <span>Valor simulado</span>
          <strong>{formatCurrency(revenue)}</strong>
        </article>
        <article>
          <span>Variantes com estoque baixo</span>
          <strong>{lowStock}</strong>
          <Link to="/admin/produtos">Revisar</Link>
        </article>
      </section>
      <section className="admin-panel">
        <h2>Operação da demonstração</h2>
        <p>
          Dados permanecem somente neste navegador. Produtos pendentes devem ser aprovados
          comercialmente antes de uso real.
        </p>
      </section>
    </AdminShell>
  );
}
