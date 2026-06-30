# Arquitetura

## Limites

```text
UI/features -> application ports -> demo repositories -> versioned storage
                     |                    |
                  domain rules        Zod schemas
```

- Componentes não acessam `localStorage` diretamente.
- Dinheiro é armazenado em centavos inteiros.
- Carrinho identifica item por produto e variante.
- Produto e variante são revalidados antes do cálculo e do pedido.
- Pedido preserva snapshots imutáveis de cliente, endereço, frete, item e preço.
- Storage valida relações, unicidade e migrações antes de hidratar a aplicação.

## Persistência demo

O adapter local usa schema v2 e migração explícita. Conteúdo inválido não é tratado como confiável. O reset restaura o seed; exportação serve apenas para inspeção/backup local.

## Adapters futuros

Os ports permitem implementar Supabase/PostgreSQL, autenticação, gateway, frete e analytics sem mover regras comerciais para componentes.
