import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default defineConfig({
  server: isDevelopment
    ? {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
          cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt')),
        },
        port: 5174, 
      }
    : {},
});
