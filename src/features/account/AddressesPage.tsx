import { type FormEvent, useState } from 'react';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../app/StoreProvider';
import type { Address } from '../../domain/catalog/entities';
import { AccountShell } from './AccountShell';

const blankAddress = (): Address => ({
  id: `address-${Date.now()}`,
  label: 'Casa',
  recipientName: '',
  postalCode: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  isDefault: false,
  demoData: true,
});

export function AddressesPage() {
  const { state, actions } = useStore();
  const [editing, setEditing] = useState<Address | null>(null);
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    await actions.saveAddress(editing);
    setEditing(null);
    setMessage('Endereço salvo.');
  }
  return (
    <AccountShell title="Endereços">
      <div className="account-toolbar">
        <div>
          <h2>Endereços salvos</h2>
          <p>Dados locais para simular a entrega.</p>
        </div>
        <button onClick={() => setEditing(blankAddress())}>Novo endereço</button>
      </div>
      {message && (
        <p className="account-success" role="status">
          {message}
        </p>
      )}
      <div className="address-grid">
        {state.addresses.map((address) => (
          <article key={address.id}>
            <MapPin />
            <div>
              <h3>
                {address.label} {address.isDefault && <small>Padrão</small>}
              </h3>
              <p>
                {address.recipientName}
                <br />
                {address.street}, {address.number}
                <br />
                {address.neighborhood} · {address.city}/{address.state}
                <br />
                {address.postalCode}
              </p>
            </div>
            <div>
              <button aria-label={`Editar ${address.label}`} onClick={() => setEditing(address)}>
                <Pencil size={17} />
              </button>
              <button
                aria-label={`Excluir ${address.label}`}
                onClick={() => void actions.deleteAddress(address.id)}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <div
          className="account-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="address-title"
        >
          <form className="account-form" onSubmit={(event) => void submit(event)}>
            <h2 id="address-title">
              {state.addresses.some((item) => item.id === editing.id) ? 'Editar' : 'Novo'} endereço
            </h2>
            <div className="form-grid">
              <label>
                Identificação
                <input
                  required
                  value={editing.label}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                />
              </label>
              <label>
                Destinatário
                <input
                  required
                  value={editing.recipientName}
                  onChange={(e) => setEditing({ ...editing, recipientName: e.target.value })}
                />
              </label>
              <label>
                CEP
                <input
                  required
                  value={editing.postalCode}
                  onChange={(e) => setEditing({ ...editing, postalCode: e.target.value })}
                />
              </label>
              <label>
                Rua
                <input
                  required
                  value={editing.street}
                  onChange={(e) => setEditing({ ...editing, street: e.target.value })}
                />
              </label>
              <label>
                Número
                <input
                  required
                  value={editing.number}
                  onChange={(e) => setEditing({ ...editing, number: e.target.value })}
                />
              </label>
              <label>
                Complemento
                <input
                  value={editing.complement ?? ''}
                  onChange={(e) => setEditing({ ...editing, complement: e.target.value })}
                />
              </label>
              <label>
                Bairro
                <input
                  required
                  value={editing.neighborhood}
                  onChange={(e) => setEditing({ ...editing, neighborhood: e.target.value })}
                />
              </label>
              <label>
                Cidade
                <input
                  required
                  value={editing.city}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                />
              </label>
              <label>
                UF
                <input
                  required
                  maxLength={2}
                  value={editing.state}
                  onChange={(e) => setEditing({ ...editing, state: e.target.value.toUpperCase() })}
                />
              </label>
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={editing.isDefault}
                onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })}
              />{' '}
              Usar como padrão
            </label>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </AccountShell>
  );
}
