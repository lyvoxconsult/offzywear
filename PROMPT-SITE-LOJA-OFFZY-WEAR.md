# PROMPT FINAL - Loja Online OFFZY Wear

Atue como um time sênior de produto digital composto por arquiteto de software, desenvolvedor frontend React/TypeScript, especialista em e-commerce de moda, UX/UI designer, especialista em acessibilidade, segurança e QA. Sua missão é analisar, projetar, implementar e validar uma loja online demonstrativa completa, profissional e comercialmente convincente para a marca brasileira de streetwear premium **OFFZY Wear**.

Não entregue apenas layout, wireframe ou plano. Implemente o projeto funcional, execute validações reais, corrija os problemas encontrados e só finalize quando os critérios de aceite deste prompt estiverem atendidos. Não simule comandos, testes, resultados, integrações ou evidências.

## 1. Contexto e fontes obrigatórias

O projeto deve ser criado no workspace:

```text
C:\Users\pedro\OneDrive\Documentos\00-Projetos\14- Loja online
```

Antes de editar qualquer arquivo, inspecione integralmente as fontes abaixo:

1. Identidade, cultura e narrativa:
   - `Cultura.docx`
   - `WhatsApp Image 2026-06-30 at 13.59.08.jpeg`
   - `WhatsApp Image 2026-06-30 at 13.59.09.jpeg`
   - `WhatsApp Image 2026-06-30 at 13.59.09 (1).jpeg`
   - `WhatsApp Image 2026-06-30 at 13.59.09 (2).jpeg`
2. Site atual do cliente, que deve continuar reconhecível na nova experiência:
   - `https://offzywaer.com.br/`
   - inspecionar especialmente `#sobre`, `#galeria` e `#contato`.
3. Repositório funcional de referência criado pela Lyvox:
   - `https://github.com/lyvoxconsult/Loja-Online-Perfume`
   - usar como referência de fluxos e cobertura funcional, não como template visual a ser apenas renomeado.
4. Segundo cérebro do Codex, se disponível:
   - `D:\Obsidian\obsidian\Projetos`
   - procurar por notas da OFFZY, loja online, e-commerce e decisões relacionadas antes de implementar.

Hierarquia das fontes:

1. Código e arquivos reais do workspace.
2. Materiais de identidade fornecidos pelo cliente.
3. Site atual da OFFZY.
4. Repositório Loja-Online-Perfume como referência técnica/funcional.
5. Referências externas apenas para complementar padrões de UX, nunca para substituir a identidade OFFZY.

Se houver divergência, preserve a identidade e o conteúdo aprovados da OFFZY. Registre a divergência e a decisão tomada. Não invente regras comerciais para resolver lacunas silenciosamente.

## 2. Identidade da marca

A nova loja deve traduzir os seguintes fundamentos:

- Marca: **OFFZY Wear**.
- Segmento: streetwear premium, minimalista, urbano e atemporal.
- Posicionamento: identidade, atitude, ambição, autenticidade, independência e presença.
- Propósito: inspirar pessoas a se expressarem por meio do que vestem.
- Visão: construir uma comunidade autêntica, criativa e determinada e tornar a OFFZY referência nacional em streetwear.
- Valores: autenticidade, evolução, liberdade, qualidade e comunidade.
- Conceito do símbolo: movimento constante, evolução pessoal, caminho próprio e construção de identidade.
- Slogans aprovados no material:
  - “Vista sua própria direção.”
  - “Não siga tendências. Crie presença.”
- Frase institucional:
  - “OFFZY não é apenas o que você veste. É a forma como você escolhe ocupar o mundo.”
- Assinaturas visuais encontradas nos materiais:
  - “Built for the streets.”
  - “Built different. Made to stand out.”
- Instagram indicado no material: `@offzy.wear`.

