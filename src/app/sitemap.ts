import { base } from 'framer-motion/client'
import { MetadataRoute } from 'next'
import { posts } from '@/app/data/posts' // Adjust path based on your folder structure
import { services } from '@/app/data/services'
import { projects } from '@/app/data/projects'
import { countries } from '@/app/data/countries'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https:/twt.co.tz'

  // Map through your JSON file to create sitemap entries
  const blogEntries = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    // If your JSON has an 'updatedAt' or 'date' field, use it. 
    // Otherwise, use the current date.
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const serviceEntries = services.map((service: any) => ({
    url: `${baseUrl}/our-services/${service.slug}`,
    lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const projectEntries = projects.map((project: any) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const countryEntries = countries.map((country: any) => ({
    url: `${baseUrl}/operations/${country.slug}`,
    lastModified: country.updatedAt ? new Date(country.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));


  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
        url: `${baseUrl}/our-services`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    },
    {
        url:`${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url: `${baseUrl}/schedule-consultation`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }
    ,
    {
        url:`${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url:`${baseUrl}/careers`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    },
    {
        url:`${baseUrl}/help-center`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url:`${baseUrl}/operations`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    },
    {
        url:`${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    },
    {
        url:`${baseUrl}/reviews`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    },
    {
        url:`${baseUrl}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    },
     ...blogEntries,
  ]
}