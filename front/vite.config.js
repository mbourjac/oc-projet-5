import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        product: resolve(__dirname, 'product.html'),
        cart: resolve(__dirname, 'cart.html'),
        confirmation: resolve(__dirname, 'confirmation.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
