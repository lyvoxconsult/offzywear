import type { ClothingSize, Product, ProductVariant } from '../../domain/catalog/entities';
import type { DemoDatabase } from '../../infrastructure/demo/storage/schema';

const seedDate = '2026-06-30T12:00:00.000Z';
const apparelSizes: ClothingSize[] = ['P', 'M', 'G', 'GG'];

function buildVariants(input: {
  productId: string;
  sku: string;
  sizes: ClothingSize[];
  colorName: string;
  colorHex: string;
}): ProductVariant[] {
  return input.sizes.map((size, index) => ({
    id: `${input.productId}-${size.toLowerCase()}`,
    productId: input.productId,
    colorName: input.colorName,
    colorHex: input.colorHex,
    size,
    sku: `${input.sku}-${size}`,
    stock: 4 + ((index * 3) % 8),
    enabled: true,
  }));
}

interface ProductSeed {
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  priceInCents: number;
  salePriceInCents?: number;
  image: string;
  alt: string;
  tags: string[];
  materials: string[];
  fit: string;
  sizes?: ClothingSize[];
  colorName?: string;
  colorHex?: string;
  featured?: boolean;
}

function buildProduct(input: ProductSeed): Product {
  const id = `product-${input.slug}`;
  return {
    id,
    slug: input.slug,
    sku: input.sku,
    name: input.name,
    shortDescription: input.shortDescription,
    description: input.description,
    categoryId: input.categoryId,
    collectionIds: ['collection-drop-mmxxvi'],
    tags: input.tags,
    materials: input.materials,
    fit: input.fit,
    careInstructions: [
      'Lavar do avesso e com cores similares.',
      'Não usar alvejante; secar à sombra.',
      'Especificações demonstrativas sujeitas à validação da marca.',
    ],
    basePriceInCents: input.priceInCents,
    ...(input.salePriceInCents ? { salePriceInCents: input.salePriceInCents } : {}),
    commercialValidationStatus: 'pending',
    status: 'active-demo',
    images: [
      {
        id: `${id}-image-1`,
        src: input.image,
        alt: input.alt,
        width: 1254,
        height: 1254,
        sortOrder: 0,
        contentApproved: true,
        kind: 'product',
      },
    ],
    variants: buildVariants({
      productId: id,
      sku: input.sku,
      sizes: input.sizes ?? apparelSizes,
      colorName: input.colorName ?? 'Preto',
      colorHex: input.colorHex ?? '#111111',
    }),
    featured: input.featured ?? false,
    createdAt: seedDate,
    updatedAt: seedDate,
  };
}

