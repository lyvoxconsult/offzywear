import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import type { Order } from '../../domain/orders/order';
import { formatCurrency } from '../../shared/validation/format';
import './commerce.css';

export function CheckoutSuccessPage() {
  const { state } = useStore();
  const { orderId } = useParams();
  const location = useLocation();
  const navigatedOrder = (location.state as { order?: Order } | null)?.order;
  const order = navigatedOrder ?? state.orders.find((candidate) => candidate.id === orderId);
  if (!order)
    return (
      <main className="shop-page shop-empty">
        <h1>Pedido não encontrado</h1>
        <Link className="shop-button" to="/conta/pedidos">
          Ver meus pedidos
        </Link>
      </main>
    );
  return (
    <main className="shop-page success-card">
      <CheckCircle2 size={52} />
      <span className="shop-kicker">Demonstração concluída</span>
      <h1>Pedido criado.</h1>
      <p>
        Código <strong>{order.publicCode}</strong>. Nenhum pagamento foi processado.
      </p>
      <div>
        <span>Total</span>
        <strong>{formatCurrency(order.totals.totalInCents)}</strong>
      </div>
      <div className="success-actions">
        <Link className="shop-button" to={`/conta/pedidos/${order.id}`}>
          Acompanhar pedido
        </Link>
        <Link className="shop-link" to="/produtos">
          Voltar à loja
        </Link>
      </div>
    </main>
  );
}
