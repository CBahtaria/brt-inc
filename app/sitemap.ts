import { MetadataRoute } from 'next'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const BASE = 'https://brtinc.dev'

function getWritingRoutes(): MetadataRoute.Sitemap {
  const contentDir = join(process.cwd(), 'content')
  const routes: MetadataRoute.Sitemap = []
  try {
    const categories = readdirSync(contentDir)
    for (const cat of categories) {
      const catPath = join(contentDir, cat)
      if (!statSync(catPath).isDirectory()) continue
      const files = readdirSync(catPath).filter(f => f.endsWith('.mdx'))
      for (const file of files) {
        const slug = file.replace(/\.mdx$/, '')
        routes.push({
          url: `${BASE}/writing/${cat}/${slug}`,
          lastModified: statSync(join(catPath, file)).mtime,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }
  } catch {
    // content dir missing or unreadable — skip
  }
  return routes
}

export default function sitemap(): MetadataRoute.Sitemap {
  const marketplaceCategories = [
    'defence-security',
    'agricultural-intelligence',
    'infrastructure-energy',
    'civic-government',
    'autonomous-aerial',
    'healthcare-biomedical',
  ]

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...marketplaceCategories.map(cat => ({
      url: `${BASE}/marketplace/categories/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    {
      url: `${BASE}/marketplace/suppliers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/marketplace/rfq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE}/ecosystem`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/writing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    ...getWritingRoutes(),
    {
      url: `${BASE}/trust`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
