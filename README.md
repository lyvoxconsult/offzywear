# OFFZY Wear — loja online demonstrativa

Loja de streetwear completa para apresentação comercial da OFFZY Wear. Inclui vitrine, catálogo, busca, produto com variantes, favoritos, carrinho, checkout seguro em modo demo, conta, pedidos e painel administrativo local.

O catálogo inclui 15 produtos OFFZY com imagens WebP otimizadas, preços demonstrativos em BRL, tamanhos, estoque, composição e cuidados. A home aplica o brand kit como sistema visual — preto, branco, dourado, tipografia editorial e elementos de campanha — sem usar o painel de marca como banner.

> Ambiente demonstrativo: nenhuma compra, cobrança, entrega, mensagem ou autenticação real é processada.

## Executar

Requisitos: Node.js 22 e npm 10+.

```bash
npm ci
npm run dev
```

## Qualidade

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run test:e2e
```

## Arquitetura

- `src/domain`: regras puras de catálogo, carrinho, preço, cupom e pedidos.
- `src/application/ports`: contratos de persistência e operação.
- `src/infrastructure/demo`: storage local versionado, schemas e repositories.
- `src/features`: vitrine, comércio, conta e administração.
- `src/app`: composição de providers, rotas e layout.

Dados da demonstração usam o namespace `offzy.demo.store.v1`, com schema interno v2 e revisão de catálogo, no `localStorage`. Dados de checkout sensíveis e cartão não são coletados. O admin é demonstrativo e não representa autenticação/RBAC real.

## Deploy

O projeto está preparado para Vercel como SPA. `vercel.json` contém fallback de rotas e headers de segurança. O push na `main` aciona o deploy automático já configurado na Vercel. A loja usa `noindex,nofollow`; não altere o DNS do site atual até aprovação formal do cliente.

Veja também:

- [Arquitetura](docs/ARQUITETURA.md)
- [Identidade](docs/IDENTIDADE-OFFZY.md)
- [Conteúdo pendente](docs/CONTEUDO-PENDENTE-CLIENTE.md)
- [Plano de produção](docs/PLANO-PRODUCAO.md)
