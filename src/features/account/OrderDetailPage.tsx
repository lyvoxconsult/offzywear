import { RotateCcw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import { formatCurrency } from '../../shared/validation/format';
import { orderStatusLabel } from '../commerce/commerceUtils';
import { AccountShell } from './AccountShell';

export function OrderDetailPage() {
  const { state, actions } = useStore();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = state.orders.find((item) => item.id === orderId);
  if (!order)
    return (
      <AccountShell title="Pedido não encontrado">
        <Link to="/conta/pedidos">Voltar aos pedidos</Link>
      </AccountShell>
    );
  const currentOrder = order;
  async function repurchase() {
    await actions.repurchaseOrder(currentOrder.id);
    void navigate('/carrinho');
  }
  return (
    <AccountShell title={order.publicCode} eyebrow="Detalhes do pedido">
      <div className="order-detail">
        <section>
          <h2>Itens</h2>
          {order.items.map((item) => (
            <article className="order-item" key={item.variantId}>
              <img src={item.imageUrl} alt="" />
              <div>
                <h3>{item.productName}</h3>
                <p>
                  {item.colorName} · {item.size} · Qtd. {item.quantity}
                </p>
              </div>
              <strong>{formatCurrency(item.subtotalInCents)}</strong>
            </article>
          ))}
        </section>
        <section>
          <h2>Acompanhamento</h2>
          <ol className="timeline">
            {order.statusHistory.map((event, index) => (
              <li key={`${event.status}-${index}`}>
                <i />
                <div>
                  <strong>{event.label || orderStatusLabel(event.status)}</strong>
                  <time>{new Date(event.occurredAt).toLocaleString('pt-BR')}</time>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="order-info">
          <div>
            <h2>Entrega</h2>
            <p>
              {order.deliveryAddressSnapshot.recipientName}
              <br />
              {order.deliveryAddressSnapshot.street}, {order.deliveryAddressSnapshot.number}
              <br />
              {order.deliveryAddressSnapshot.city}/{order.deliveryAddressSnapshot.state}
            </p>
          </div>
          <div>
            <h2>Pagamento</h2>
            <p>
              {order.paymentMethod === 'pix-demo' ? 'PIX demonstrativo' : 'Cartão demonstrativo'}
              <br />
              Nenhuma cobrança real.
            </p>
          </div>
        </section>
        <section className="order-total">
          <span>Total</span>
          <strong>{formatCurrency(order.totals.totalInCents)}</strong>
        </section>
        <button className="repurchase" onClick={() => void repurchase()}>
          <RotateCcw size={16} /> Comprar novamente
        </button>
      </div>
    </AccountShell>
  );
}
