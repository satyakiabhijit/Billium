import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'dist-be/preload',
    target: 'node20',
    lib: {
      entry: 'src/preload/preload.ts',
      formats: ['cjs'],
      fileName: () => 'preload.cjs'
    },
    rollupOptions: {
      external: ['electron']
    },
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [tsconfigPaths()]
});
