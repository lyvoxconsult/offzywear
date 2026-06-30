export const productStatuses = ['draft', 'active-demo', 'active', 'sold-out'] as const;
export type ProductStatus = (typeof productStatuses)[number];

export const commercialValidationStatuses = ['pending', 'approved'] as const;
export type CommercialValidationStatus = (typeof commercialValidationStatuses)[number];

export const clothingSizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'U'] as const;
export type ClothingSize = (typeof clothingSizes)[number];

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sortOrder: number;
  contentApproved: boolean;
  kind: 'product' | 'editorial' | 'placeholder';
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  size: ClothingSize;
  sku: string;
  stock: number;
  enabled: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  collectionIds: string[];
  tags: string[];
  materials: string[];
  fit: string;
  careInstructions: string[];
  basePriceInCents: number;
  salePriceInCents?: number;
  commercialValidationStatus: CommercialValidationStatus;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  currency: 'BRL';
  freeShippingThresholdInCents: number;
  defaultShippingInCents: number;
  demoMode: true;
  announcement: string;
}

export interface HomeContent {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  primaryCallToAction: string;
  manifesto: string;
}

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
  demoData: true;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  demoData: true;
}

export interface ShippingOption {
  id: string;
  name: string;
  priceInCents: number;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  simulation: true;
}