const products: Product[] = [
  buildProduct({
    slug: 'essential-jogger-black',
    sku: 'OFF-CAL-001',
    name: 'OFFZY Essential Jogger Black',
    shortDescription: 'Jogger urbana com presença gráfica e ajuste confortável.',
    description:
      'Calça jogger preta de estética esportiva, criada para composições urbanas de alto contraste.',
    categoryId: 'category-calcas',
    priceInCents: 28990,
    salePriceInCents: 24990,
    image: '/assets/products/offzy-jogger-black.webp',
    alt: 'Calça jogger preta OFFZY com estampas branca e dourada',
    tags: ['Mais vendido', 'Essential', 'Street'],
    materials: ['Composição demonstrativa: algodão e poliéster'],
    fit: 'Modelagem jogger regular com punhos canelados',
    featured: true,
  }),
  buildProduct({
    slug: 'oversized-tee-white',
    sku: 'OFF-CAM-001',
    name: 'OFFZY Oversized Tee White',
    shortDescription: 'Camiseta oversized branca com assinatura OFFZY.',
    description:
      'Base branca, shape amplo e identidade preta e dourada para uma peça essencial do drop.',
    categoryId: 'category-camisetas',
    priceInCents: 16990,
    salePriceInCents: 14990,
    image: '/assets/products/offzy-oversized-tee-white.webp',
    alt: 'Camiseta oversized branca OFFZY com logotipo preto e dourado',
    tags: ['Novo drop', 'Essential', 'Premium'],
    materials: ['Composição demonstrativa: algodão de gramatura premium'],
    fit: 'Modelagem oversized com ombros deslocados',
    colorName: 'Branco',
    colorHex: '#F4F4F2',
    featured: true,
  }),
  buildProduct({
    slug: 'urban-bucket-hat-black',
    sku: 'OFF-BON-002',
    name: 'OFFZY Urban Bucket Hat Black',
    shortDescription: 'Bucket hat preto com bordado OFFZY em alto contraste.',
    description: 'Acessório urbano de aba integral com aplicação bordada branca e dourada.',
    categoryId: 'category-bones',
    priceInCents: 12990,
    image: '/assets/products/offzy-bucket-hat-black.webp',
    alt: 'Bucket hat preto OFFZY com bordado branco e dourado',
    tags: ['Street', 'Essential'],
    materials: ['Composição demonstrativa: sarja de algodão'],
    fit: 'Tamanho único demonstrativo',
    sizes: ['U'],
  }),
  buildProduct({
    slug: 'signature-belt-black',
    sku: 'OFF-ACE-001',
    name: 'OFFZY Signature Belt Black',
    shortDescription: 'Cinto preto com fivela automática e símbolo dourado.',
    description: 'Cinto de acabamento minimalista com ferragens pretas e detalhe OFFZY dourado.',
    categoryId: 'category-acessorios',
    priceInCents: 14990,
    image: '/assets/products/offzy-belt-black.webp',
    alt: 'Cinto preto OFFZY com fivela preta e símbolo dourado',
    tags: ['Premium', 'Essential'],
    materials: ['Material sintético premium demonstrativo'],
    fit: 'Ajuste automático; tamanho único demonstrativo',
    sizes: ['U'],
  }),
  buildProduct({
    slug: 'classic-polo-black',
    sku: 'OFF-CAM-002',
    name: 'OFFZY Classic Polo Black',
    shortDescription: 'Polo preta limpa, precisa e pronta para qualquer rota.',
    description: 'Polo de visual minimalista com assinatura discreta no peito e símbolo na manga.',
    categoryId: 'category-camisetas',
    priceInCents: 22990,
    image: '/assets/products/offzy-polo-black.webp',
    alt: 'Camisa polo preta OFFZY com logotipo no peito',
    tags: ['Premium', 'Essential'],
    materials: ['Composição demonstrativa: malha piquet de algodão'],
    fit: 'Modelagem regular',
  }),
  buildProduct({
    slug: 'utility-backpack-black',
    sku: 'OFF-BOL-001',
    name: 'OFFZY Utility Backpack Black',
    shortDescription: 'Mochila utilitária com múltiplos compartimentos.',
    description:
      'Mochila preta estruturada para rotina urbana, com organização funcional e grafismos OFFZY.',
    categoryId: 'category-bolsas',
    priceInCents: 32990,
    image: '/assets/products/offzy-backpack-black.webp',
    alt: 'Mochila preta OFFZY com compartimentos frontais',
    tags: ['Mais vendido', 'Utility', 'Premium'],
    materials: ['Composição demonstrativa: poliéster resistente'],
    fit: 'Alças reguláveis; tamanho único',
    sizes: ['U'],
    featured: true,
  }),
  buildProduct({
    slug: 'sport-duffle-bag-black',
    sku: 'OFF-BOL-002',
    name: 'OFFZY Sport Duffle Bag Black',
    shortDescription: 'Mala esportiva para treino, viagem e movimento.',
    description: 'Duffle bag preta com alças de mão e tiracolo, volume amplo e identidade OFFZY.',
    categoryId: 'category-bolsas',
    priceInCents: 27990,
    image: '/assets/products/offzy-duffle-bag-black.webp',
    alt: 'Mala esportiva preta OFFZY com alça de ombro',
    tags: ['Utility', 'Street'],
    materials: ['Composição demonstrativa: poliéster resistente'],
    fit: 'Alça removível e regulável; tamanho único',
    sizes: ['U'],
  }),
  buildProduct({
    slug: 'street-slide-black',
    sku: 'OFF-CALC-002',
    name: 'OFFZY Street Slide Black',
    shortDescription: 'Slide preto com identidade branca e dourada.',
    description:
      'Chinelo slide de base anatômica e visual monocromático para o pós-treino e a rua.',
    categoryId: 'category-calcados',
    priceInCents: 14990,
    image: '/assets/products/offzy-slide-black.webp',
    alt: 'Par de chinelos slide pretos OFFZY',
    tags: ['Street', 'Essential'],
    materials: ['Composição demonstrativa: EVA e material sintético'],
    fit: 'Numeração demonstrativa do 36 ao 44',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
  }),
  buildProduct({
    slug: 'bomber-jacket-black',
    sku: 'OFF-JAQ-001',
    name: 'OFFZY Bomber Jacket Black',
    shortDescription: 'Bomber preta com construção limpa e assinatura OFFZY.',
    description:
      'Jaqueta bomber preta com acabamento fosco, punhos canelados e marca aplicada de forma precisa.',
    categoryId: 'category-jaquetas',
    priceInCents: 44990,
    salePriceInCents: 39990,
    image: '/assets/products/offzy-bomber-black.webp',
    alt: 'Jaqueta bomber preta OFFZY com zíper frontal',
    tags: ['Novo drop', 'Premium'],
    materials: ['Composição demonstrativa: tecido tecnológico e forro leve'],
    fit: 'Modelagem bomber regular',
    featured: true,
  }),
  buildProduct({
    slug: 'varsity-jacket-black-gold',
    sku: 'OFF-JAQ-002',
    name: 'OFFZY Varsity Jacket Black Gold',
    shortDescription: 'Varsity preta com acabamentos dourados de edição limitada.',
    description:
      'Peça statement do Drop MMXXVI, com gola, punhos e botões marcados por detalhes dourados.',
    categoryId: 'category-jaquetas',
    priceInCents: 59990,
    image: '/assets/products/offzy-varsity-black-gold.webp',
    alt: 'Jaqueta varsity preta OFFZY com detalhes dourados',
    tags: ['Edição limitada', 'Premium', 'Novo drop'],
    materials: ['Composição demonstrativa: lã sintética e acabamento canelado'],
    fit: 'Modelagem varsity ampla',
    featured: true,
  }),
  buildProduct({
    slug: 'long-sleeve-black',
    sku: 'OFF-MOL-001',
    name: 'OFFZY Long Sleeve Black',
    shortDescription: 'Manga longa preta com gráfico frontal de presença.',
    description:
      'Peça de meia-estação com assinatura frontal, símbolo na manga e etiqueta aplicada.',
    categoryId: 'category-moletons',
    priceInCents: 23990,
    image: '/assets/products/offzy-long-sleeve-black.webp',
    alt: 'Camiseta manga longa preta OFFZY com logotipo frontal',
    tags: ['Novo drop', 'Street'],
    materials: ['Composição demonstrativa: algodão de gramatura média'],
    fit: 'Modelagem regular levemente ampla',
  }),
  buildProduct({
    slug: 'court-sneaker-black-white-gold',
    sku: 'OFF-CALC-001',
    name: 'OFFZY Court Sneaker Black/White',
    shortDescription: 'Tênis court preto e branco com pontos dourados.',
    description:
      'Silhueta baixa inspirada nas quadras, construída em contraste preto, branco e dourado.',
    categoryId: 'category-calcados',
    priceInCents: 44990,
    image: '/assets/products/offzy-sneaker-black-white-gold.webp',
    alt: 'Par de tênis OFFZY preto, branco e dourado',
    tags: ['Mais vendido', 'Premium', 'Street'],
    materials: ['Composição demonstrativa: material sintético e solado de borracha'],
    fit: 'Numeração demonstrativa do 36 ao 44',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
    colorName: 'Preto/Branco',
    colorHex: '#E9E7E0',
    featured: true,
  }),
  buildProduct({
    slug: 'shoulder-bag-black',
    sku: 'OFF-BOL-003',
    name: 'OFFZY Shoulder Bag Black',
    shortDescription: 'Shoulder bag compacta para carregar o essencial.',
    description: 'Bolsa transversal preta com compartimentos rápidos e alça regulável.',
    categoryId: 'category-bolsas',
    priceInCents: 18990,
    image: '/assets/products/offzy-shoulder-bag-black.webp',
    alt: 'Shoulder bag preta OFFZY com alça regulável',
    tags: ['Best seller', 'Utility'],
    materials: ['Composição demonstrativa: nylon resistente'],
    fit: 'Alça regulável; tamanho único',
    sizes: ['U'],
  }),
  buildProduct({
    slug: 'crew-socks-black',
    sku: 'OFF-ACE-002',
    name: 'OFFZY Crew Socks Black',
    shortDescription: 'Meias pretas de cano médio com assinatura bordada.',
    description: 'Par de meias urbanas com reforço no calcanhar e identidade OFFZY no cano.',
    categoryId: 'category-acessorios',
    priceInCents: 5990,
    image: '/assets/products/offzy-socks-black.webp',
    alt: 'Par de meias pretas OFFZY com bordado branco e dourado',
    tags: ['Essential', 'Últimas unidades'],
    materials: ['Composição demonstrativa: algodão, poliamida e elastano'],
    fit: 'Tamanho único demonstrativo',
    sizes: ['U'],
  }),
  buildProduct({
    slug: 'cap-black',
    sku: 'OFF-BON-001',
    name: 'OFFZY Cap Black',
    shortDescription: 'Boné preto estruturado com bordado frontal OFFZY.',
    description:
      'Boné de seis painéis, aba curva e aplicações bordadas para finalizar o uniforme urbano.',
    categoryId: 'category-bones',
    priceInCents: 11990,
    image: '/assets/products/offzy-cap-black.webp',
    alt: 'Boné preto OFFZY com bordado branco',
    tags: ['Mais vendido', 'Essential'],
    materials: ['Composição demonstrativa: sarja de algodão'],
    fit: 'Fecho regulável; tamanho único',
    sizes: ['U'],
  }),
];

