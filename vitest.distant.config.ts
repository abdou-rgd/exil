import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/distant/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    fileParallelism: false,
    setupFiles: ['tests/distant/env.ts'],
  },
});
