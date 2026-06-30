import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('home, catálogo e produto são navegáveis e acessíveis', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /built for the streets/i })).toBeVisible();
  await page.getByRole('link', { name: /ver tudo/i }).click();
  await expect(page).toHaveURL(/\/loja$/);
  await expect(page.getByRole('heading', { name: 'Loja' })).toBeVisible();
  await page
    .getByRole('link', { name: /offzy essential jogger black/i })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: /offzy essential jogger black/i })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});

test('fluxo de carrinho e checkout demo cria pedido', async ({ page }) => {
  await page.goto('/produto/essential-jogger-black');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: /adicionar ao carrinho/i }).click();
  await expect(page.locator('.sf-feedback')).toContainText(/adicionada ao carrinho/i);
  await page.goto('/carrinho');
  await expect(page.getByRole('heading', { name: /1 peça/i })).toBeVisible();
  await page.getByRole('link', { name: /continuar para checkout/i }).click();
  await expect(page.getByRole('heading', { name: /finalizar pedido/i })).toBeVisible();
  await page.getByRole('button', { name: /concluir demonstração/i }).click();
  await expect(page.getByRole('heading', { name: /pedido criado/i })).toBeVisible();
  await page.getByRole('link', { name: /acompanhar pedido/i }).click();
  await expect(page.getByRole('heading', { name: /^OFF-/i })).toBeVisible();
});

test('favoritos persistem após recarregar', async ({ page }) => {
  await page.goto('/loja');
  await page.getByRole('button', { name: /favoritar offzy essential jogger black/i }).click();
  await page.reload();
  await page.goto('/favoritos');
  await expect(page.getByRole('heading', { name: /offzy essential jogger black/i })).toBeVisible();
});

test('não existe overflow horizontal no viewport atual', async ({ page }) => {
  for (const path of ['/', '/loja', '/produto/essential-jogger-black', '/checkout', '/admin']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow, `overflow em ${path}`).toBe(false);
  }
});

test('home permanece responsiva nos viewports de aceite', async ({ page }) => {
  for (const width of [360, 390, 430, 768, 1024, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto('/');
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      heading: document.querySelector('h1')?.textContent?.trim(),
    }));
    expect(metrics.overflow, `overflow na home em ${width}px`).toBe(false);
    expect(metrics.heading).toContain('Built for the streets.');
  }
});

test('catálogo usa os quinze assets reais sem imagens quebradas', async ({ page }) => {
  await page.goto('/loja');
  await expect(page.locator('.sf-product-card')).toHaveCount(15);
  const invalidImages = await page
    .locator('.sf-product-card img')
    .evaluateAll((images) =>
      images
        .filter((image) => !(image instanceof HTMLImageElement) || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
    );
  expect(invalidImages).toEqual([]);
});

test('rotas principais não geram erros de console ou execução', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  for (const path of ['/', '/loja', '/manifesto', '/produto/varsity-jacket-black-gold']) {
    await page.goto(path);
  }

  expect(errors).toEqual([]);
});