export const offzySeed: DemoDatabase = {
  seedRevision: 2,
  categories: (
    [
      ['camisetas', 'Camisetas', 'Camisetas urbanas com construção premium.'],
      ['moletons', 'Moletons', 'Camadas para movimento e presença.'],
      ['jaquetas', 'Jaquetas', 'Peças externas que definem o drop.'],
      ['calcas', 'Calças', 'Shapes funcionais para a rua.'],
      ['bones', 'Bonés', 'Acessórios de cabeça com assinatura OFFZY.'],
      ['acessorios', 'Acessórios', 'Detalhes essenciais para completar a identidade.'],
      ['bolsas', 'Bolsas', 'Utilitários para acompanhar cada rota.'],
      ['calcados', 'Tênis', 'Calçados com contraste e presença.'],
    ] as Array<[string, string, string]>
  ).map(([slug, name, description]) => ({
    id: `category-${slug}`,
    slug,
    name,
    description,
    active: true,
  })),
  collections: [
    {
      id: 'collection-drop-mmxxvi',
      slug: 'drop-mmxxvi',
      name: 'Drop MMXXVI',
      description: 'Peças urbanas criadas para quem carrega identidade em cada detalhe.',
      active: true,
    },
  ],
  products,
  coupons: [
    {
      id: 'coupon-demo10',
      code: 'DEMO10',
      description: 'Cupom demonstrativo de 10%.',
      type: 'percentage',
      value: 10,
      minimumInCents: 10000,
      startsAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2030-12-31T23:59:59.999Z',
      enabled: true,
      commercialValidationStatus: 'pending',
    },
  ],
  cart: [],
  favoriteProductIds: [],
  orders: [],
  customerProfile: {
    id: 'customer-demo',
    name: 'Cliente demonstração',
    email: 'cliente.demo@example.invalid',
    phone: '(00) 00000-0000',
    demoData: true,
  },
  addresses: [
    {
      id: 'address-demo',
      label: 'Endereço demonstrativo',
      recipientName: 'Cliente demonstração',
      postalCode: '00000-000',
      street: 'Endereço não informado',
      number: 'S/N',
      neighborhood: 'Bairro não informado',
      city: 'Cidade de demonstração',
      state: 'SP',
      isDefault: true,
      demoData: true,
    },
  ],
  shippingOptions: [
    {
      id: 'shipping-standard-demo',
      name: 'Envio padrão simulado',
      priceInCents: 2490,
      estimatedMinDays: 5,
      estimatedMaxDays: 9,
      simulation: true,
    },
  ],
  homeContent: {
    heroEyebrow: 'Drop MMXXVI · Made in Brazil',
    heroTitle: 'Built for the streets.',
    heroBody:
      'Streetwear premium com identidade forte, acabamento preciso e presença feita para se destacar.',
    primaryCallToAction: 'Ver coleção',
    manifesto:
      'OFFZY Wear é mais que roupa. É identidade, atitude e autenticidade para quem vive o próprio caminho.',
  },
  settings: {
    storeName: 'OFFZY Wear',
    currency: 'BRL',
    freeShippingThresholdInCents: 39900,
    defaultShippingInCents: 2490,
    demoMode: true,
    announcement: 'Frete grátis demonstrativo acima de R$ 399 · 3x sem juros',
  },
};
