import { useState } from 'react';
import { Heart, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import { effectiveProductPrice } from '../../domain/pricing/pricing';
import { formatCurrency } from '../../shared/validation/format';
import { cartDetails, cartSubtotal } from './commerceUtils';
import './commerce.css';

export function CartPage() {
  const { state, actions } = useStore();
  const [message, setMessage] = useState('');
  const rows = cartDetails(state.cart, state.products);
  const subtotal = cartSubtotal(state.cart, state.products);

  if (!rows.length) {
    return (
      <main className="shop-page shop-empty">
        <span className="shop-kicker">Seu carrinho</span>
        <h1>Seu próximo look começa aqui.</h1>
        <p>O carrinho está vazio. Explore as peças e escolha sua direção.</p>
        <Link className="shop-button" to="/produtos">
          Ver coleção
        </Link>
      </main>
    );
  }

  return (
    <main className="shop-page">
      <header className="shop-heading">
        <div>
          <span className="shop-kicker">Sacola</span>
          <h1>
            {rows.length} {rows.length === 1 ? 'peça' : 'peças'}
          </h1>
        </div>
        <button className="shop-text-button" onClick={() => void actions.clearCart()}>
          Limpar carrinho
        </button>
      </header>
      {message && (
        <p className="shop-notice" role="status">
          {message}
        </p>
      )}
      <div className="cart-layout">
        <section className="cart-list" aria-label="Itens do carrinho">
          {rows.map(({ item, product, variant }) => (
            <article className="cart-row" key={`${item.productId}:${item.variantId}`}>
              <img src={product.images[0]?.src} alt={product.images[0]?.alt ?? product.name} />
              <div className="cart-copy">
                <Link to={`/produto/${product.slug}`}>
                  <h2>{product.name}</h2>
                </Link>
                <p>
                  {variant.colorName} · {variant.size}
                </p>
                <strong>{formatCurrency(effectiveProductPrice(product))}</strong>
                <div className="cart-actions">
                  <div className="quantity" aria-label={`Quantidade de ${product.name}`}>
                    <button
                      aria-label="Diminuir quantidade"
                      onClick={() =>
                        void actions.updateCart(product, variant.id, item.quantity - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <output>{item.quantity}</output>
                    <button
                      aria-label="Aumentar quantidade"
                      disabled={item.quantity >= variant.stock}
                      onClick={() =>
                        void actions.updateCart(product, variant.id, item.quantity + 1)
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    className="icon-action"
                    aria-label={`Favoritar ${product.name}`}
                    onClick={() => {
                      void actions.toggleFavorite(product.id);
                      setMessage('Favoritos atualizados.');
                    }}
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    className="icon-action"
                    aria-label={`Remover ${product.name}`}
                    onClick={() => void actions.removeCart(product.id, variant.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
        <aside className="order-summary">
          <span className="shop-kicker">Resumo</span>
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div>
            <span>Frete</span>
            <span>Calculado no checkout</span>
          </div>
          <p>Ambiente demonstrativo. Nenhuma cobrança real será realizada.</p>
          <Link className="shop-button" to="/checkout">
            Continuar para checkout
          </Link>
          <Link className="shop-link" to="/produtos">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </main>
  );
}
