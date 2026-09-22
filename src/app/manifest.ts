import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مرسى | Marsa — من الطلب إلى المرسى',
    short_name: 'Marsa مرسى',
    description: 'منصة B2B لإدارة صفقات التوريد والاستيراد من مصانع مصر والصين من الطلب حتى الوصول إلى مخزنك',
    start_url: '/ar',
    display: 'standalone',
    background_color: '#F3F7F6',
    theme_color: '#0F4C5C',
    dir: 'rtl',
    lang: 'ar',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
