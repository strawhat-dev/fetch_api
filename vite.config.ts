import type { JscConfig } from '@swc/core';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from '@rollup/plugin-swc';
import dts from 'vite-plugin-dts';

const rollupTypes = process.argv.pop() === 'dts';

const root = dirname(fileURLToPath(import.meta.url));

const jsc = {
  target: 'es2022',
  preserveAllComments: true,
  minify: {
    ecma: '2022',
    module: true,
    mangle: true,
    compress: true,
    toplevel: true,
    sourceMap: true,
  },
} as const satisfies JscConfig;

export default defineConfig({
  root,
  esbuild: {
    format: 'esm',
    target: 'node18',
    platform: 'neutral',
    treeShaking: true,
  },
  build: {
    minify: false,
    outDir: 'dist',
    target: 'esnext',
    emptyOutDir: rollupTypes,
    lib: { formats: ['es'], entry: resolve(root, 'src/fetched-api.ts') },
    rollupOptions: { treeshake: true, output: { esModule: true, interop: 'esModule' } },
  },
  plugins: [
    tsconfigPaths({ root }),
    rollupTypes && dts({ root, rollupTypes }),
    swc({ swc: { root, jsc, minify: true, isModule: true } }),
  ],
});
