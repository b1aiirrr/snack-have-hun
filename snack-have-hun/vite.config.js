import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Snack Have Hun',
        short_name: 'SnackHaveHun',
        description: 'Kenyan Street Food, Elevated.',
        theme_color: '#ea580c',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/food/hero_fries.jpg', // Placeholder icon using your existing image
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
})