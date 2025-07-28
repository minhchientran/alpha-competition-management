import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/open/api/v2': {
                target: 'https://www.mexc.com',
                changeOrigin: true,
            },
        },
    },
}) 