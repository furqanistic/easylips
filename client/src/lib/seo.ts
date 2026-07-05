import { useEffect } from 'react'

export interface SeoOptions {
  title: string
  description: string
  canonical?: string
  ogType?: string
  ogImage?: string
  noIndex?: boolean
  jsonLd?: object[]
}

/**
 * Per-route SEO for the SPA: sets title/meta/OG/Twitter/canonical and injects
 * JSON-LD structured data on mount, restoring prior values on unmount so
 * navigating back to the homepage meta is clean.
 */
export function useSeo({ title, description, canonical, ogType = 'website', ogImage, noIndex, jsonLd }: SeoOptions) {
  const ldKey = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const prev = {
      title: document.title,
      description: contentOf('name', 'description'),
      ogTitle: contentOf('property', 'og:title'),
      ogDescription: contentOf('property', 'og:description'),
      ogType: contentOf('property', 'og:type'),
      ogUrl: contentOf('property', 'og:url'),
      ogImage: contentOf('property', 'og:image'),
      twTitle: contentOf('name', 'twitter:title'),
      twDescription: contentOf('name', 'twitter:description'),
      twImage: contentOf('name', 'twitter:image'),
      canonical: linkHref('canonical'),
      robots: contentOf('name', 'robots'),
    }

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', ogType)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : (prev.robots || 'index, follow, max-image-preview:large'))
    if (canonical) {
      setMeta('property', 'og:url', canonical)
      setLink('canonical', canonical)
    }
    if (ogImage) {
      setMeta('property', 'og:image', ogImage)
      setMeta('name', 'twitter:image', ogImage)
    }

    const ldNodes: HTMLScriptElement[] = []
    if (ldKey) {
      for (const obj of jsonLd!) {
        const s = document.createElement('script')
        s.type = 'application/ld+json'
        s.setAttribute('data-seo-injected', 'true')
        s.text = JSON.stringify(obj)
        document.head.appendChild(s)
        ldNodes.push(s)
      }
    }

    return () => {
      document.title = prev.title
      setMeta('name', 'description', prev.description)
      setMeta('property', 'og:title', prev.ogTitle)
      setMeta('property', 'og:description', prev.ogDescription)
      setMeta('property', 'og:type', prev.ogType)
      setMeta('property', 'og:url', prev.ogUrl)
      setMeta('property', 'og:image', prev.ogImage)
      setMeta('name', 'twitter:title', prev.twTitle)
      setMeta('name', 'twitter:description', prev.twDescription)
      setMeta('name', 'twitter:image', prev.twImage)
      setMeta('name', 'robots', prev.robots)
      setLink('canonical', prev.canonical)
      ldNodes.forEach((n) => n.remove())
    }
  }, [title, description, canonical, ogType, ogImage, noIndex, ldKey])
}

function contentOf(attr: 'name' | 'property', key: string): string {
  return document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.getAttribute('content') ?? ''
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function linkHref(rel: string): string {
  return document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)?.getAttribute('href') ?? ''
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
