import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './StoreProvider';

function Drawer({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="drawer" aria-label={label} onClose={onClose}>
      <div className="drawer__topline">
        <strong>{label}</strong>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
          <X aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

function Header() {
  const { state } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    void navigate(value ? `/busca?q=${encodeURIComponent(value)}` : '/busca');
  }

  const nav = (
    <>
      <NavLink to="/loja">Loja</NavLink>
      <NavLink to="/categoria/camisetas">Camisetas</NavLink>
      <NavLink to="/categoria/jaquetas">Jaquetas</NavLink>
      <NavLink to="/categoria/acessorios">Acessórios</NavLink>
      <NavLink to="/colecoes/drop-mmxxvi">Coleção</NavLink>
      <NavLink to="/manifesto">Manifesto</NavLink>
    </>
  );

  return (
    <>
      <div className="announcement" role="status">
        {state.settings.announcement}
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <button
            className="icon-button mobile-only"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu aria-hidden="true" />
          </button>
          <Link className="brand-link" to="/" aria-label="OFFZY Wear — início">
            <img
              src="/assets/brand/offzy-wordmark.jpeg"
              alt="OFFZY Wear"
              width="1254"
              height="1254"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {nav}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              aria-expanded={searchOpen}
              aria-label="Buscar"
            >
              <Search aria-hidden="true" />
            </button>
            <Link className="icon-button desktop-only" to="/conta" aria-label="Minha conta">
              <UserRound aria-hidden="true" />
            </Link>
            <Link className="icon-button desktop-only" to="/favoritos" aria-label="Favoritos">
              <Heart aria-hidden="true" />
              {state.favoriteProductIds.length > 0 && (
                <span className="counter">{state.favoriteProductIds.length}</span>
              )}
            </Link>
            <button
              className="icon-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Carrinho com ${itemCount} itens`}
            >
              <ShoppingBag aria-hidden="true" />
              {itemCount > 0 && <span className="counter">{itemCount}</span>}
            </button>
          </div>
        </div>
        {searchOpen && (
          <form className="header-search" role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="header-search">
              Buscar produtos
            </label>
            <Search aria-hidden="true" />
            <input
              id="header-search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por peça, coleção ou categoria"
            />
            <button className="button button--small" type="submit">
              Buscar
            </button>
          </form>
        )}
      </header>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu">
        <nav className="drawer-nav" aria-label="Navegação móvel">
          {nav}
          <NavLink to="/favoritos">Favoritos</NavLink>
          <NavLink to="/conta">Minha conta</NavLink>
        </nav>
      </Drawer>
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} label="Seu carrinho">
        {state.cart.length === 0 ? (
          <div className="empty-state compact">
            <ShoppingBag aria-hidden="true" />
            <p>Seu carrinho ainda está vazio.</p>
            <Link className="button" to="/loja">
              Explorar peças
            </Link>
          </div>
        ) : (
          <div className="mini-cart">
            {state.cart.map((item) => {
              const product = state.products.find((candidate) => candidate.id === item.productId);
              const variant = product?.variants.find(
                (candidate) => candidate.id === item.variantId,
              );
              return (
                <div className="mini-cart__item" key={`${item.productId}:${item.variantId}`}>
                  <span>{product?.name ?? 'Produto'}</span>
                  <small>
                    {variant?.colorName} · {variant?.size} · {item.quantity} un.
                  </small>
                </div>
              );
            })}
            <Link className="button" to="/carrinho">
              Ver carrinho
            </Link>
            <Link className="button button--outline" to="/checkout">
              Ir ao checkout
            </Link>
          </div>
        )}
      </Drawer>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <span>OFFZY Wear</span>
        <p>Built Different. Made to Stand Out.</p>
      </div>
      <nav aria-label="Institucional">
        <Link to="/sobre">Sobre</Link>
        <Link to="/manifesto">Manifesto</Link>
        <Link to="/guia-de-medidas">Guia de medidas</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contato">Contato</Link>
      </nav>
      <nav aria-label="Políticas">
        <Link to="/politica-de-trocas">Trocas</Link>
        <Link to="/politica-de-privacidade">Privacidade</Link>
        <Link to="/termos-de-uso">Termos de uso</Link>
        <Link to="/admin">Admin demo</Link>
      </nav>
      <div className="site-footer__legal">
        <span>Loja demonstrativa para apresentação de modelo e-commerce.</span>
        <span>© {new Date().getFullYear()} OFFZY Wear</span>
      </div>
    </footer>
  );
}

export function StoreLayout() {
  const { state, actions } = useStore();
  const location = useLocation();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <Header key={`${location.pathname}${location.search}`} />
      {state.error && (
        <div className="global-error" role="alert">
          <span>{state.error}</span>
          <button className="text-button" type="button" onClick={() => void actions.refresh()}>
            Tentar novamente
          </button>
        </div>
      )}
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="page-shell" aria-busy="true" aria-live="polite">
      <div className="skeleton skeleton--title" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton skeleton--card" key={index} />
        ))}
      </div>
      <span className="sr-only">Carregando conteúdo</span>
    </div>
  );
}