O site atual usa fundo grafite próximo de `#272725`, branco e acento bege/dourado próximo de `#A89F84`, com tipografia limpa e editorial. Preserve esse reconhecimento visual, refinando contraste, hierarquia, ritmo, responsividade e acabamento. A paleta deve ser consolidada em design tokens; não espalhe cores literais pela aplicação.

Não transforme a OFFZY em uma loja genérica de moda, marketplace colorido ou cópia visual da SHEIN. A SHEIN é referência de amplitude funcional e fluidez comercial, não de identidade visual.

## 3. Diagnóstico conhecido

O site atual é uma landing page WordPress simples, com navegação por âncoras, apresentação institucional, três produtos de exemplo, galeria e formulário de contato. Ele ainda não oferece uma experiência real de e-commerce.

O repositório `Loja-Online-Perfume` é uma SPA React/Vite/TypeScript de demonstração com:

- home, catálogo, produto, carrinho, checkout e sucesso;
- busca, filtros e ordenação;
- favoritos;
- cupom, frete e resumo financeiro;
- persistência em `localStorage`;
- conta e pedidos demonstrativos;
- afiliados e painel administrativo demonstrativo;
- layout responsivo.

Use essa cobertura como baseline, mas não replique sua arquitetura monolítica, sua identidade Maison Aura, seus perfumes, seus campos olfativos, seus produtos, seus textos ou seus dados. A OFFZY precisa de domínio próprio de moda: variações de tamanho e cor, guia de medidas, estoque por variante, composição, modelagem, cuidados, coleções, looks e conteúdo de streetwear.

## 4. Natureza da entrega e limites

Esta primeira entrega é um **site modelo/demonstração navegável para apresentação ao cliente**.

Regras obrigatórias:

- Não integrar pagamento real, banco real, ERP, transportadora ou autenticação real sem credenciais e autorização explícitas.
- Não solicitar nem gravar dados reais de cartão.
- Checkout, pagamento, estoque, pedidos, frete, conta e painel administrativo devem funcionar em modo demonstrativo seguro e ser claramente identificados internamente como demo.
- Não espalhar avisos “fictício” pela vitrine pública a ponto de prejudicar a apresentação. Use um indicador discreto de “Ambiente de demonstração” e textos claros apenas onde existe risco de confusão, especialmente no checkout e admin.
- Não usar botões decorativos sem comportamento. Toda ação visível deve funcionar, ficar corretamente desabilitada com explicação, ou ser removida.
- Não inventar CNPJ, endereço, telefone, política comercial, prazo, preço definitivo, estoque definitivo, gateway ou conta social.
- Preços existentes no site atual podem ser importados como conteúdo inicial de demonstração, mas devem ser centralizados e marcados no modelo de dados como pendentes de validação comercial.
- Quando faltarem fotos ou dados de catálogo, reutilizar somente materiais do cliente/site atual cuja utilização seja legítima. Se ainda faltar conteúdo, criar placeholders editoriais elegantes e explicitamente rastreáveis como “substituir por conteúdo aprovado”, sem fingir que são produtos finais.
- A arquitetura deve permitir trocar o armazenamento local por API/Supabase e integrar gateway, frete e autenticação depois, sem reescrever toda a UI.

Fora do escopo desta entrega, salvo autorização posterior:

- cobrança real;
- emissão fiscal;
- integração real com Correios/transportadora;
- login social;
- recuperação de senha por e-mail real;
- disparo real de WhatsApp/e-mail;
- deploy em domínio de produção substituindo o site atual;
- uso de ferramentas, assets ou componentes pagos.

## 5. Objetivo principal

Construir uma loja online completa e premium que permita ao cliente visualizar uma experiência convincente da futura operação da OFFZY, incluindo descoberta de produtos, busca, filtros, detalhe com variantes, favoritos, carrinho, checkout demonstrativo, conta, pedidos e painel administrativo demonstrativo.

A experiência deve parecer uma marca streetwear real pronta para crescer, e não um protótipo acadêmico.

## 6. Stack e arquitetura

