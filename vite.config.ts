import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import terser from '@rollup/plugin-terser';
import tsconfigPaths from 'vite-tsconfig-paths';

const rollupTypes = process.argv.at(-1) === 'dts';
const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  esbuild: {
    format: 'esm',
    target: 'node18',
    platform: 'neutral',
    treeShaking: true,
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'terser',
    emptyOutDir: rollupTypes,
    lib: { entry: resolve(root, 'src/fetched-api.ts'), formats: ['es'] },
    rollupOptions: { output: { esModule: true, interop: 'esModule' }, treeshake: true },
  },
  plugins: [
    tsconfigPaths({ root }),
    rollupTypes && dts({ root, rollupTypes }),
    terser({
      ecma: 2022,
      mangle: true,
      module: true,
      toplevel: true,
      compress: true,
      format: { ecma: 2022, comments: 'all' },
    } as {}),
  ],
});
