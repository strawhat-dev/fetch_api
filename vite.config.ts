import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [tsconfigPaths({ root })],
  esbuild: { platform: 'neutral', target: 'es2021', format: 'esm', treeShaking: true },
  build: {
    outDir: 'dist',
    target: 'esnext',
    emptyOutDir: false,
    lib: { entry: resolve(root, 'src/fetched-api.ts'), formats: ['es'] },
  },
});
