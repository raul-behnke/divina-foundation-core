export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  installments: number;
  compareAtPrice?: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  category: "vestidos" | "alfaiataria" | "blusas" | "plus";
  isPlus: boolean;
  isNew: boolean;
  description: string;
  composition: string;
  care: string;
}

const studio = [
  "https://divinamulher.com.br/wp-content/uploads/2025/12/15386744535-estudio-divina-mulher-16-10-2025-0031.jpg",
  "https://divinamulher.com.br/wp-content/uploads/2025/12/15393449523-estudio-divina-mulher-31-10-2025-0587.jpg",
  "https://divinamulher.com.br/wp-content/uploads/2025/12/15393459661-estudio-divina-mulher-31-10-2025-0695.jpg",
  "https://divinamulher.com.br/wp-content/uploads/2025/12/15336181427-estudio-divina-mulher-21-03-2025-0348.jpeg",
  "https://divinamulher.com.br/wp-content/uploads/2025/03/15330629596-fotografia-de-estudio-divina-mulher-0981.jpeg",
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=1125&q=80`;

const editorial = [
  unsplash("photo-1490481651871-ab68de25d43d"),
  unsplash("photo-1539109136881-3be0616acf4b"),
  unsplash("photo-1551803091-e20673f15770"),
  unsplash("photo-1483985988355-763728e1935b"),
  unsplash("photo-1542295474-cdde9919a35e"),
  unsplash("photo-1496747611176-843222e1e57c"),
  unsplash("photo-1485518882345-15568b007407"),
  unsplash("photo-1572804013309-59a88b7e92f1"),
  unsplash("photo-1581044777550-4cfa60707c03"),
  unsplash("photo-1469334031218-e382a71b716b"),
  unsplash("photo-1551803091-e20673f15770"),
  unsplash("photo-1576566588028-4147f3842f27"),
];

const COLORS = {
  preto: { name: "Preto", hex: "#171717" },
  vinho: { name: "Vinho", hex: "#7E2145" },
  off:   { name: "Off-white", hex: "#F2EFE9" },
  caramel: { name: "Caramelo", hex: "#A86B3C" },
  rose: { name: "Rosé", hex: "#E296B0" },
  marinho: { name: "Marinho", hex: "#1E2A44" },
  verde: { name: "Verde Oliva", hex: "#5C6B3F" },
  nude: { name: "Nude", hex: "#D8B89B" },
};

const STD = ["PP", "P", "M", "G", "GG"];
const PLUS = ["G1", "G2", "G3"];

export const products: Product[] = [
  {
    id: "p1", slug: "vestido-midi-alfaiataria", name: "Vestido Midi Alfaiataria",
    price: 389, installments: 5, colors: [COLORS.preto, COLORS.vinho, COLORS.off],
    sizes: STD, images: [studio[0], editorial[0], editorial[1]],
    category: "vestidos", isPlus: false, isNew: true,
    description: "Vestido midi de alfaiataria com caimento estruturado, gola V e cintura marcada. Peça versátil que transita do dia ao jantar com elegância silenciosa.",
    composition: "68% Viscose · 28% Poliéster · 4% Elastano",
    care: "Lavar à mão em água fria. Não usar alvejante. Passar em temperatura baixa.",
  },
  {
    id: "p2", slug: "vestido-longo-chemise", name: "Vestido Longo Chemise",
    price: 459, installments: 5, colors: [COLORS.marinho, COLORS.preto],
    sizes: STD, images: [editorial[2], editorial[3]],
    category: "vestidos", isPlus: false, isNew: true,
    description: "Modelagem chemise alongada com fenda discreta e cinto removível.",
    composition: "100% Viscose", care: "Lavar a seco.",
  },
  {
    id: "p3", slug: "vestido-curto-evase", name: "Vestido Curto Evasê",
    price: 279, installments: 5, colors: [COLORS.rose, COLORS.off, COLORS.preto],
    sizes: STD, images: [editorial[4], editorial[5]],
    category: "vestidos", isPlus: false, isNew: false,
    description: "Corte evasê leve, ideal para climas quentes e looks descontraídos.",
    composition: "55% Linho · 45% Viscose", care: "Lavar à mão.",
  },
  {
    id: "p4", slug: "blazer-oversized-alfaiataria", name: "Blazer Oversized Alfaiataria",
    price: 479, installments: 5, colors: [COLORS.preto, COLORS.caramel, COLORS.marinho],
    sizes: STD, images: [studio[1], editorial[6]],
    category: "alfaiataria", isPlus: false, isNew: true,
    description: "Blazer de modelagem oversized com ombros estruturados e botões em madrepérola.",
    composition: "70% Poliéster · 28% Viscose · 2% Elastano",
    care: "Lavar a seco.",
  },
  {
    id: "p5", slug: "calca-alfaiataria-pantalona", name: "Calça Alfaiataria Pantalona",
    price: 329, installments: 5, colors: [COLORS.preto, COLORS.off, COLORS.verde],
    sizes: STD, images: [studio[2], editorial[7]],
    category: "alfaiataria", isPlus: false, isNew: false,
    description: "Calça pantalona de cintura alta com pregas frontais e caimento fluido.",
    composition: "62% Viscose · 35% Poliéster · 3% Elastano",
    care: "Lavar à mão.",
  },
  {
    id: "p6", slug: "conjunto-blazer-calca", name: "Conjunto Blazer e Calça",
    price: 759, installments: 5, colors: [COLORS.vinho, COLORS.preto],
    sizes: STD, images: [editorial[8], studio[3]],
    category: "alfaiataria", isPlus: false, isNew: true,
    description: "Conjunto coordenado em alfaiataria — blazer + calça pantalona.",
    composition: "70% Poliéster · 28% Viscose · 2% Elastano",
    care: "Lavar a seco.",
  },
  {
    id: "p7", slug: "blusa-seda-decote-v", name: "Blusa Seda Decote V",
    price: 219, installments: 5, colors: [COLORS.off, COLORS.rose, COLORS.preto],
    sizes: STD, images: [editorial[9], editorial[10]],
    category: "blusas", isPlus: false, isNew: false,
    description: "Blusa em toque de seda com decote V suave e mangas longas fluídas.",
    composition: "100% Poliéster acetinado", care: "Lavar à mão.",
  },
  {
    id: "p8", slug: "camisa-linho-classica", name: "Camisa Linho Clássica",
    price: 249, installments: 5, colors: [COLORS.off, COLORS.nude],
    sizes: STD, images: [editorial[11], editorial[0]],
    category: "blusas", isPlus: false, isNew: true,
    description: "Camisa em linho puro com modelagem reta e acabamento refinado.",
    composition: "100% Linho", care: "Lavar à mão em água fria.",
  },
  /* Plus Size */
  {
    id: "p9", slug: "vestido-midi-plus-alfaiataria", name: "Vestido Midi Plus Alfaiataria",
    price: 409, installments: 5, colors: [COLORS.preto, COLORS.vinho],
    sizes: PLUS, images: [editorial[1], studio[0]],
    category: "plus", isPlus: true, isNew: true,
    description: "Versão Plus do nosso vestido midi de alfaiataria, com modelagem que valoriza as curvas e tecido com leve elasticidade.",
    composition: "65% Viscose · 30% Poliéster · 5% Elastano",
    care: "Lavar à mão.",
  },
  {
    id: "p10", slug: "blusa-plus-decote-quadrado", name: "Blusa Plus Decote Quadrado",
    price: 199, installments: 5, colors: [COLORS.off, COLORS.preto, COLORS.rose],
    sizes: PLUS, images: [editorial[3], editorial[5]],
    category: "plus", isPlus: true, isNew: false,
    description: "Blusa Plus com decote quadrado e mangas bufantes delicadas.",
    composition: "95% Viscose · 5% Elastano", care: "Lavar à mão.",
  },
  {
    id: "p11", slug: "calca-plus-alfaiataria", name: "Calça Plus Alfaiataria",
    price: 349, installments: 5, colors: [COLORS.preto, COLORS.marinho],
    sizes: PLUS, images: [studio[2], editorial[7]],
    category: "plus", isPlus: true, isNew: true,
    description: "Calça Plus de alfaiataria com cintura alta e caimento alongador.",
    composition: "62% Viscose · 35% Poliéster · 3% Elastano",
    care: "Lavar à mão.",
  },
  {
    id: "p12", slug: "conjunto-plus-blazer-calca", name: "Conjunto Plus Blazer e Calça",
    price: 819, installments: 5, colors: [COLORS.vinho, COLORS.preto],
    sizes: PLUS, images: [editorial[8], studio[1]],
    category: "plus", isPlus: true, isNew: true,
    description: "Conjunto Plus coordenado em alfaiataria contemporânea.",
    composition: "70% Poliéster · 28% Viscose · 2% Elastano",
    care: "Lavar a seco.",
  },
  {
    id: "p13", slug: "vestido-longo-fluido", name: "Vestido Longo Fluido",
    price: 379, installments: 5, colors: [COLORS.verde, COLORS.preto],
    sizes: STD, images: [editorial[4], editorial[2]],
    category: "vestidos", isPlus: false, isNew: false,
    description: "Vestido longo de tecido fluido, perfeito para ocasiões especiais.",
    composition: "100% Viscose", care: "Lavar a seco.",
  },
  {
    id: "p14", slug: "regata-alfaiataria-essencial", name: "Regata Alfaiataria Essencial",
    price: 169, installments: 5, colors: [COLORS.preto, COLORS.off],
    sizes: STD, images: [editorial[11], editorial[6]],
    category: "blusas", isPlus: false, isNew: false,
    description: "Regata em malha canelada premium — um básico atemporal.",
    composition: "92% Viscose · 8% Elastano", care: "Lavar à mão.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByCategory = (c: Product["category"]) => products.filter((p) => p.category === c);
export const getPlus = () => products.filter((p) => p.isPlus);
export const getNew = () => products.filter((p) => p.isNew);

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