Como o workspace ainda não contém aplicação e o projeto de referência usa React/Vite/TypeScript, adote como padrão:

- React 19 + TypeScript em modo estrito;
- Vite;
- React Router para rotas reais e URLs compartilháveis;
- CSS modular, CSS Modules ou camada de estilos organizada com design tokens;
- Lucide React para ícones quando adequado;
- estado global pequeno e previsível, preferencialmente Context + reducer ou solução já justificada;
- persistência demo atrás de uma abstração de repositório/storage, usando `localStorage` apenas para dados não sensíveis;
- React Hook Form + validação tipada quando trouxerem benefício real;
- Vitest + Testing Library para lógica/componentes críticos;
- Playwright para E2E e validação responsiva.

Antes de instalar dependências, verifique versões atuais e compatibilidade na documentação oficial/Context7. Não adicione biblioteca sem necessidade. Não use Chakra UI, Tailwind ou outra biblioteca apenas por preferência; primeiro verifique se ela melhora de fato o projeto. Se Chakra existir no projeto criado por decisão anterior, valide a versão e use padrões v3.

Estruture por domínio, evitando um `App.tsx` gigante. Organização sugerida, adaptável após análise:

```text
src/
  app/
  assets/
  components/
  design-system/
  features/
    catalog/
    product/
    cart/
    checkout/
    favorites/
    account/
    orders/
    admin/
  data/
  domain/
  hooks/
  services/
  storage/
  styles/
  test/
```

Mantenha regras de preço, desconto, frete, estoque e pedido em funções de domínio testáveis, não dentro de componentes visuais.

## 7. Rotas e páginas obrigatórias

Implemente rotas reais, com página 404 e preservação do estado de navegação:

```text
/
/loja
/colecoes/:slug
/categoria/:slug
/produto/:slug
/busca
/favoritos
/carrinho
/checkout
/pedido-confirmado/:id
/conta
/conta/pedidos
/conta/pedidos/:id
/conta/enderecos
/sobre
/manifesto
/guia-de-medidas
/faq
/contato
/politica-de-trocas
/politica-de-privacidade
/termos-de-uso
/admin
/admin/produtos
/admin/pedidos
/admin/cupons
/admin/conteudo
```

O admin deve usar um modo de acesso demonstrativo claramente separado da autenticação de produção. Nunca apresente esse gate local como segurança real.

## 8. Home page

A home deve combinar narrativa de marca e conversão, com ritmo editorial premium:

1. Barra de anúncio configurável.
2. Header sticky com logo correta, menu, busca, conta, favoritos e carrinho.
3. Mega menu ou navegação clara para novidades, camisetas, moletons, acessórios e coleções.
4. Hero com imagem forte da marca, slogan aprovado, CTA “Explorar coleção” e CTA secundário para o manifesto.
5. Benefícios comerciais configuráveis: compra segura, trocas, envio e atendimento.
6. Lançamentos.
7. Mais vendidos.
8. Categorias visuais.
9. Banner editorial “Não siga tendências. Crie presença.”
10. Bloco “Complete o look”.
11. Manifesto OFFZY resumido.
12. Conteúdo social/lookbook usando fotos aprovadas.
13. Depoimentos apenas se identificados como conteúdo demonstrativo pendente de aprovação; não inventar clientes verificados.
14. Newsletter demonstrativa com consentimento claro.
15. Footer completo com navegação, políticas, contato configurável e redes reais quando confirmadas.

Evite carrosséis automáticos agressivos, excesso de animações, banners piscando ou padrões que prejudiquem leitura e desempenho.

## 9. Catálogo, busca e descoberta

O catálogo deve oferecer:

