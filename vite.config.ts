import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from '@rollup/plugin-swc';
import dts from 'vite-plugin-dts';

type SWC = typeof swc;

type Plugin = ReturnType<SWC>;

type JSC = Parameters<SWC>[0]['swc']['jsc'];

const rollupTypes = process.argv.pop() === 'dts';

const root = dirname(fileURLToPath(import.meta.url));

const jsc = {
  baseUrl: root,
  target: 'es2022',
  preserveAllComments: true,
  parser: { syntax: 'typescript' },
  transform: { useDefineForClassFields: true },
  minify: {
    ecma: '2022',
    module: true,
    mangle: true,
    compress: true,
    toplevel: true,
    sourceMap: true,
    format: { comments: 'all' },
  },
} as const satisfies JSC;

export default defineConfig({
  root,
  experimental: { skipSsrTransform: true },
  esbuild: {
    loader: 'ts',
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
    tsconfigPaths({ root }) as Plugin,
    rollupTypes && dts({ root, rollupTypes }) as Plugin,
    swc({ swc: { root, jsc, minify: true, isModule: true, module: { type: 'es6', lazy: true } } }),
  ],
});
