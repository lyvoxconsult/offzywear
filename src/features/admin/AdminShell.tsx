import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import './admin.css';

export function AdminShell({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main className="admin-page">
      <aside>
        <strong>OFFZY / Admin</strong>
        <nav aria-label="Administração">
          <NavLink to="/admin">Visão geral</NavLink>
          <NavLink to="/admin/produtos">Produtos</NavLink>
          <NavLink to="/admin/pedidos">Pedidos</NavLink>
          <NavLink to="/admin/cupons">Cupons</NavLink>
          <NavLink to="/admin/conteudo">Conteúdo</NavLink>
          <NavLink to="/admin/configuracoes">Configurações</NavLink>
        </nav>
        <NavLink className="back-store" to="/">
          ← Ver loja
        </NavLink>
      </aside>
      <div className="admin-main">
        <header>
          <div>
            <span>Ambiente demonstrativo</span>
            <h1>{title}</h1>
          </div>
          {action}
        </header>
        {children}
      </div>
    </main>
  );
}
