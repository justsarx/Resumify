import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  base: '/', // Ensure correct base path
  server: {
    historyApiFallback: true, // Redirects to `index.html` for React Router
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': '/src',
    }
  }
})
