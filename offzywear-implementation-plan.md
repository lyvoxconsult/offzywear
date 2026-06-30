# Plano de implementação — OFFZY Wear

## Abordagem

Construir uma SPA React 19 + Vite + TypeScript estratificada por domínio, com experiência completa de e-commerce em modo demonstrativo seguro. Persistência local será versionada e validada atrás de ports/adapters; integração real com Supabase, pagamento, frete e autenticação ficará preparada e documentada, mas desativada por ausência de credenciais e dados comerciais aprovados.

## Escopo

### Incluído

- Identidade OFFZY baseada no briefing, assets e site atual.
- Vitrine, catálogo, busca, filtros, PDP com variantes, favoritos e carrinho.
- Checkout demonstrativo, pedidos, conta e timeline de status.
- Admin demonstrativo com produtos, variantes, estoque, pedidos, cupons e conteúdo.
- Persistência local segura para dados não sensíveis.
- SEO/noindex de demo, acessibilidade, performance e headers de segurança.
- Unitários, integração, E2E, CI, documentação, GitHub e preview Vercel.

### Excluído nesta entrega

- Pagamento, frete, e-mail ou WhatsApp reais.
- Autenticação/RBAC real, emissão fiscal, ERP e banco de produção.
- Alteração de DNS ou substituição do site `offzywaer.com.br`.
- Dados comerciais não confirmados pelo cliente.

## Arquitetura

- `src/app`: composição, router e providers.
- `src/domain`: entidades e regras puras de catálogo, preço, cupom, carrinho e pedido.
- `src/features`: storefront, catálogo, produto, carrinho, checkout, conta e admin.
- `src/shared`: design system, layout, utilitários, validação e acessibilidade.
- `src/infrastructure`: seed, storage versionado, repositories e adapters futuros.
- `tests`: unitários, integração, acessibilidade e Playwright.

## Invariantes

- Item do carrinho é identificado por produto + cor + tamanho.
- Totais sempre são recalculados pelo domínio; storage é entrada não confiável.
- Pedido guarda snapshot imutável de produto, variante e preço.
- Checkout não coleta nem persiste dados reais de cartão/CVV.
- Admin demo não é apresentado como autenticação ou autorização real.
- Nenhum segredo entra em arquivo versionado, bundle, log ou comando gravado.

## Etapas

- [ ] Inicializar Git e scaffold React/Vite/TypeScript no repositório vazio.
- [ ] Criar design tokens, shell, rotas, layouts, componentes e assets otimizados.
- [ ] Implementar domínio, seed, storage versionado e repositories.
- [ ] Implementar home, catálogo, busca, coleções, categorias e 404.
- [ ] Implementar PDP, variantes, guia de medidas, relacionados e complete o look.
- [ ] Implementar favoritos, minicart, carrinho, cupons, frete e totais.
- [ ] Implementar checkout demo, confirmação, conta, endereços e pedidos.
- [ ] Implementar admin demo com CRUD e conteúdo persistente.
- [ ] Adicionar SEO, noindex, acessibilidade, CSP/headers e proteção de dados.
- [ ] Adicionar lint, format, typecheck, unitários, cobertura, E2E e CI.
- [ ] Validar todos os viewports, console, network, keyboard e fluxos críticos.
- [ ] Documentar arquitetura, identidade, pendências e plano de produção.
- [ ] Commitar e publicar em `lyvoxconsult/offzywear`.
- [ ] Fazer preview Vercel sem alterar o DNS atual e executar smoke remoto.

## Gate de validação

- `format:check`, `lint`, `typecheck`, testes unitários e build verdes.
- E2E crítico verde em Chromium.
- Axe sem violações serious/critical nas rotas principais.
- Sem overflow nos viewports 360, 390, 768, 1024 e 1440.
- Console e network sem erros críticos.
- `npm audit` sem vulnerabilidades high/critical não triadas.
- Secret scan limpo.
- Preview Vercel acessível, headers/noindex verificados e DNS intocado.

## Checklist Fase 1 — fundação

- [x] Git `main` inicializado com remote HTTPS sem credencial embutida.
- [x] React 19, Vite e TypeScript estrito configurados.
- [x] ESLint, Prettier, Vitest e cobertura V8 configurados.
- [x] Camadas `app`, `domain`, `application`, `infrastructure`, `shared` e `data` criadas.
- [x] Tipos, seed OFFZY, variantes, carrinho, pricing, cupons e snapshot de pedido implementados.
- [x] Storage demo validado, versionado e com migração explícita.
- [x] Ports, repositories e adapters demo implementados.
- [x] Perfil, endereços, frete simulado, histórico de status e snapshots de pedido completos.
- [x] Ports de conteúdo, configurações, catálogo, cupons, pedidos e cliente isolam a UI do storage.
- [x] Imagens classificadas como produto, editorial ou placeholder; assets de marca bloqueados como foto aprovada.
- [x] Relações e unicidade de catálogo, carrinho e pedidos validadas.
- [x] Assets derivados normalizados em `public/assets/brand`; fontes brutas mantidas fora do Git.
- [x] Format, lint, typecheck, cobertura, build, audit e secret scan executados.
- [ ] Rotas e páginas comerciais: próxima fase.
