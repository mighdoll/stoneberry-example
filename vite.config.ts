import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // minify: false, // (for debugging bundle size)
    target: "es2022"
  }
})