- busca com sugestões e histórico local opcional;
- resultados por nome, SKU, categoria, coleção e tags;
- filtros combináveis por categoria, coleção, tamanho, cor, faixa de preço, promoção e disponibilidade;
- ordenação por relevância, novidades, mais vendidos, menor preço e maior preço;
- chips de filtros ativos com remoção individual e “limpar tudo”;
- contagem de resultados;
- grade responsiva;
- paginação ou carregamento progressivo acessível;
- quick view ou quick add apenas se não prejudicar mobile/acessibilidade;
- estados de carregamento, vazio e erro;
- produtos visualizados recentemente;
- URLs que preservem busca/filtros quando fizer sentido.

Cada card deve ter imagem, nome, categoria/coleção, preço, preço promocional quando aplicável, cores disponíveis, selo legítimo, favorito e ação clara. Não exibir avaliações falsas como se fossem reais.

## 10. Produto e variantes

A página de produto deve conter:

- galeria responsiva com zoom/lightbox e miniaturas;
- nome, SKU, coleção e categoria;
- preço em BRL e parcelamento demonstrativo configurável;
- seleção obrigatória de cor e tamanho;
- estoque por variante no modelo de dados;
- CTA de compra com estado sticky em mobile;
- feedback de variante indisponível;
- guia de medidas acessível;
- descrição editorial;
- composição do tecido;
- modelagem;
- cuidados com a peça;
- medidas do modelo/fotografia quando houver dados aprovados;
- cálculo demonstrativo de frete por CEP, sem prometer prazo real;
- política resumida de troca;
- produtos relacionados;
- “complete o look”;
- compartilhamento com Web Share API e fallback seguro;
- avaliações estruturadas como módulo preparado, sem fabricar prova social.

O botão “Adicionar ao carrinho” deve bloquear enquanto cor/tamanho obrigatórios não forem selecionados e explicar o motivo.

## 11. Carrinho e favoritos

Implemente:

- minicart/drawer e página completa de carrinho;
- persistência após refresh;
- identificação de item por produto + cor + tamanho, não apenas ID do produto;
- alteração de quantidade respeitando estoque demo;
- remoção com opção de desfazer;
- mover para favoritos;
- cupom demonstrativo com mensagens claras;
- cálculo centralizado de subtotal, desconto, frete e total;
- barra de progresso de frete grátis configurável;
- recomendação complementar sem interromper o checkout;
- carrinho vazio e favoritos vazios bem desenhados;
- sincronização correta dos contadores no header.

## 12. Checkout demonstrativo

Crie checkout em etapas, simples e mobile-first:

1. Identificação: nome, e-mail e telefone.
2. Entrega: CEP, endereço, número, complemento, bairro, cidade e UF.
3. Frete demonstrativo: opções e prazos marcados como simulação.
4. Pagamento demonstrativo: Pix e cartão simulado.
5. Revisão final e confirmação.

Requisitos:

- máscaras e validações brasileiras;
- não persistir dados sensíveis de cartão;
- nunca solicitar CVV real em uma demonstração; use componente explicitamente simulado ou dados de teste indicados na própria UI;
- resumo sticky no desktop e acessível no mobile;
- erros por campo e foco automático no primeiro erro;
- proteção contra submissão duplicada;
- geração de pedido demo com ID único, data, itens em snapshot, valores e status;
- tela de sucesso com próximos passos e acesso ao pedido;
- restauração segura do fluxo após refresh quando possível;
- nenhum pagamento ou mensagem real deve ser disparado.

## 13. Conta, pedidos e pós-compra

O modo conta demonstrativa deve permitir:

- entrar com perfil demo sem alegar autenticação real;
- visualizar dados do perfil;
- gerenciar endereços locais;
- listar pedidos;
- abrir detalhe do pedido;
- visualizar timeline de status;
- ver itens, variantes, totais e endereço mascarado;
- ação “comprar novamente”;
- iniciar solicitação de troca apenas como fluxo demonstrativo, sem envio externo;
- sair e limpar sessão demo sem apagar carrinho/favoritos indevidamente.

## 14. Painel administrativo demonstrativo

