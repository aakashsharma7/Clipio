'use client'

import { useEffect } from 'react'

export function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preload', href: '/logo.ico', as: 'image' },
      { rel: 'preload', href: '/favicon.ico', as: 'image' },
    ]

    preloadLinks.forEach(({ rel, href, as }) => {
      const link = document.createElement('link')
      link.rel = rel
      link.href = href
      if (as) link.setAttribute('as', as)
      document.head.appendChild(link)
    })

    // Prefetch dashboard page for faster navigation
    const prefetchDashboard = () => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = '/dashboard'
      document.head.appendChild(link)
    }

    // Prefetch dashboard after page load
    const timer = setTimeout(prefetchDashboard, 2000)
    
    return () => {
      clearTimeout(timer)
      // Clean up preload links
      preloadLinks.forEach(({ href }) => {
        const existingLink = document.querySelector(`link[href="${href}"]`)
        if (existingLink) {
          existingLink.remove()
        }
      })
    }
  }, [])

  return null
}

// Image optimization component
export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  ...props 
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  [key: string]: any
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  )
}

// Font optimization
export function FontOptimizer() {
  useEffect(() => {
    // Preload critical fonts
    const fontLinks = [
      { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap', as: 'style' }
    ]

    fontLinks.forEach(({ rel, href, as }) => {
      const link = document.createElement('link')
      link.rel = rel
      link.href = href
      if (as) link.setAttribute('as', as)
      document.head.appendChild(link)
    })

    return () => {
      // Clean up font preload links
      fontLinks.forEach(({ href }) => {
        const existingLink = document.querySelector(`link[href="${href}"]`)
        if (existingLink) {
          existingLink.remove()
        }
      })
    }
  }, [])

  return null
}
