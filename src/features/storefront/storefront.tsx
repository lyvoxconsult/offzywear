import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../../app/StoreProvider';
import type { Product } from '../../domain/catalog/entities';
import { formatCurrency } from '../../shared/validation/format';
import './storefront.css';

type CatalogMode = 'all' | 'category' | 'collection' | 'search';

function productPrice(product: Product): number {
  return product.salePriceInCents ?? product.basePriceInCents;
}

function sortedImages(product: Product) {
  return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
}

function isVisible(product: Product): boolean {
  return (
    product.status === 'active' || product.status === 'active-demo' || product.status === 'sold-out'
  );
}

function ProductCard({ product }: { product: Product }) {
  const { state, actions } = useStore();
  const image = sortedImages(product)[0];
  const favorite = state.favoriteProductIds.includes(product.id);
  const soldOut =
    product.status === 'sold-out' ||
    !product.variants.some((variant) => variant.enabled && variant.stock > 0);

  return (
    <article className="sf-product-card">
      <div className="sf-product-card__media">
        <Link to={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}>
          {image ? (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              width={image.width}
              height={image.height}
            />
          ) : (
            <span className="sf-product-card__placeholder" aria-hidden="true">
              OFFZY
            </span>
          )}
        </Link>
        <button
          className={`sf-favorite${favorite ? ' is-active' : ''}`}
          type="button"
          aria-label={
            favorite ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`
          }
          aria-pressed={favorite}
          onClick={() => void actions.toggleFavorite(product.id)}
        >
          {favorite ? '♥' : '♡'}
        </button>
        {soldOut && <span className="sf-product-card__badge">Esgotado</span>}
      </div>
      <div className="sf-product-card__body">
        <Link to={`/produto/${product.slug}`} className="sf-product-card__name">
          {product.name}
        </Link>
        <p>{product.shortDescription}</p>
        <div className="sf-product-card__price">
          {product.salePriceInCents ? <s>{formatCurrency(product.basePriceInCents)}</s> : null}
          <strong>{formatCurrency(productPrice(product))}</strong>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({
  products,
  emptyText = 'Nenhuma peça encontrada.',
}: {
  products: Product[];
  emptyText?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="sf-empty" role="status">
        <span>OFFZY</span>
        <h2>{emptyText}</h2>
        <p>Tente ajustar os filtros ou explore toda a loja.</p>
        <Link className="sf-button sf-button--dark" to="/loja">
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="sf-product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function PageState() {
  const { state, actions } = useStore();
  if (state.loading)
    return (
      <div className="sf-page-state" role="status">
        Carregando coleção...
      </div>
    );
  if (state.error) {
    return (
      <div className="sf-page-state sf-page-state--error" role="alert">
        <strong>Não foi possível carregar a loja.</strong>
        <span>{state.error}</span>
        <button
          className="sf-button sf-button--dark"
          type="button"
          onClick={() => void actions.refresh()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  return null;
}

export function HomePage() {
  const { state } = useStore();
  const featured = state.products
    .filter((product) => isVisible(product) && product.featured)
    .slice(0, 4);
  const firstCollection = state.collections.find((collection) => collection.active);

  if (state.loading || state.error) return <PageState />;

  return (
    <main className="sf-home">
      <section className="sf-hero" aria-labelledby="sf-hero-title">
        <img src="/assets/brand/offzy-brand-board.jpeg" alt="Identidade visual OFFZY Wear" />
        <div className="sf-hero__overlay" />
        <div className="sf-container sf-hero__content">
          <p className="sf-eyebrow">{state.homeContent.heroEyebrow}</p>
          <h1 id="sf-hero-title">{state.homeContent.heroTitle}</h1>
          <p>{state.homeContent.heroBody}</p>
          <Link
            className="sf-button sf-button--light"
            to={firstCollection ? `/colecoes/${firstCollection.slug}` : '/loja'}
          >
            {state.homeContent.primaryCallToAction}
          </Link>
        </div>
      </section>

      <section className="sf-section sf-container" aria-labelledby="sf-featured-title">
        <div className="sf-section-heading">
          <div>
            <p className="sf-eyebrow">Seleção OFFZY</p>
            <h2 id="sf-featured-title">Destaques</h2>
          </div>
          <Link to="/loja">
            Ver tudo <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="sf-manifesto" aria-labelledby="sf-manifesto-title">
        <div className="sf-container sf-manifesto__grid">
          <div className="sf-manifesto__mark" aria-hidden="true">
            OF
            <br />
            FZY
          </div>
          <div>
            <p className="sf-eyebrow">Nosso manifesto</p>
            <h2 id="sf-manifesto-title">Não siga tendências. Crie direção.</h2>
            <p>{state.homeContent.manifesto}</p>
            <Link className="sf-text-link" to="/sobre">
              Conheça a OFFZY <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="sf-section sf-container sf-categories"
        aria-labelledby="sf-categories-title"
      >
        <div className="sf-section-heading">
          <div>
            <p className="sf-eyebrow">Vista sua identidade</p>
            <h2 id="sf-categories-title">Explore por categoria</h2>
          </div>
        </div>
        <div className="sf-categories__grid">
          {state.categories
            .filter((category) => category.active)
            .map((category, index) => (
              <Link
                className={`sf-category-card sf-category-card--${(index % 3) + 1}`}
                to={`/categoria/${category.slug}`}
                key={category.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
        </div>
      </section>

      <section className="sf-newsletter" aria-labelledby="sf-newsletter-title">
        <div className="sf-container">
          <p className="sf-eyebrow">Entre no movimento</p>
          <h2 id="sf-newsletter-title">Novos drops. Sem ruído.</h2>
          <p>Receba novidades, lançamentos e histórias da OFFZY.</p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}

function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  if (submitted)
    return (
      <p className="sf-form-success" role="status">
        Você entrou para o movimento.
      </p>
    );
  return (
    <form className="sf-newsletter__form" onSubmit={submit}>
      <label className="sf-sr-only" htmlFor="sf-newsletter-email">
        Seu melhor e-mail
      </label>
      <input
        id="sf-newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Seu melhor e-mail"
        required
      />
      <button type="submit">
        Quero receber <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

export function CatalogPage({ mode = 'all' }: { mode?: CatalogMode }) {
  const { state } = useStore();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get('ordem') ?? 'featured');
  const query = searchParams.get('q')?.trim() ?? '';
  const category = state.categories.find((item) => item.slug === slug);
  const collection = state.collections.find((item) => item.slug === slug);

  const products = useMemo(() => {
    const needle = query.toLocaleLowerCase('pt-BR');
    const result = state.products.filter((product) => {
      if (!isVisible(product)) return false;
      if (mode === 'category' && category && product.categoryId !== category.id) return false;
      if (mode === 'collection' && collection && !product.collectionIds.includes(collection.id))
        return false;
      if (
        mode === 'search' &&
        needle &&
        !`${product.name} ${product.description} ${product.tags.join(' ')}`
          .toLocaleLowerCase('pt-BR')
          .includes(needle)
      )
        return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return productPrice(a) - productPrice(b);
      if (sort === 'price-desc') return productPrice(b) - productPrice(a);
      if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt);
      return Number(b.featured) - Number(a.featured);
    });
  }, [category, collection, mode, query, sort, state.products]);

  if (state.loading || state.error) return <PageState />;
  const title =
    mode === 'category'
      ? category?.name
      : mode === 'collection'
        ? collection?.name
        : mode === 'search'
          ? query
            ? `Resultados para “${query}”`
            : 'Buscar'
          : 'Loja';
  const description =
    mode === 'category'
      ? category?.description
      : mode === 'collection'
        ? collection?.description
        : 'Peças criadas para quem escolhe a própria direção.';

  return (
    <main className="sf-catalog sf-container">
      <nav className="sf-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <span>/</span>
        <span aria-current="page">{title ?? 'Não encontrado'}</span>
      </nav>
      <header className="sf-catalog__header">
        <p className="sf-eyebrow">OFFZY Wear</p>
        <h1>{title ?? 'Coleção não encontrada'}</h1>
        {description && <p>{description}</p>}
      </header>
      {mode === 'search' && (
        <form
          className="sf-search"
          onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get('q');
            setSearchParams({ q: typeof value === 'string' ? value : '' });
          }}
          role="search"
        >
          <label htmlFor="sf-search-input">Buscar no catálogo</label>
          <div>
            <input
              id="sf-search-input"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Camiseta, moletom, acessório..."
            />
            <button className="sf-button sf-button--dark">Buscar</button>
          </div>
        </form>
      )}
      <div className="sf-catalog__toolbar">
        <span>
          {products.length} {products.length === 1 ? 'produto' : 'produtos'}
        </span>
        <label>
          Ordenar por
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              const next = new URLSearchParams(searchParams);
              next.set('ordem', event.target.value);
              setSearchParams(next);
            }}
          >
            <option value="featured">Destaques</option>
            <option value="newest">Mais recentes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </label>
      </div>
      <ProductGrid
        products={products}
        emptyText={
          mode === 'search'
            ? 'Nenhum resultado para sua busca.'
            : 'Nenhum produto disponível nesta seleção.'
        }
      />
    </main>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const { state, actions } = useStore();
  const product = state.products.find((item) => item.slug === slug && isVisible(item));
  const images = product ? sortedImages(product) : [];
  const colors = product
    ? [...new Map(product.variants.filter((v) => v.enabled).map((v) => [v.colorName, v])).values()]
    : [];
  const [color, setColor] = useState<string>();
  const [variantId, setVariantId] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');
  const activeColor = color ?? colors[0]?.colorName;
  const variants =
    product?.variants.filter((variant) => variant.enabled && variant.colorName === activeColor) ??
    [];
  const chosenVariant = variants.find((variant) => variant.id === variantId);

  if (state.loading || state.error) return <PageState />;
  if (!product) return <NotFoundPage compact />;
  const soldOut =
    product.status === 'sold-out' ||
    !product.variants.some((variant) => variant.enabled && variant.stock > 0);

  async function add() {
    if (!chosenVariant) {
      setFeedback('Selecione um tamanho disponível.');
      return;
    }
    await actions.addToCart(product!, chosenVariant.id, quantity);
    setFeedback('Peça adicionada ao carrinho.');
  }

  return (
    <main className="sf-product sf-container">
      <nav className="sf-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <span>/</span>
        <Link to="/loja">Loja</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="sf-product__layout">
        <section className="sf-product__gallery" aria-label="Imagens do produto">
          {images.length ? (
            images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
              />
            ))
          ) : (
            <div className="sf-product__no-image">OFFZY</div>
          )}
        </section>
        <section className="sf-product__info" aria-labelledby="sf-product-title">
          <p className="sf-eyebrow">OFFZY Wear · {product.sku}</p>
          <h1 id="sf-product-title">{product.name}</h1>
          <p className="sf-product__lead">{product.shortDescription}</p>
          <div className="sf-product__price">
            {product.salePriceInCents && <s>{formatCurrency(product.basePriceInCents)}</s>}
            <strong>{formatCurrency(productPrice(product))}</strong>
            <small>ou em até 3x sem juros</small>
          </div>
          <fieldset className="sf-options">
            <legend>
              Cor: <strong>{activeColor}</strong>
            </legend>
            <div className="sf-swatches">
              {colors.map((item) => (
                <button
                  key={item.colorName}
                  type="button"
                  className={activeColor === item.colorName ? 'is-active' : ''}
                  aria-label={`Cor ${item.colorName}`}
                  aria-pressed={activeColor === item.colorName}
                  onClick={() => {
                    setColor(item.colorName);
                    setVariantId(undefined);
                  }}
                >
                  <span style={{ backgroundColor: item.colorHex }} />
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="sf-options">
            <legend>Tamanho</legend>
            <div className="sf-sizes">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stock < 1}
                  className={variantId === variant.id ? 'is-active' : ''}
                  aria-pressed={variantId === variant.id}
                  onClick={() => setVariantId(variant.id)}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="sf-product__buy">
            <label>
              Quantidade
              <select
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              >
                {[1, 2, 3, 4].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="sf-button sf-button--dark"
              type="button"
              disabled={soldOut}
              onClick={() => void add()}
            >
              {soldOut ? 'Produto esgotado' : 'Adicionar ao carrinho'}
            </button>
            <button
              className={`sf-favorite-text${state.favoriteProductIds.includes(product.id) ? ' is-active' : ''}`}
              type="button"
              onClick={() => void actions.toggleFavorite(product.id)}
            >
              {state.favoriteProductIds.includes(product.id)
                ? '♥ Remover dos favoritos'
                : '♡ Adicionar aos favoritos'}
            </button>
          </div>
          {feedback && (
            <p className="sf-feedback" role="status">
              {feedback}
            </p>
          )}
          <div className="sf-product__details">
            <details open>
              <summary>Descrição</summary>
              <p>{product.description}</p>
            </details>
            <details>
              <summary>Materiais e modelagem</summary>
              <p>
                {product.materials.join(', ')}. {product.fit}.
              </p>
            </details>
            <details>
              <summary>Cuidados</summary>
              <ul>
                {product.careInstructions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>Envio e trocas</summary>
              <p>
                Consulte prazos no carrinho. Trocas seguem os termos publicados nesta demonstração.
              </p>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}

export function AboutPage() {
  return (
    <main className="sf-editorial">
      <section className="sf-editorial__hero sf-container">
        <p className="sf-eyebrow">Sobre a OFFZY</p>
        <h1>
          Vista sua
          <br />
          própria direção.
        </h1>
        <p>
          Nascemos da vontade de transformar identidade em presença. OFFZY é movimento, atitude e
          liberdade para ocupar o mundo do seu jeito.
        </p>
      </section>
      <section className="sf-editorial__image">
        <img
          src="/assets/brand/offzy-brand-board.jpeg"
          alt="Painel com a identidade visual da OFFZY Wear"
        />
      </section>
      <section className="sf-editorial__copy sf-container">
        <span>01</span>
        <div>
          <p className="sf-eyebrow">Manifesto</p>
          <h2>Não somos sobre seguir. Somos sobre construir.</h2>
          <p>
            Cada peça carrega a escolha de não caber em moldes. Criamos streetwear para quem entende
            estilo como linguagem e presença como decisão.
          </p>
        </div>
        <span>02</span>
        <div>
          <p className="sf-eyebrow">Nossa direção</p>
          <h2>Identidade acima do ruído.</h2>
          <p>
            Design essencial, referências urbanas e uma visão própria. É assim que traduzimos nossa
            cultura em roupa.
          </p>
        </div>
      </section>
    </main>
  );
}

const faqItems = [
  [
    'Como acompanho meu pedido?',
    'Na área Minha Conta você encontra o histórico e o status de cada pedido demonstrativo.',
  ],
  [
    'Quais são as formas de pagamento?',
    'Este ambiente simula pagamento por Pix e cartão. Nenhuma cobrança real é realizada.',
  ],
  [
    'Como escolher meu tamanho?',
    'Consulte a modelagem na página do produto. Informações pendentes aparecem sinalizadas para validação comercial.',
  ],
  [
    'Posso trocar ou devolver uma peça?',
    'Sim. As condições definitivas devem seguir a política de trocas e devoluções publicada pela marca.',
  ],
  [
    'Qual é o prazo de envio?',
    'O prazo depende do CEP e da opção selecionada. No demo, todos os valores e prazos são simulados.',
  ],
];

export function FaqPage() {
  return (
    <main className="sf-info-page sf-container">
      <header>
        <p className="sf-eyebrow">Atendimento</p>
        <h1>Perguntas frequentes</h1>
        <p>Respostas rápidas para comprar com segurança.</p>
      </header>
      <section className="sf-faq">
        {faqItems.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <div className="sf-info-cta">
        <p>Não encontrou o que precisava?</p>
        <Link className="sf-button sf-button--dark" to="/contato">
          Fale com a gente
        </Link>
      </div>
    </main>
  );
}

export function SizeGuidePage() {
  return (
    <main className="sf-info-page sf-container">
      <header>
        <p className="sf-eyebrow">Encontre seu ajuste</p>
        <h1>Guia de medidas</h1>
        <p>
          Medidas referenciais para a demonstração. A tabela final depende da modelagem aprovada.
        </p>
      </header>
      <div className="sf-size-table" role="region" aria-label="Tabela de medidas" tabIndex={0}>
        <table>
          <caption>Medidas aproximadas da peça em centímetros</caption>
          <thead>
            <tr>
              <th>Tamanho</th>
              <th>Largura</th>
              <th>Comprimento</th>
              <th>Manga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>P</th>
              <td>52</td>
              <td>70</td>
              <td>22</td>
            </tr>
            <tr>
              <th>M</th>
              <td>55</td>
              <td>72</td>
              <td>23</td>
            </tr>
            <tr>
              <th>G</th>
              <td>58</td>
              <td>74</td>
              <td>24</td>
            </tr>
            <tr>
              <th>GG</th>
              <td>61</td>
              <td>76</td>
              <td>25</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="muted">Conteúdo demonstrativo pendente de confirmação pelo cliente.</p>
    </main>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="sf-info-page sf-container">
      <header>
        <p className="sf-eyebrow">Fale com a OFFZY</p>
        <h1>Contato</h1>
        <p>Envie sua mensagem. Respondemos assim que possível.</p>
      </header>
      {sent ? (
        <div className="sf-empty" role="status">
          <span>OFFZY</span>
          <h2>Mensagem recebida.</h2>
          <p>Obrigado por entrar em contato.</p>
        </div>
      ) : (
        <form
          className="sf-contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <label>
            Nome
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            E-mail
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Assunto
            <select name="subject" required defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              <option>Pedido</option>
              <option>Produto</option>
              <option>Troca ou devolução</option>
              <option>Outro</option>
            </select>
          </label>
          <label>
            Mensagem
            <textarea name="message" rows={6} required />
          </label>
          <button className="sf-button sf-button--dark" type="submit">
            Enviar mensagem
          </button>
        </form>
      )}
    </main>
  );
}

const policyContent: Record<
  string,
  { title: string; intro: string; sections: Array<[string, string]> }
> = {
  privacidade: {
    title: 'Política de privacidade',
    intro: 'Como seus dados são tratados neste ambiente demonstrativo.',
    sections: [
      [
        'Dados coletados',
        'Coletamos somente dados informados voluntariamente nos fluxos de cadastro, contato e pedido demonstrativo.',
      ],
      [
        'Finalidade',
        'Os dados são usados para simular a experiência da loja e não devem ser utilizados para cobranças reais.',
      ],
      [
        'Seus direitos',
        'Você pode solicitar acesso, correção ou exclusão dos dados armazenados localmente a qualquer momento.',
      ],
    ],
  },
  trocas: {
    title: 'Trocas e devoluções',
    intro: 'Condições gerais para uma experiência transparente.',
    sections: [
      [
        'Prazo',
        'A política comercial definitiva deve respeitar o direito de arrependimento e os prazos aplicáveis.',
      ],
      [
        'Condição da peça',
        'A peça deve ser devolvida sem sinais de uso e com etiquetas, conforme regras finais validadas pela marca.',
      ],
      ['Solicitação', 'Entre em contato informando o número do pedido e o motivo da solicitação.'],
    ],
  },
  termos: {
    title: 'Termos de uso',
    intro: 'Regras para navegação e uso da loja demonstrativa.',
    sections: [
      [
        'Ambiente demo',
        'Este site é uma demonstração. Produtos, preços, estoque, frete e pagamento podem ser fictícios ou pendentes de aprovação.',
      ],
      [
        'Propriedade intelectual',
        'Marca, textos e elementos visuais pertencem aos seus respectivos titulares.',
      ],
      ['Responsabilidade', 'Nenhuma compra ou cobrança real é processada neste ambiente.'],
    ],
  },
};

export function PolicyPage() {
  const { slug = 'termos' } = useParams();
  const content = policyContent[slug] ?? policyContent.termos!;
  return (
    <main className="sf-policy sf-container">
      <nav className="sf-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <span>/</span>
        <span aria-current="page">{content.title}</span>
      </nav>
      <header>
        <p className="sf-eyebrow">Transparência</p>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <small>Última atualização: 30 de junho de 2026</small>
      </header>
      <div className="sf-policy__body">
        {content.sections.map(([title, body], index) => (
          <section key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export function NotFoundPage({ compact = false }: { compact?: boolean }) {
  const location = useLocation();
  return (
    <main className={`sf-not-found${compact ? ' sf-not-found--compact' : ''}`}>
      <div>
        <span aria-hidden="true">404</span>
        <p className="sf-eyebrow">Fora da rota</p>
        <h1>Página não encontrada.</h1>
        <p>
          O endereço <code>{location.pathname}</code> não existe ou mudou de direção.
        </p>
        <Link className="sf-button sf-button--dark" to="/">
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