O admin deve demonstrar a futura operação, com persistência local e isolamento arquitetural:

- dashboard com métricas derivadas dos pedidos demo, nunca números estáticos apresentados como realidade;
- CRUD de produtos;
- categorias e coleções;
- variantes de tamanho/cor;
- estoque por variante;
- imagens e ordenação da galeria;
- preços e promoções;
- status ativo/rascunho/esgotado;
- listagem e detalhe de pedidos;
- atualização de status do pedido;
- cupons com validade, tipo, valor, mínimo e status;
- blocos configuráveis da home;
- textos institucionais e anúncios;
- exportação local em JSON/CSV quando simples e útil;
- confirmação para ações destrutivas;
- estados vazios, erro e validação;
- aviso visível de que RBAC, autenticação e persistência são demonstrativos.

Não implemente painel superficial com números soltos e botões sem ação.

## 15. Modelo de dados mínimo

Defina tipos explícitos para:

- Product;
- ProductVariant;
- Category;
- Collection;
- CartItem;
- Favorite;
- Coupon;
- Address;
- CustomerProfile;
- Order;
- OrderItemSnapshot;
- ShippingOption;
- HomeContent;
- StoreSettings.

Produto deve suportar, no mínimo:

```text
id, slug, sku, name, shortDescription, description, categoryId,
collectionIds, tags, materials, fit, careInstructions, basePrice,
salePrice, status, images, variants, featured, createdAt, updatedAt
```

Variante deve suportar:

```text
id, productId, colorName, colorHex, size, sku, stock, enabled
```

Pedido deve guardar snapshot imutável dos itens, preços, variante e textos relevantes. Alterar um produto depois não pode modificar pedidos anteriores.

Centralize os dados demo em seed/factory identificável. Não misture seed com lógica de UI.

## 16. Design e UX

Antes de implementar a interface:

1. Analise o site atual e os assets locais.
2. Se Mobbin MCP estiver disponível e autenticado, pesquise referências reais de fashion e-commerce para: home, PLP/catálogo, PDP/produto, carrinho, checkout, conta e admin.
3. Use Landbook e Awwwards apenas como inspiração complementar para composição, fotografia, movimento e acabamento.
4. Não copie telas, textos, assets ou identidade de terceiros.
5. Documente os padrões aplicados e por que combinam com a OFFZY.

Direção visual:

- editorial, urbano, minimalista e premium;
- preto/grafite dominante, branco de alto contraste e bege/dourado como acento controlado;
- grid forte, bastante espaço negativo e fotografia protagonista;
- bordas discretas, poucas sombras e componentes precisos;
- tipografia sem serifa contemporânea; use apenas fontes licenciadas/disponíveis;
- animações curtas e funcionais, respeitando `prefers-reduced-motion`;
- evitar glassmorphism genérico, gradientes excessivos, excesso de cards arredondados e aparência de dashboard SaaS na vitrine.

Crie design tokens para cores, tipografia, espaçamento, raios, sombras, transições e breakpoints. Implemente componentes reutilizáveis para botão, campo, select, modal/drawer, badge, preço, card de produto, empty state, skeleton, toast e confirmação.

## 17. Assets e conteúdo

- Preserve os arquivos originais.
- Crie cópias web otimizadas em formatos adequados, sem degradar o logo.
- Use `srcset`, `sizes`, lazy loading e dimensões explícitas.
- Não estique, distorça ou aplique fundo incompatível ao logo.
- Gere favicon e variações de marca somente a partir dos materiais aprovados.
- Inspecione as imagens do site atual e baixe apenas as que pertencem ao cliente e são necessárias.
- Escreva `alt` descritivo para conteúdo e `alt=""` para imagem puramente decorativa.
- Mantenha um arquivo de pendências de conteúdo com tudo que precisa de aprovação do cliente: catálogo final, fotos, SKUs, tamanhos, cores, preços, estoque, políticas, contato, CNPJ, endereço, frete e pagamento.

