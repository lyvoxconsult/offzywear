import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import './account.css';

export function AccountShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <main className="account-page">
      <header>
        <span>{eyebrow ?? 'Minha conta'}</span>
        <h1>{title}</h1>
      </header>
      <div className="account-layout">
        <nav aria-label="Navegação da conta">
          <NavLink to="/conta/perfil">Perfil</NavLink>
          <NavLink to="/conta/enderecos">Endereços</NavLink>
          <NavLink to="/conta/pedidos">Pedidos</NavLink>
          <NavLink to="/favoritos">Favoritos</NavLink>
        </nav>
        <section className="account-content">{children}</section>
      </div>
    </main>
  );
}
