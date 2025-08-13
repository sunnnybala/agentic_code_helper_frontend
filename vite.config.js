import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
    // This makes the env variables available in the client-side code
    define: {
      'process.env': {}
    }
  }
})
