import { type FormEvent, useMemo, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import { calculatePriceSummary } from '../../domain/pricing/pricing';
import type { DemoPaymentMethod } from '../../domain/orders/order';
import { formatCurrency } from '../../shared/validation/format';
import './commerce.css';

export function CheckoutPage() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState(
    state.addresses.find((address) => address.isDefault)?.id ?? state.addresses[0]?.id ?? '',
  );
  const [shippingOptionId, setShippingOptionId] = useState(state.shippingOptions[0]?.id ?? '');
  const [paymentMethod, setPaymentMethod] = useState<DemoPaymentMethod>('pix-demo');
  const [couponInput, setCouponInput] = useState(state.appliedCouponCode ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const shipping = state.shippingOptions.find((option) => option.id === shippingOptionId);
  const coupon = state.coupons.find(
    (item) => item.code.toUpperCase() === state.appliedCouponCode?.toUpperCase(),
  );
  const totals = useMemo(
    () =>
      calculatePriceSummary({
        cart: state.cart,
        products: state.products,
        shippingInCents: shipping?.priceInCents ?? 0,
        freeShippingThresholdInCents: state.settings.freeShippingThresholdInCents,
        ...(coupon ? { coupon } : {}),
      }),
    [state.cart, state.products, state.settings.freeShippingThresholdInCents, shipping, coupon],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!addressId || !shippingOptionId || !state.cart.length) {
      setError('Revise endereço, entrega e itens antes de concluir.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await actions.placeDemoOrder({
        addressId,
        shippingOptionId,
        paymentMethod,
        ...(state.appliedCouponCode ? { couponCode: state.appliedCouponCode } : {}),
      });
      void navigate(`/checkout/sucesso/${order.id}`, { state: { order } });
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Não foi possível criar o pedido demonstrativo.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!state.cart.length)
    return (
      <main className="shop-page shop-empty">
        <h1>Carrinho vazio</h1>
        <p>Adicione uma peça antes de seguir para o checkout.</p>
        <Link className="shop-button" to="/produtos">
          Ver coleção
        </Link>
      </main>
    );
  return (
    <main className="shop-page checkout-page">
      <header className="shop-heading">
        <div>
          <span className="shop-kicker">Checkout demonstrativo</span>
          <h1>Finalizar pedido</h1>
        </div>
        <span className="secure-label">
          <LockKeyhole size={16} /> Nenhuma cobrança real
        </span>
      </header>
      <form className="checkout-layout" onSubmit={(event) => void submit(event)}>
        <div className="checkout-sections">
          <fieldset>
            <legend>1. Contato</legend>
            <div className="field-grid">
              <label>
                Nome
                <input value={state.profile.name} readOnly />
              </label>
              <label>
                E-mail
                <input value={state.profile.email} readOnly />
              </label>
            </div>
            <Link className="shop-link" to="/conta/perfil">
              Editar perfil
            </Link>
          </fieldset>
          <fieldset>
            <legend>2. Endereço de entrega</legend>
            <div className="choice-grid">
              {state.addresses.map((address) => (
                <label
                  className={`choice-card ${addressId === address.id ? 'selected' : ''}`}
                  key={address.id}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={addressId === address.id}
                    onChange={() => setAddressId(address.id)}
                  />
                  <strong>{address.label}</strong>
                  <span>
                    {address.street}, {address.number}
                  </span>
                  <span>
                    {address.city} · {address.state}
                  </span>
                </label>
              ))}
            </div>
            <Link className="shop-link" to="/conta/enderecos">
              Gerenciar endereços
            </Link>
          </fieldset>
          <fieldset>
            <legend>3. Entrega</legend>
            <div className="choice-grid">
              {state.shippingOptions.map((option) => (
                <label
                  className={`choice-card ${shippingOptionId === option.id ? 'selected' : ''}`}
                  key={option.id}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingOptionId === option.id}
                    onChange={() => setShippingOptionId(option.id)}
                  />
                  <strong>{option.name}</strong>
                  <span>
                    {option.estimatedMinDays}–{option.estimatedMaxDays} dias úteis
                  </span>
                  <span>{formatCurrency(option.priceInCents)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>4. Pagamento simulado</legend>
            <div className="choice-grid">
              <label className={`choice-card ${paymentMethod === 'pix-demo' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'pix-demo'}
                  onChange={() => setPaymentMethod('pix-demo')}
                />
                <strong>PIX demonstrativo</strong>
                <span>Sem QR Code ou transação real.</span>
              </label>
              <label className={`choice-card ${paymentMethod === 'card-demo' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card-demo'}
                  onChange={() => setPaymentMethod('card-demo')}
                />
                <strong>Cartão demonstrativo</strong>
                <span>Nenhum dado de cartão será solicitado.</span>
              </label>
            </div>
          </fieldset>
        </div>
        <aside className="order-summary">
          <span className="shop-kicker">Seu pedido</span>
          <label>
            Cupom
            <div className="coupon-row">
              <input
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                placeholder="DEMO10"
              />
              <button
                type="button"
                onClick={() => void actions.setAppliedCouponCode(couponInput.trim() || undefined)}
              >
                Aplicar
              </button>
            </div>
          </label>
          <div>
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotalInCents)}</span>
          </div>
          <div>
            <span>Desconto</span>
            <span>− {formatCurrency(totals.discountInCents)}</span>
          </div>
          <div>
            <span>Frete</span>
            <span>{formatCurrency(totals.shippingInCents)}</span>
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>{formatCurrency(totals.totalInCents)}</strong>
          </div>
          {error && (
            <p className="shop-error" role="alert">
              {error}
            </p>
          )}
          <button className="shop-button" disabled={submitting}>
            {submitting ? 'Criando pedido…' : 'Concluir demonstração'}
          </button>
          <p>Ao continuar, você cria somente um registro local de demonstração.</p>
        </aside>
      </form>
    </main>
  );
}
