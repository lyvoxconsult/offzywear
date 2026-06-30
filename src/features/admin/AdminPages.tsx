import { useMemo, useState, type FormEvent } from 'react';
import { Download, RotateCcw, Trash2 } from 'lucide-react';
import { useStore } from '../../app/StoreProvider';
import type { HomeContent, StoreSettings } from '../../domain/catalog/entities';
import type { OrderStatus } from '../../domain/orders/order';
import type { Coupon, CouponType } from '../../domain/pricing/pricing';
import { formatCurrency } from '../../shared/validation/format';
import { orderStatusLabel } from '../commerce/commerceUtils';
import { AdminShell } from './AdminShell';
import './admin.css';

const orderStatuses: OrderStatus[] = ['created', 'confirmed', 'preparing', 'shipped', 'delivered'];

function downloadText(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminOrdersPage() {
  const { state, actions } = useStore();
  const orders = useMemo(
    () => [...state.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.orders],
  );
  return (
    <AdminShell title="Pedidos">
      <div className="admin-panel">
        <p>Pedidos gerados localmente no checkout demonstrativo.</p>
        {orders.length === 0 ? (
          <p className="admin-empty">Nenhum pedido criado.</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.publicCode}</strong>
                      <small>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</small>
                    </td>
                    <td>{order.customerSnapshot.name}</td>
                    <td>{formatCurrency(order.totals.totalInCents)}</td>
                    <td>
                      <select
                        aria-label={`Status de ${order.publicCode}`}
                        value={order.status}
                        onChange={(event) =>
                          void actions.updateOrderStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {orderStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function newCoupon(): Coupon {
  return {
    id: `coupon-${crypto.randomUUID()}`,
    code: '',
    description: '',
    type: 'percentage',
    value: 10,
    minimumInCents: 0,
    startsAt: new Date().toISOString(),
    expiresAt: '2030-12-31T23:59:59.999Z',
    enabled: true,
    commercialValidationStatus: 'pending',
  };
}

export function AdminCouponsPage() {
  const { state, actions } = useStore();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [message, setMessage] = useState('');
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing?.code.trim()) return setMessage('Informe o código do cupom.');
    await actions.saveCoupon({ ...editing, code: editing.code.trim().toUpperCase() });
    setEditing(null);
    setMessage('Cupom salvo.');
  }
  return (
    <AdminShell
      title="Cupons"
      action={
        <button className="admin-primary" onClick={() => setEditing(newCoupon())}>
          Novo cupom
        </button>
      }
    >
      {message && (
        <p className="admin-notice" role="status">
          {message}
        </p>
      )}
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Mínimo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {state.coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>
                  <strong>{coupon.code}</strong>
                  <small>{coupon.description}</small>
                </td>
                <td>{coupon.type}</td>
                <td>
                  {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                </td>
                <td>{formatCurrency(coupon.minimumInCents)}</td>
                <td>{coupon.enabled ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => setEditing(structuredClone(coupon))}>Editar</button>
                    <button
                      aria-label={`Excluir ${coupon.code}`}
                      onClick={() => void actions.deleteCoupon(coupon.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="coupon-title">
          <form className="admin-editor compact" onSubmit={(event) => void save(event)}>
            <header>
              <h2 id="coupon-title">Cupom</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Fechar">
                ×
              </button>
            </header>
            <div className="admin-form">
              <label>
                Código
                <input
                  value={editing.code}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                />
              </label>
              <label>
                Tipo
                <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as CouponType })}
                >
                  <option value="percentage">Percentual</option>
                  <option value="fixed">Valor fixo</option>
                  <option value="free-shipping">Frete grátis</option>
                </select>
              </label>
              <label>
                Valor
                <input
                  type="number"
                  min="0"
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                />
              </label>
              <label>
                Compra mínima (R$)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editing.minimumInCents / 100}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      minimumInCents: Math.round(Number(e.target.value) * 100),
                    })
                  }
                />
              </label>
              <label className="full">
                Descrição
                <input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </label>
              <label className="check full">
                <input
                  type="checkbox"
                  checked={editing.enabled}
                  onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                />{' '}
                Ativo
              </label>
            </div>
            <footer>
              <button type="button" className="admin-secondary" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button className="admin-primary">Salvar</button>
            </footer>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

export function AdminContentPage() {
  const { state, actions } = useStore();
  const [content, setContent] = useState<HomeContent>(state.homeContent);
  const [saved, setSaved] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    await actions.saveHomeContent(content);
    setSaved(true);
  }
  return (
    <AdminShell title="Conteúdo">
      <form className="admin-panel admin-form" onSubmit={(event) => void submit(event)}>
        <h2>Home e manifesto</h2>
        <label>
          Chamada curta
          <input
            value={content.heroEyebrow}
            onChange={(e) => setContent({ ...content, heroEyebrow: e.target.value })}
          />
        </label>
        <label>
          Título principal
          <input
            value={content.heroTitle}
            onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
          />
        </label>
        <label>
          Texto principal
          <textarea
            rows={3}
            value={content.heroBody}
            onChange={(e) => setContent({ ...content, heroBody: e.target.value })}
          />
        </label>
        <label>
          CTA principal
          <input
            value={content.primaryCallToAction}
            onChange={(e) => setContent({ ...content, primaryCallToAction: e.target.value })}
          />
        </label>
        <label>
          Manifesto
          <textarea
            rows={5}
            value={content.manifesto}
            onChange={(e) => setContent({ ...content, manifesto: e.target.value })}
          />
        </label>
        {saved && (
          <p className="admin-notice" role="status">
            Conteúdo salvo.
          </p>
        )}
        <button className="admin-primary">Salvar conteúdo</button>
      </form>
    </AdminShell>
  );
}

export function AdminSettingsPage() {
  const { state, actions } = useStore();
  const [settings, setSettings] = useState<StoreSettings>(state.settings);
  const [saved, setSaved] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    await actions.saveSettings(settings);
    setSaved(true);
  }
  return (
    <AdminShell title="Configurações">
      <div className="admin-settings-grid">
        <form className="admin-panel admin-form" onSubmit={(event) => void submit(event)}>
          <h2>Loja demo</h2>
          <label>
            Nome da loja
            <input
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            />
          </label>
          <label>
            Comunicado
            <input
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
            />
          </label>
          <label>
            Frete grátis acima de (R$)
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.freeShippingThresholdInCents / 100}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  freeShippingThresholdInCents: Math.round(Number(e.target.value) * 100),
                })
              }
            />
          </label>
          <label>
            Frete padrão (R$)
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.defaultShippingInCents / 100}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultShippingInCents: Math.round(Number(e.target.value) * 100),
                })
              }
            />
          </label>
          {saved && (
            <p className="admin-notice" role="status">
              Configurações salvas.
            </p>
          )}
          <button className="admin-primary">Salvar configurações</button>
        </form>
        <section className="admin-panel danger-zone">
          <h2>Dados da demonstração</h2>
          <p>Exporte um backup JSON ou restaure os dados iniciais deste navegador.</p>
          <button
            className="admin-secondary"
            onClick={() =>
              downloadText(
                'offzywear-demo.json',
                JSON.stringify(
                  { products: state.products, orders: state.orders, coupons: state.coupons },
                  null,
                  2,
                ),
              )
            }
          >
            <Download size={16} /> Exportar
          </button>
          <button className="admin-danger" onClick={() => void actions.resetDemo()}>
            <RotateCcw size={16} /> Restaurar demonstração
          </button>
        </section>
      </div>
    </AdminShell>
  );
}