## 18. Segurança, privacidade e integridade

- Não versionar segredos, tokens ou chaves.
- Não usar `dangerouslySetInnerHTML` com conteúdo não sanitizado.
- Validar e normalizar entradas.
- Não registrar dados pessoais ou dados de pagamento no console.
- Não tratar `localStorage` como armazenamento seguro.
- Deixar explícito que o gate do admin demo não substitui autenticação/RBAC.
- Proteger contra open redirect, URL insegura e links externos sem atributos adequados.
- Adicionar consentimento e texto de privacidade quando formulário/newsletter coletarem dados, ainda que apenas em demo.
- Se um formulário não enviar dados, informar isso claramente após a submissão demonstrativa.
- Não usar dados reais de clientes nos testes.

## 19. SEO, acessibilidade e performance

Implemente:

- títulos e descrições por rota;
- canonical configurável;
- Open Graph e Twitter cards;
- sitemap e robots adequados ao modo demo;
- dados estruturados `Organization`, `WebSite`, `BreadcrumbList` e `Product` apenas com dados realmente disponíveis;
- HTML semântico;
- navegação completa por teclado;
- foco visível;
- skip link;
- labels e mensagens de erro associadas;
- modais/drawers com foco controlado;
- contraste WCAG AA;
- toque mínimo adequado em mobile;
- suporte a zoom e texto ampliado;
- `prefers-reduced-motion`;
- carregamento otimizado de fontes e imagens;
- divisão de bundle por rota quando útil;
- ausência de layout shift evitável.

Metas após build de produção, medidas na home e nas rotas principais em ambiente local estável:

- Lighthouse Performance: preferencialmente >= 90;
- Accessibility: >= 95;
- Best Practices: >= 95;
- SEO: >= 90;
- nenhum erro de console;
- nenhuma requisição crítica quebrada.

Se uma meta não for atingida, documente o valor real, causa e ação necessária. Não altere números ou oculte falhas.

## 20. Execução obrigatória

Siga esta ordem:

1. Inventarie workspace, Git, arquivos, assets, documentação e site atual.
2. Clone ou consulte o repositório de referência em diretório temporário/read-only e mapeie fluxos, componentes, dados e limitações.
3. Consulte Obsidian relevante; se os caminhos esperados não existirem, inventarie o vault real.
4. Defina o que é reutilizável conceitualmente e o que deve ser redesenhado.
5. Apresente diagnóstico curto, arquivos planejados e riscos antes das alterações.
6. Defina arquitetura, rotas, modelo de dados, design tokens e plano de testes.
7. Implemente por módulos, começando pelo shell/design system e domínio.
8. Implemente vitrine, catálogo, produto, carrinho, checkout, conta e admin.
9. Adicione testes durante a implementação, não somente ao final.
10. Execute lint, typecheck, testes, build e E2E.
11. Rode a aplicação e valide visualmente com Playwright/Chrome DevTools.
12. Teste desktop, tablet e mobile, corrigindo overflow, foco, console e network.
13. Revise conteúdo, acessibilidade, segurança e desempenho.
14. Atualize README e documentação de operação/demo.
15. Atualize a nota do projeto no Obsidian com decisões, arquivos, validações, riscos e pendências.
16. Finalize apenas com evidências reais.

Se o ambiente suportar subagentes, use frentes especializadas para: inventário/arquitetura, identidade/UX, implementação comercial e QA/acessibilidade. O agente principal deve revisar conflitos e consolidar a entrega. Não use subagentes como formalidade.

## 21. Testes obrigatórios

Crie e execute testes proporcionais ao risco.

### Testes unitários/de integração

- cálculo de preço normal e promocional;
- cupom percentual e fixo, mínimo e validade;
- frete grátis e opções demonstrativas;
- item de carrinho identificado por produto + cor + tamanho;
- limite de estoque por variante;
- snapshot de pedido;
- persistência e migração segura do storage;
- validação dos formulários críticos;
- filtros combinados e ordenação.

