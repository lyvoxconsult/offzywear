import { PackageOpen, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import { formatCurrency } from '../../shared/validation/format';
import { orderStatusLabel } from '../commerce/commerceUtils';
import { AccountShell } from './AccountShell';

export function OrdersPage() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  async function repurchase(id: string) {
    await actions.repurchaseOrder(id);
    void navigate('/carrinho');
  }
  return (
    <AccountShell title="Pedidos">
      {!state.orders.length ? (
        <div className="account-empty">
          <PackageOpen size={36} />
          <h2>Ainda não há pedidos.</h2>
          <p>Conclua um checkout demonstrativo para acompanhar tudo aqui.</p>
          <Link to="/produtos">Explorar coleção</Link>
        </div>
      ) : (
        <div className="orders-list">
          {[...state.orders].reverse().map((order) => (
            <article key={order.id}>
              <div>
                <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                <h2>{order.publicCode}</h2>
                <p>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} ·{' '}
                  {formatCurrency(order.totals.totalInCents)}
                </p>
              </div>
              <span className="status-pill">{orderStatusLabel(order.status)}</span>
              <div className="order-actions">
                <Link to={`/conta/pedidos/${order.id}`}>Detalhes</Link>
                <button onClick={() => void repurchase(order.id)}>
                  <RotateCcw size={16} /> Comprar novamente
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
