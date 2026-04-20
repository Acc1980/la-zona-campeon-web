import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://lazonacampeon.com';
  return [
    { url: base,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${base}/productos`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/gratis`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/quiz`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/frases`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/personalizado`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/links`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