### E2E com Playwright

1. Abrir home e navegar pelo menu.
2. Buscar produto.
3. Filtrar catálogo por categoria, tamanho, cor e preço.
4. Abrir produto, selecionar cor/tamanho e adicionar ao carrinho.
5. Validar bloqueio sem variante.
6. Alterar quantidade e aplicar cupom.
7. Persistir carrinho após refresh.
8. Favoritar e remover favorito.
9. Completar checkout demonstrativo.
10. Confirmar pedido e verificar snapshot na conta.
11. Comprar novamente.
12. Criar/editar produto no admin demo e refletir no catálogo.
13. Atualizar status de pedido no admin e refletir na conta.
14. Validar estados vazios e erros.

### Viewports mínimas

```text
360x800
390x844
768x1024
1024x768
1440x900
```

Em cada viewport relevante, verificar header, menus, filtros, galeria, variações, carrinho, checkout, tabelas/admin, modais, footer e ausência de overflow horizontal.

## 22. Critérios de aceite

A entrega só está concluída quando:

- a identidade visual da OFFZY é reconhecível e coerente com o site/assets atuais;
- nenhuma marca, produto ou texto da Maison Aura/Loja-Online-Perfume permanece;
- todas as rotas obrigatórias funcionam;
- catálogo, busca, filtros e ordenação funcionam em conjunto;
- produtos suportam cor, tamanho, estoque e SKU por variante;
- carrinho e favoritos persistem após refresh;
- cálculos de cupom, frete e total são corretos e testados;
- checkout demo conclui sem coletar ou transmitir pagamento real;
- pedido guarda snapshot imutável dos itens;
- conta demonstra pedidos, detalhe e status;
- admin demo gerencia produtos, variantes, pedidos, cupons e conteúdo;
- nenhum CTA principal é falso ou inerte;
- estados loading, vazio, erro, sucesso e indisponibilidade existem;
- layout funciona nos viewports definidos e não tem overflow global;
- navegação por teclado e foco são funcionais;
- não existem erros de console nem recursos críticos quebrados;
- lint, typecheck, testes e build passam;
- E2E críticos passam;
- dados e integrações não validados estão claramente separados da realidade de produção;
- README e checklist de pendências do cliente estão atualizados;
- o relatório final separa com precisão o que foi provado, o que é demo e o que depende de integração real.

## 23. Arquivos de documentação esperados

Crie ou atualize:

- `README.md`: instalação, comandos, arquitetura, modo demo e limites;
- `docs/ARQUITETURA.md`: módulos, fluxo de dados e adapters futuros;
- `docs/IDENTIDADE-OFFZY.md`: tokens, tipografia, logo e uso de imagens;
- `docs/CONTEUDO-PENDENTE-CLIENTE.md`: tudo que precisa ser fornecido/aprovado;
- `docs/PLANO-PRODUCAO.md`: backend, auth, gateway, frete, LGPD, observabilidade e deploy necessários para produção;
- `.env.example`: somente variáveis sem segredo e explicações;
- nota operacional no Obsidian, se o vault estiver acessível.

## 24. Entrega final esperada

No relatório final, informe objetivamente:

1. Diagnóstico inicial confirmado.
2. Arquitetura adotada.
3. Funcionalidades implementadas.
4. Arquivos criados/alterados.
5. Comandos e testes executados, com resultado real.
6. Fluxos E2E validados.
7. Viewports testadas.
8. Resultados de console, network e Lighthouse.
9. Riscos tratados.
10. Limitações do modo demo.
11. Dados e decisões que ainda dependem do cliente.
12. Documentação e Obsidian atualizados.

É proibido declarar “pronto”, “validado” ou “100% funcional” sem evidência correspondente. Se algo não puder ser testado, informe exatamente o que faltou, por que faltou, o risco residual e como validar manualmente.
