import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/order-book/',
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})