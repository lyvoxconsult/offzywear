# Plano para produção

## Backend e dados

- PostgreSQL/Supabase com tabelas de produtos, variantes, estoque, clientes, endereços, carrinhos, pedidos, cupons e conteúdo.
- RLS por proprietário; operações administrativas validadas no servidor.
- Reserva transacional de estoque e chave de idempotência no checkout.
- Storage público separado de documentos privados.

## Integrações

- Gateway homologado com token somente no servidor e webhooks assinados/idempotentes.
- Cotação de frete real por CEP e rastreamento.
- E-mail transacional e WhatsApp somente com opt-in.
- ERP/fiscal após mapeamento operacional.

## Segurança e operação

- Auth real, RBAC, rate limit, logs sem PII, backups e observabilidade.
- LGPD: base legal, consentimento, retenção e atendimento aos titulares.
- SAST/dependency/secret scan, preview por PR e aprovação antes de produção.
- Migrar de SPA para SSR/prerender de catálogo se SEO orgânico for requisito comercial.

## Liberação

Somente remover `noindex` e apontar DNS após catálogo, políticas, integrações, testes de pagamento/frete, revisão jurídica e aceite formal do cliente.
