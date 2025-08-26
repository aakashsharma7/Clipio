export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Clipio",
    "url": "https://clipio.app",
    "logo": "https://clipio.app/logo.png",
    "description": "AI-powered design asset management platform for creative teams",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/clipio_app",
      "https://linkedin.com/company/clipio",
      "https://github.com/clipio"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@clipio.app"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Clipio",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "description": "AI-powered design asset management platform with smart tagging, team collaboration, and seamless integrations",
    "url": "https://clipio.app",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier available"
    },
    "featureList": [
      "AI-powered asset tagging",
      "Smart search and filtering",
      "Team collaboration",
      "Figma integration",
      "Adobe integration",
      "Drag-and-drop organization",
      "Real-time sharing",
      "Version control"
    ]
  }

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Clipio",
    "url": "https://clipio.app",
    "description": "AI-powered design asset management platform",
    "publisher": {
      "@type": "Organization",
      "name": "Clipio"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://clipio.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema)
        }}
      />
    </>
  )
}
