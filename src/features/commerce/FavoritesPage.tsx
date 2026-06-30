import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import { effectiveProductPrice } from '../../domain/pricing/pricing';
import { formatCurrency } from '../../shared/validation/format';
import './commerce.css';

export function FavoritesPage() {
  const { state, actions } = useStore();
  const products = state.products.filter((product) =>
    state.favoriteProductIds.includes(product.id),
  );
  return (
    <main className="shop-page">
      <header className="shop-heading">
        <div>
          <span className="shop-kicker">Seleção pessoal</span>
          <h1>Favoritos</h1>
        </div>
      </header>
      {!products.length ? (
        <section className="shop-empty">
          <Heart size={32} />
          <h2>Nenhuma peça salva.</h2>
          <p>Use o coração nos produtos para montar sua seleção.</p>
          <Link className="shop-button" to="/produtos">
            Descobrir peças
          </Link>
        </section>
      ) : (
        <section className="favorite-grid">
          {products.map((product) => (
            <article className="favorite-card" key={product.id}>
              <Link to={`/produto/${product.slug}`}>
                <img src={product.images[0]?.src} alt={product.images[0]?.alt ?? product.name} />
                <h2>{product.name}</h2>
              </Link>
              <p>{formatCurrency(effectiveProductPrice(product))}</p>
              <div>
                <Link className="shop-button" to={`/produto/${product.slug}`}>
                  <ShoppingBag size={16} /> Escolher tamanho
                </Link>
                <button
                  className="icon-action"
                  aria-label={`Remover ${product.name} dos favoritos`}
                  onClick={() => void actions.toggleFavorite(product.id)}
                >
                  <Heart fill="currentColor" size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
