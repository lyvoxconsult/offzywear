import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/domain/**/*.ts', 'src/infrastructure/demo/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', 'src/infrastructure/demo/storage/schema.ts'],
      thresholds: {
        statements: 65,
        branches: 65,
        functions: 60,
        lines: 70,
      },
    },
  },
});
