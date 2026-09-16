import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    outDir: 'dist-be/backend/main',
    target: 'node20',
    lib: {
      entry: 'src/backend/main/migration.ts',
      formats: ['cjs'],
      fileName: () => 'migration.cjs'
    },
    rollupOptions: {
      external: [
        'electron',
        'sqlite3',
        'pg',
        'better-sqlite3',
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`)
      ]
    },
    emptyOutDir: false,
    sourcemap: true
  },
  plugins: [tsconfigPaths()]
});
