import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MiniFin - Smart Financial Tracker',
    short_name: 'MiniFin',
    description: 'Track your finances easily with MiniFin',
    start_url: '/',
    display: 'standalone',
    background_color: '#09122C',
    theme_color: '#BE3144',
    icons: [
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
} 