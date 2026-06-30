import { type FormEvent, useState } from 'react';
import { useStore } from '../../app/StoreProvider';
import { AccountShell } from './AccountShell';

export function ProfilePage() {
  const { state, actions } = useStore();
  const [form, setForm] = useState(state.profile);
  const [saved, setSaved] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    await actions.saveProfile(form);
    setSaved(true);
  }
  return (
    <AccountShell title="Perfil">
      <form className="account-form" onSubmit={(event) => void submit(event)}>
        <h2>Dados pessoais</h2>
        <p>Informações usadas nos pedidos demonstrativos.</p>
        <label>
          Nome completo
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          E-mail
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Telefone
          <input
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </label>
        {saved && (
          <p className="account-success" role="status">
            Perfil salvo.
          </p>
        )}
        <button>Salvar alterações</button>
      </form>
    </AccountShell>
  );
}
