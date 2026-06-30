import { z } from 'zod';
import {
  clothingSizes,
  commercialValidationStatuses,
  productStatuses,
} from '../../../domain/catalog/entities';

const isoDateSchema = z.string().datetime({ offset: true });
const moneySchema = z.number().int().nonnegative();

const productImageSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  sortOrder: z.number().int().nonnegative(),
  contentApproved: z.boolean(),
  kind: z.enum(['product', 'editorial', 'placeholder']),
});

const productVariantSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  colorName: z.string().min(1),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  size: z.enum(clothingSizes),
  sku: z.string().min(1),
  stock: z.number().int().nonnegative(),
  enabled: z.boolean(),
});

const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string(),
  description: z.string(),
  categoryId: z.string().min(1),
  collectionIds: z.array(z.string()),
  tags: z.array(z.string()),
  materials: z.array(z.string()),
  fit: z.string(),
  careInstructions: z.array(z.string()),
  basePriceInCents: moneySchema,
  salePriceInCents: moneySchema.optional(),
  commercialValidationStatus: z.enum(commercialValidationStatuses),
  status: z.enum(productStatuses),
  images: z.array(productImageSchema),
  variants: z.array(productVariantSchema),
  featured: z.boolean(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

const couponSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  description: z.string(),
  type: z.enum(['percentage', 'fixed', 'free-shipping']),
  value: z.number().nonnegative(),
  minimumInCents: moneySchema,
  startsAt: isoDateSchema,
  expiresAt: isoDateSchema,
  enabled: z.boolean(),
  commercialValidationStatus: z.enum(commercialValidationStatuses),
});

const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().positive(),
  addedAt: isoDateSchema,
});

const priceSummarySchema = z.object({
  subtotalInCents: moneySchema,
  discountInCents: moneySchema,
  shippingInCents: moneySchema,
  totalInCents: moneySchema,
  appliedCouponCode: z.string().optional(),
});

const orderItemSnapshotSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  productName: z.string(),
  slug: z.string(),
  sku: z.string(),
  colorName: z.string(),
  size: z.string(),
  imageUrl: z.string(),
  unitPriceInCents: moneySchema,
  quantity: z.number().int().positive(),
  subtotalInCents: moneySchema,
});

const customerProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  demoData: z.literal(true),
});

const addressSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  recipientName: z.string().min(1),
  postalCode: z.string().min(1),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  isDefault: z.boolean(),
  demoData: z.literal(true),
});

const addressSnapshotSchema = addressSchema.omit({ isDefault: true });

const shippingOptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  priceInCents: moneySchema,
  estimatedMinDays: z.number().int().nonnegative(),
  estimatedMaxDays: z.number().int().nonnegative(),
  simulation: z.literal(true),
});

const orderStatusSchema = z.enum(['created', 'confirmed', 'preparing', 'shipped', 'delivered']);

const orderStatusEventSchema = z.object({
  status: orderStatusSchema,
  occurredAt: isoDateSchema,
  label: z.string().min(1),
});

const orderSchema = z.object({
  id: z.string().min(1),
  publicCode: z.string().min(1),
  items: z.array(orderItemSnapshotSchema).min(1),
  totals: priceSummarySchema,
  customerSnapshot: customerProfileSchema.omit({ demoData: true }),
  deliveryAddressSnapshot: addressSnapshotSchema,
  shippingSnapshot: shippingOptionSchema,
  paymentMethod: z.enum(['pix-demo', 'card-demo']),
  status: orderStatusSchema,
  statusHistory: z.array(orderStatusEventSchema).min(1),
  createdAt: isoDateSchema,
});

const demoDatabaseObjectSchema = z.object({
  seedRevision: z.number().int().positive(),
  categories: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      description: z.string(),
      active: z.boolean(),
    }),
  ),
  collections: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      description: z.string(),
      active: z.boolean(),
    }),
  ),
  products: z.array(productSchema),
  coupons: z.array(couponSchema),
  cart: z.array(cartItemSchema),
  favoriteProductIds: z.array(z.string()),
  orders: z.array(orderSchema),
  customerProfile: customerProfileSchema,
  addresses: z.array(addressSchema),
  shippingOptions: z.array(shippingOptionSchema),
  homeContent: z.object({
    heroEyebrow: z.string(),
    heroTitle: z.string(),
    heroBody: z.string(),
    primaryCallToAction: z.string(),
    manifesto: z.string(),
  }),
  settings: z.object({
    storeName: z.string(),
    currency: z.literal('BRL'),
    freeShippingThresholdInCents: moneySchema,
    defaultShippingInCents: moneySchema,
    demoMode: z.literal(true),
    announcement: z.string(),
  }),
});

