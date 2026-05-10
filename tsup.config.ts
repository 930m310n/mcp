import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    stdio: 'src/stdio.ts',
    http: 'src/http.ts',
  },
  format: ['cjs'],
  target: 'node18',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
});
