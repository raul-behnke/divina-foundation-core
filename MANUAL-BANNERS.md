# Manual — Editar banners da home (Divina Mulher)

Os 3 banners rotativos que aparecem no topo da home são carregados direto do admin do Shopify. Você pode trocar imagem, título, subtítulo, botão e ordem sem mexer no código.

## Setup único (feito uma vez)

Em **Settings → Custom data → Metaobjects → Add definition**:

- **Name**: `Home Banner`
- **Type**: `home_banner`
- **Storefronts can access**: ✅ ligado
- **Fields** (nesta ordem, exatamente com estes nomes técnicos):

| Nome exibido | Tipo | Nome técnico (key) | Obrigatório |
|---|---|---|---|
| Imagem | File → apenas imagens | `image` | Sim |
| Título | Single line text | `headline` | Não |
| Subtítulo | Multi-line text | `subheadline` | Não |
| Texto do botão | Single line text | `cta_label` | Não |
| Link do botão | URL | `cta_url` | Não |
| Ordem | Integer | `order` | Não (default 0) |
| Ativo | Boolean | `active` | Não (default true) |

## Como adicionar/editar um banner (dia a dia)

1. **Content → Files** → arraste a imagem do banner (recomendado: 2000×1200px, JPG ou WEBP, até 500 KB).
2. **Content → Metaobjects → Home Banner → Add entry**.
3. Preencha:
   - **Imagem**: escolha a que subiu no passo 1.
   - **Título** e **Subtítulo**: opcionais. Se deixar em branco, aparece só a imagem.
   - **Texto do botão** + **Link do botão**: preencha os dois juntos (ou nenhum). Link pode ser `/colecao/vestidos`, `/clube-vip` etc.
   - **Ordem**: número menor aparece primeiro (ex.: 1, 2, 3).
   - **Ativo**: marque para publicar. Desmarque para esconder sem deletar.
4. **Save**. O site atualiza em segundos.

## Regras rápidas

- Deletou/desativou todos os banners? A home volta para 3 banners padrão automaticamente (nunca fica em branco).
- Quer trocar só a foto de um slide? Edite a entrada e troque a imagem. Pronto.
- Quer testar antes de publicar? Deixe `Ativo` desmarcado até estar pronta.
- Não use links externos (outros sites) — mantenha URLs internas para o cliente não sair da loja.

## Onde acessar direto

`https://admin.shopify.com/store/<sua-loja>/content/entries/home_banner`
