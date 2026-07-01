## Objetivo
Permitir que a dona da loja edite os 3 (ou mais) slides do hero da home direto pelo admin do Shopify, sem tocar em código, usando **Files + Metaobjects** nativos.

## Setup único no admin Shopify (feito por mim, guiado passo a passo)
Em **Settings → Custom data → Metaobjects → Add definition**:

- **Name**: `Home Banner` · **Type**: `home_banner`
- **Storefront access**: ✅ Storefronts can access
- **Fields**:
  - `image` — File (aceita apenas imagens)
  - `headline` — Single line text
  - `subheadline` — Multi-line text (opcional)
  - `cta_label` — Single line text (opcional)
  - `cta_url` — URL (opcional)
  - `order` — Integer (para ordenar os slides)
  - `active` — Boolean (liga/desliga sem deletar)

Depois eu crio as 3 entradas iniciais reproduzindo os banners atuais para não haver regressão visual.

## Fluxo da dona da loja depois de pronto
1. **Content → Files** → sobe a imagem nova.
2. **Content → Metaobjects → Home Banner → Add entry** → preenche campos, escolhe imagem, marca `active`.
3. Salvou → o site reflete em segundos (com revalidação por foco de janela via React Query).
4. Para desativar um slide: desmarca `active`. Para reordenar: muda `order`.

## Mudanças de código

### `src/lib/shopify.ts`
Adicionar `fetchHomeBanners()` com query GraphQL Storefront API:
```graphql
query HomeBanners {
  metaobjects(type: "home_banner", first: 20) {
    edges { node {
      id
      fields { key value reference { ... on MediaImage { image { url altText width height } } } }
    }}
  }
}
```
Normaliza para `{ image, alt, headline, subheadline, ctaLabel, ctaUrl, order, active }[]`, filtra `active`, ordena por `order`.

### `src/components/site/HeroBanner.tsx`
- Trocar o array `SLIDES` hardcoded por `useQuery({ queryKey: ["home-banners"], queryFn: fetchHomeBanners, staleTime: 60_000 })`.
- **Fallback**: se `data` vier vazio ou a query falhar, usa os 3 slides atuais como default (constante `FALLBACK_SLIDES`) — home nunca fica em branco.
- Renderiza `headline`/`subheadline`/CTA por cima da imagem quando existirem (com overlay atual `bg-black/20` mantido).
- Mantém autoplay 5s, setas, dots, pausa no hover/focus, navegação por teclado, alturas 60vh/80vh — sem mexer em acessibilidade.
- Loading: mostra o primeiro slide de fallback para evitar CLS; sem spinner (é hero above-the-fold).

### `src/routes/index.tsx`
Nenhuma mudança de layout. Opcional: `prefetchQuery(["home-banners"], fetchHomeBanners)` no `loader` para o hero chegar já pronto no SSR.

## Guia rápido para a dona
Adicionar um arquivo `MANUAL-BANNERS.md` na raiz (curto, com 5 prints/passos e a URL direta `admin.shopify.com/store/.../content/entries/home_banner`). Se preferir, viro isso em uma página `/admin/ajuda-banners` protegida — mas por ora um markdown resolve.

## Fora do escopo desta entrega
- Editor visual dentro do Lovable (painel próprio) — descartado.
- Banners de outras seções (Lançamentos, Coleções, Clube VIP) — dá pra replicar a mesma mecânica depois criando novos metaobjects (`section_highlight`, etc.) reutilizando o mesmo helper.
- Agendamento por data (publicar/despublicar automaticamente) — Shopify não oferece nativo; ficaria numa v2.

## Riscos e mitigação
- **Storefront token sem permissão de metaobjects**: se a query retornar vazio/erro, o fallback mantém o site funcionando; eu ajusto o token/escopo no momento da implementação.
- **Imagem muito pesada subida pela cliente**: uso o transform `url(transform: { maxWidth: 2000, preferredContentType: WEBP })` da CDN da Shopify direto na query, garantindo performance.
