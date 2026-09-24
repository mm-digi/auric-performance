import { areaServed, site } from "@/lib/site";

const businessId = `${site.url}/#business`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
      "@id": businessId,
      name: site.name,
      legalName: site.name,
      url: site.url,
      email: site.email,
      image: `${site.url}/images/logo-au3.png`,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/images/logo-au3.png`,
      },
      description: site.description,
      slogan: "OUTRUN : OUTLIFT : OUTPERFORM",
      priceRange: "££",
      areaServed,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.geo.latitude,
        longitude: site.geo.longitude,
      },
      hasMap: site.mapsUrl,
      sameAs: site.sameAs,
      founder: [
        { "@id": `${site.url}/#alex-peterson` },
        { "@id": `${site.url}/#courtney-alexander` },
      ],
      employee: [
        { "@id": `${site.url}/#alex-peterson` },
        { "@id": `${site.url}/#courtney-alexander` },
      ],
      knowsAbout: [
        "1:1 personal training",
        "Physical performance coaching",
        "Online exercise programming",
        "Strength and conditioning",
        "Hybrid athlete training",
        "Exercise rehabilitation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Auric Performance coaching and programmes",
        itemListElement: [
          {
            "@type": "Offer",
            name: "1:1 personal training",
            url: `${site.url}/personal-training`,
          },
          {
            "@type": "Offer",
            name: "Physical performance coaching",
            url: `${site.url}/personal-training`,
          },
          {
            "@type": "Offer",
            name: "Online programming",
            url: `${site.url}/online-programming`,
          },
          { "@type": "Offer", name: "OUTRUN", url: `${site.url}/programmes#outrun` },
          { "@type": "Offer", name: "OUTLIFT", url: `${site.url}/programmes#outlift` },
          { "@type": "Offer", name: "OUTPERFORM", url: `${site.url}/programmes#outperform` },
          { "@type": "Offer", name: "AURIC SUB60", url: `${site.url}/programmes#auric-sub60` },
          { "@type": "Offer", name: "Auric Rehab", url: `${site.url}/programmes#auric-rehab` },
        ],
      },
    },
    {
      "@type": "Service",
      "@id": `${site.url}/#service-personal-training`,
      name: "1:1 personal training",
      serviceType: "Personal trainer",
      description:
        "1:1 personal training and physical performance coaching for clients across the southwest of the UK, based in Taunton, Somerset.",
      provider: { "@id": businessId },
      areaServed,
      url: `${site.url}/personal-training`,
    },
    {
      "@type": "Service",
      "@id": `${site.url}/#service-online-programming`,
      name: "Online programming",
      serviceType: "Online exercise programming",
      description:
        "Online hybrid training programmes, including OUTRUN, OUTLIFT, OUTPERFORM and AURIC SUB60, for clients in the southwest and across the UK.",
      provider: { "@id": businessId },
      areaServed,
      url: `${site.url}/online-programming`,
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#alex-peterson`,
      name: "Alex Peterson",
      jobTitle: "Co-founder and physical performance coach",
      worksFor: { "@id": businessId },
      image: `${site.url}/images/alex.jpg`,
      url: `${site.url}/personal-training`,
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#courtney-alexander`,
      name: "Courtney Alexander",
      jobTitle: "Co-founder and physical performance coach",
      worksFor: { "@id": businessId },
      image: `${site.url}/images/courtney.jpg`,
      url: `${site.url}/personal-training`,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": businessId },
      inLanguage: "en-GB",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
