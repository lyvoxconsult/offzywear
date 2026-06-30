import type { ClothingSize, Product, ProductVariant } from '../../domain/catalog/entities';
import type { DemoDatabase } from '../../infrastructure/demo/storage/schema';

const seedDate = '2026-06-30T12:00:00.000Z';
const sizes: ClothingSize[] = ['P', 'M', 'G', 'GG'];

function buildVariants(
  productId: string,
  sku: string,
  productSizes: ClothingSize[] = sizes,
): ProductVariant[] {
  return [
    { name: 'Preto', hex: '#111111', suffix: 'PT' },
    { name: 'Off-white', hex: '#F1EFE8', suffix: 'OW' },
  ].flatMap((color) =>
    productSizes.map((size, index) => ({
      id: `${productId}-${color.suffix.toLowerCase()}-${size.toLowerCase()}`,
      productId,
      colorName: color.name,
      colorHex: color.hex,
      size,
      sku: `${sku}-${color.suffix}-${size}`,
      stock: 4 + index,
      enabled: true,
    })),
  );
}

function buildProduct(input: {
  id: string;
  slug: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  priceInCents: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
  featured?: boolean;
  sizes?: ClothingSize[];
}): Product {
  return {
    id: input.id,
    slug: input.slug,
    sku: input.sku,
    name: input.name,
    shortDescription: 'Peça streetwear OFFZY para composições urbanas.',
    description: input.description,
    categoryId: input.categoryId,
    collectionIds: ['collection-direcao-propria'],
    tags: ['streetwear', 'offzy', input.featured ? 'destaque' : 'essencial'],
    materials: ['Composição pendente de aprovação do cliente'],
    fit: 'Modelagem pendente de aprovação do cliente',
    careInstructions: ['Instruções de cuidado pendentes de aprovação'],
    basePriceInCents: input.priceInCents,
    commercialValidationStatus: 'pending',
    status: 'active-demo',
    images: [
      {
        id: `${input.id}-image-1`,
        src: input.image,
        alt: `Referência visual da marca para ${input.name}`,
        width: input.imageWidth,
        height: input.imageHeight,
        sortOrder: 0,
        contentApproved: false,
        kind: 'placeholder',
      },
    ],
    variants: buildVariants(input.id, input.sku, input.sizes),
    featured: input.featured ?? false,
    createdAt: seedDate,
    updatedAt: seedDate,
  };
}

export const offzySeed: DemoDatabase = {
  seedRevision: 1,
  categories: [
    {
      id: 'category-camisetas',
      slug: 'camisetas',
      name: 'Camisetas',
      description: 'Camisetas OFFZY com identidade urbana.',
      active: true,
    },
    {
      id: 'category-moletons',
      slug: 'moletons',
      name: 'Moletons',
      description: 'Moletons para composições streetwear.',
      active: true,
    },
    {
      id: 'category-acessorios',
      slug: 'acessorios',
      name: 'Acessórios',
      description: 'Acessórios da identidade OFFZY.',
      active: true,
    },
  ],
  collections: [
    {
      id: 'collection-direcao-propria',
      slug: 'direcao-propria',
      name: 'Direção Própria',
      description: 'Uma coleção demonstrativa sobre identidade, movimento e presença.',
      active: true,
    },
  ],
  products: [
    buildProduct({
      id: 'product-camiseta-presenca',
      slug: 'camiseta-presenca',
      sku: 'OFF-CAM-001',
      name: 'Camiseta Presença',
      description: 'Conceito demonstrativo inspirado no manifesto OFFZY.',
      categoryId: 'category-camisetas',
      priceInCents: 14990,
      image: '/assets/brand/offzy-brand-board.jpeg',
      imageWidth: 1536,
      imageHeight: 1024,
      featured: true,
    }),
    buildProduct({
      id: 'product-moletom-movimento',
      slug: 'moletom-movimento',
      sku: 'OFF-MOL-001',
      name: 'Moletom Movimento',
      description: 'Conceito demonstrativo inspirado no movimento constante da marca.',
      categoryId: 'category-moletons',
      priceInCents: 28990,
      image: '/assets/brand/offzy-wordmark.jpeg',
      imageWidth: 1254,
      imageHeight: 1254,
      featured: true,
    }),
    buildProduct({
      id: 'product-bone-legado',
      slug: 'bone-legado',
      sku: 'OFF-ACE-001',
      name: 'Boné Legado',
      description: 'Conceito demonstrativo para a futura linha de acessórios.',
      categoryId: 'category-acessorios',
      priceInCents: 9990,
      image: '/assets/brand/offzy-stacked-logo.jpeg',
      imageWidth: 1254,
      imageHeight: 1254,
      sizes: ['U'],
    }),
  ],
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
    heroEyebrow: 'OFFZY Wear',
    heroTitle: 'Vista sua própria direção.',
    heroBody: 'Streetwear construído para identidade, atitude e presença.',
    primaryCallToAction: 'Explorar coleção',
    manifesto: 'OFFZY não é apenas o que você veste. É a forma como você escolhe ocupar o mundo.',
  },
  settings: {
    storeName: 'OFFZY Wear',
    currency: 'BRL',
    freeShippingThresholdInCents: 39900,
    defaultShippingInCents: 2490,
    demoMode: true,
    announcement: 'Ambiente de demonstração — nenhuma compra real será processada.',
  },
};
