# Levantamento de Páginas — Divina Mulher

## Páginas já existentes
- `/` — Home
- `/colecao/$slug` — Listagem de coleção (com filtros)
- `/produto/$slug` — PDP (página de produto)
- `/sobre` — Sobre a marca
- `/guia-de-medidas` — Guia de medidas

## Páginas pendentes (agrupadas por prioridade)

### 1. Essenciais de e-commerce (bloqueiam conversão)
- `/carrinho` — Página de carrinho dedicada (hoje só existe o drawer lateral)
- `/busca` — Resultados de busca (a lupa do header ainda não tem destino)
- `/favoritos` (ou `/lista-de-desejos`) — Wishlist (ícone de coração no header)
- `/conta` — Hub do cliente (ícone de perfil no header)
  - `/conta/login` e `/conta/cadastro`
  - `/conta/pedidos` — Histórico/status de pedidos
  - `/conta/enderecos`
  - `/conta/dados` — Dados pessoais / trocar senha
  - `/conta/recuperar-senha`

### 2. Navegação / catálogo
- `/colecoes` — Índice de todas as coleções/categorias (hoje só se chega via menu)
- `/novidades`, `/tendencias`, `/mais-vendidos` — Hoje são apenas seções na home; viram landing pages próprias
- `/lookbook` ou `/editorial` — Conteúdo editorial (opcional, reforça posicionamento premium)

### 3. Institucionais (hoje todos os links do Footer apontam para `/sobre`)
- `/nossa-historia` (separar de `/sobre`, com a timeline)
- `/lojas` — Lojas físicas de Joinville (mapa + endereço + horários)
- `/trabalhe-conosco` — Vagas / formulário
- `/contato` — Formulário + WhatsApp + e-mail
- `/central-de-ajuda` ou `/faq` — Perguntas frequentes
- `/trocas-e-devolucoes` — Política de trocas
- `/entrega-e-frete` — Prazos, fretes, rastreio
- `/formas-de-pagamento`
- `/politica-de-privacidade`
- `/termos-de-uso`
- `/clube-vip` — Página dedicada ao programa (hoje só CTA de newsletter)

### 4. Sistema / utilidades
- `/404` — Página de não encontrado (notFoundComponent do root + rota dedicada)
- `/checkout/sucesso` — Página de retorno pós-checkout Shopify (thank-you page com order lookup)
- `sitemap.xml` e `robots.txt` — SEO técnico

## Sugestão de ordem de execução
1. **Sprint 1 (conversão):** `/carrinho`, `/busca`, `/favoritos`, `/conta` + sub-rotas de auth.
2. **Sprint 2 (institucionais legais):** `/trocas-e-devolucoes`, `/entrega-e-frete`, `/politica-de-privacidade`, `/termos-de-uso`, `/contato`, `/faq` — destrava os links do footer e reduz dúvidas pré-compra.
3. **Sprint 3 (marca + catálogo):** `/lojas`, `/nossa-historia`, `/clube-vip`, `/novidades`, `/tendencias`, `/mais-vendidos`, `/colecoes`.
4. **Sprint 4 (polimento):** `/lookbook`, `/trabalhe-conosco`, `/404`, `/checkout/sucesso`, sitemap/robots.

## Observações técnicas
- Auth do cliente (`/conta/*`) depende de habilitar Customer Accounts do Shopify ou Lovable Cloud + Storefront API customer mutations — decidir antes da Sprint 1.
- Wishlist pode começar local (Zustand + localStorage) e migrar para conta logada depois.
- `/busca` usa `searchProducts` do Storefront API; já temos cliente Shopify configurado.
- Cada rota nova deve ter `head()` próprio (title/description/og) — padrão TanStack Start.

Quer que eu já comece pela Sprint 1, ou prefere reordenar / cortar algo da lista?