function duplicateValues(values: readonly string[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return duplicates;
}

export const demoDatabaseSchema = demoDatabaseObjectSchema.superRefine((data, context) => {
  const requireUnique = (values: readonly string[], label: string, path: PropertyKey[]) => {
    for (const duplicate of duplicateValues(values)) {
      context.addIssue({
        code: 'custom',
        message: `${label} duplicado: ${duplicate}`,
        path,
      });
    }
  };

  requireUnique(
    data.categories.map((item) => item.id),
    'ID de categoria',
    ['categories'],
  );
  requireUnique(
    data.categories.map((item) => item.slug),
    'Slug de categoria',
    ['categories'],
  );
  requireUnique(
    data.collections.map((item) => item.id),
    'ID de coleção',
    ['collections'],
  );
  requireUnique(
    data.collections.map((item) => item.slug),
    'Slug de coleção',
    ['collections'],
  );
  requireUnique(
    data.products.map((item) => item.id),
    'ID de produto',
    ['products'],
  );
  requireUnique(
    data.products.map((item) => item.slug),
    'Slug de produto',
    ['products'],
  );
  requireUnique(
    data.products.map((item) => item.sku),
    'SKU de produto',
    ['products'],
  );
  requireUnique(
    data.products.flatMap((product) => product.variants.map((variant) => variant.id)),
    'ID de variante',
    ['products'],
  );
  requireUnique(
    data.products.flatMap((product) => product.variants.map((variant) => variant.sku)),
    'SKU de variante',
    ['products'],
  );
  requireUnique(
    data.coupons.map((item) => item.code.toUpperCase()),
    'Código de cupom',
    ['coupons'],
  );
  requireUnique(
    data.cart.map((item) => `${item.productId}:${item.variantId}`),
    'Item de carrinho',
    ['cart'],
  );
  requireUnique(
    data.orders.map((item) => item.id),
    'ID de pedido',
    ['orders'],
  );
  requireUnique(
    data.orders.map((item) => item.publicCode.toUpperCase()),
    'Código público de pedido',
    ['orders'],
  );
  requireUnique(
    data.addresses.map((item) => item.id),
    'ID de endereço',
    ['addresses'],
  );
  requireUnique(
    data.shippingOptions.map((item) => item.id),
    'ID de frete',
    ['shippingOptions'],
  );

  const categoryIds = new Set(data.categories.map((item) => item.id));
  const collectionIds = new Set(data.collections.map((item) => item.id));
  const productsById = new Map(data.products.map((item) => [item.id, item]));

  data.products.forEach((product, productIndex) => {
    if (!categoryIds.has(product.categoryId)) {
      context.addIssue({
        code: 'custom',
        message: 'Produto referencia categoria inexistente.',
        path: ['products', productIndex, 'categoryId'],
      });
    }
    product.collectionIds.forEach((collectionId, collectionIndex) => {
      if (!collectionIds.has(collectionId)) {
        context.addIssue({
          code: 'custom',
          message: 'Produto referencia coleção inexistente.',
          path: ['products', productIndex, 'collectionIds', collectionIndex],
        });
      }
    });
    product.variants.forEach((variant, variantIndex) => {
      if (variant.productId !== product.id) {
        context.addIssue({
          code: 'custom',
          message: 'Variante referencia produto incorreto.',
          path: ['products', productIndex, 'variants', variantIndex, 'productId'],
        });
      }
    });
    product.images.forEach((image, imageIndex) => {
      const isBrandReference = image.src.includes('/assets/brand/');
      if (image.kind === 'placeholder' && image.contentApproved) {
        context.addIssue({
          code: 'custom',
          message: 'Placeholder não pode ser marcado como conteúdo aprovado.',
          path: ['products', productIndex, 'images', imageIndex, 'contentApproved'],
        });
      }
      if (isBrandReference && (image.kind === 'product' || image.contentApproved)) {
        context.addIssue({
          code: 'custom',
          message: 'Asset de marca não pode ser tratado como fotografia aprovada de produto.',
          path: ['products', productIndex, 'images', imageIndex],
        });
      }
    });
  });

  data.cart.forEach((item, itemIndex) => {
    const product = productsById.get(item.productId);
    const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
    if (!product || !variant || variant.productId !== product.id) {
      context.addIssue({
        code: 'custom',
        message: 'Carrinho referencia produto ou variante inexistente.',
        path: ['cart', itemIndex],
      });
    }
  });

  data.favoriteProductIds.forEach((productId, favoriteIndex) => {
    if (!productsById.has(productId)) {
      context.addIssue({
        code: 'custom',
        message: 'Favorito referencia produto inexistente.',
        path: ['favoriteProductIds', favoriteIndex],
      });
    }
  });

  if (data.addresses.filter((address) => address.isDefault).length > 1) {
    context.addIssue({
      code: 'custom',
      message: 'Apenas um endereço pode ser padrão.',
      path: ['addresses'],
    });
  }

  data.shippingOptions.forEach((option, optionIndex) => {
    if (option.estimatedMinDays > option.estimatedMaxDays) {
      context.addIssue({
        code: 'custom',
        message: 'Prazo mínimo de frete excede o prazo máximo.',
        path: ['shippingOptions', optionIndex],
      });
    }
  });

  data.orders.forEach((order, orderIndex) => {
    if (order.statusHistory.at(-1)?.status !== order.status) {
      context.addIssue({
        code: 'custom',
        message: 'Status atual deve corresponder ao último evento do pedido.',
        path: ['orders', orderIndex, 'statusHistory'],
      });
    }
  });
});

export type DemoDatabase = z.infer<typeof demoDatabaseSchema>;

export const storageEnvelopeSchema = z.object({
  schemaVersion: z.literal(2),
  revision: z.number().int().nonnegative(),
  data: demoDatabaseSchema,
});

export type StorageEnvelope = z.infer<typeof storageEnvelopeSchema>;
