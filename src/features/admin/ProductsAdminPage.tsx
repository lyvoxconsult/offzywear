import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useStore } from '../../app/StoreProvider';
import type { ClothingSize, Product, ProductVariant } from '../../domain/catalog/entities';
import { formatCurrency } from '../../shared/validation/format';
import { AdminShell } from './AdminShell';

function emptyProduct(categoryId = ''): Product {
  const now = new Date().toISOString();
  const id = `product-${Date.now()}`;
  return {
    id,
    slug: '',
    sku: '',
    name: '',
    shortDescription: '',
    description: '',
    categoryId,
    collectionIds: [],
    tags: [],
    materials: [],
    fit: '',
    careInstructions: [],
    basePriceInCents: 0,
    commercialValidationStatus: 'pending',
    status: 'draft',
    images: [],
    variants: [],
    featured: false,
    createdAt: now,
    updatedAt: now,
  };
}
function emptyVariant(productId: string): ProductVariant {
  return {
    id: `variant-${Date.now()}`,
    productId,
    colorName: 'Preto',
    colorHex: '#111111',
    size: 'M',
    sku: '',
    stock: 0,
    enabled: true,
  };
}

export function ProductsAdminPage() {
  const { state, actions } = useStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const products = useMemo(
    () =>
      state.products.filter((p) =>
        `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [state.products, query],
  );
  async function save() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.slug.trim() || !editing.sku.trim()) {
      setMessage('Nome, slug e SKU são obrigatórios.');
      return;
    }
    await actions.saveProduct({ ...editing, updatedAt: new Date().toISOString() });
    setEditing(null);
    setMessage('Produto salvo.');
  }
  return (
    <AdminShell
      title="Produtos"
      action={
        <button
          className="admin-primary"
          onClick={() => setEditing(emptyProduct(state.categories[0]?.id))}
        >
          <Plus size={17} /> Novo produto
        </button>
      }
    >
      <div className="admin-search">
        <Search size={17} />
        <input
          aria-label="Buscar produtos"
          placeholder="Buscar por nome ou SKU"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {message && (
        <p className="admin-notice" role="status">
          {message}
        </p>
      )}
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Status</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.sku}</small>
                </td>
                <td>
                  <span className="admin-badge">{product.status}</span>
                </td>
                <td>{formatCurrency(product.salePriceInCents ?? product.basePriceInCents)}</td>
                <td>{product.variants.reduce((sum, v) => sum + v.stock, 0)}</td>
                <td>
                  <div className="table-actions">
                    <button
                      aria-label={`Editar ${product.name}`}
                      onClick={() => setEditing(structuredClone(product))}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      aria-label={`Excluir ${product.name}`}
                      onClick={() => void actions.deleteProduct(product.id)}
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
        <div
          className="admin-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
        >
          <div className="admin-editor">
            <header>
              <h2 id="product-title">
                {state.products.some((p) => p.id === editing.id)
                  ? 'Editar produto'
                  : 'Novo produto'}
              </h2>
              <button aria-label="Fechar" onClick={() => setEditing(null)}>
                ×
              </button>
            </header>
            <div className="admin-form">
              <label>
                Nome
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </label>
              <label>
                Slug
                <input
                  required
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    })
                  }
                />
              </label>
              <label>
                SKU
                <input
                  required
                  value={editing.sku}
                  onChange={(e) => setEditing({ ...editing, sku: e.target.value.toUpperCase() })}
                />
              </label>
              <label>
                Categoria
                <select
                  value={editing.categoryId}
                  onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}
                >
                  {state.categories.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Preço (R$)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editing.basePriceInCents / 100}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      basePriceInCents: Math.round(Number(e.target.value) * 100),
                    })
                  }
                />
              </label>
              <label>
                Preço promocional (R$)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(editing.salePriceInCents ?? 0) / 100}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      salePriceInCents: Math.round(Number(e.target.value) * 100) || undefined,
                    })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value as Product['status'] })
                  }
                >
                  <option value="draft">Rascunho</option>
                  <option value="active-demo">Ativo demo</option>
                  <option value="active">Ativo</option>
                  <option value="sold-out">Esgotado</option>
                </select>
              </label>
              <label>
                Validação
                <select
                  value={editing.commercialValidationStatus}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      commercialValidationStatus: e.target
                        .value as Product['commercialValidationStatus'],
                    })
                  }
                >
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovado</option>
                </select>
              </label>
              <label className="full">
                Resumo
                <input
                  value={editing.shortDescription}
                  onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                />
              </label>
              <label className="full">
                Descrição
                <textarea
                  rows={4}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </label>
              <label className="full check">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />{' '}
                Produto em destaque
              </label>
            </div>
            <section className="variant-editor">
              <div>
                <h3>Variantes</h3>
                <button
                  onClick={() =>
                    setEditing({
                      ...editing,
                      variants: [...editing.variants, emptyVariant(editing.id)],
                    })
                  }
                >
                  <Plus size={15} /> Adicionar
                </button>
              </div>
              {editing.variants.map((variant, index) => (
                <div className="variant-row" key={variant.id}>
                  <input
                    aria-label="Cor"
                    value={variant.colorName}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        variants: editing.variants.map((v, i) =>
                          i === index ? { ...v, colorName: e.target.value } : v,
                        ),
                      })
                    }
                  />
                  <input
                    aria-label="Cor hexadecimal"
                    type="color"
                    value={variant.colorHex}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        variants: editing.variants.map((v, i) =>
                          i === index ? { ...v, colorHex: e.target.value } : v,
                        ),
                      })
                    }
                  />
                  <select
                    aria-label="Tamanho"
                    value={variant.size}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        variants: editing.variants.map((v, i) =>
                          i === index ? { ...v, size: e.target.value as ClothingSize } : v,
                        ),
                      })
                    }
                  >
                    {['PP', 'P', 'M', 'G', 'GG', 'XGG', 'U'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    aria-label="SKU da variante"
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        variants: editing.variants.map((v, i) =>
                          i === index ? { ...v, sku: e.target.value } : v,
                        ),
                      })
                    }
                  />
                  <input
                    aria-label="Estoque"
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        variants: editing.variants.map((v, i) =>
                          i === index ? { ...v, stock: Number(e.target.value) } : v,
                        ),
                      })
                    }
                  />
                  <button
                    aria-label="Remover variante"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        variants: editing.variants.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </section>
            <footer>
              <button className="admin-secondary" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button className="admin-primary" onClick={() => void save()}>
                Salvar produto
              </button>
            </footer>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
