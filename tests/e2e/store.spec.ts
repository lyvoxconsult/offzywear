import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('home, catálogo e produto são navegáveis e acessíveis', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /vista sua própria direção/i })).toBeVisible();
  await page.getByRole('link', { name: /ver tudo/i }).click();
  await expect(page).toHaveURL(/\/loja$/);
  await expect(page.getByRole('heading', { name: 'Loja' })).toBeVisible();
  await page
    .getByRole('link', { name: /camiseta presença/i })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: /camiseta presença/i })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
  ).toEqual([]);
});

test('fluxo de carrinho e checkout demo cria pedido', async ({ page }) => {
  await page.goto('/produto/camiseta-presenca');
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
  await page.getByRole('button', { name: /favoritar camiseta presença/i }).click();
  await page.reload();
  await page.goto('/favoritos');
  await expect(page.getByRole('heading', { name: /camiseta presença/i })).toBeVisible();
});

test('não existe overflow horizontal no viewport atual', async ({ page }) => {
  for (const path of ['/', '/loja', '/produto/camiseta-presenca', '/checkout', '/admin']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow, `overflow em ${path}`).toBe(false);
  }
});
