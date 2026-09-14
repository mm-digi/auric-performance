const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "SportsActivityLocation"],
      "@id": "https://www.auricperformance.co.uk/#business",
      name: "Auric Performance",
      legalName: "Auric Performance",
      url: "https://www.auricperformance.co.uk",
      email: "info@auricperformance.co.uk",
      image: "https://www.auricperformance.co.uk/images/logo-au3.png",
      logo: {
        "@type": "ImageObject",
        url: "https://www.auricperformance.co.uk/images/logo-au3.png",
      },
      description:
        "Hybrid training, rehabilitation and personalised 1:1 coaching by Royal Marine Physical Training Instructors.",
      slogan: "OUTRUN : OUTLIFT : OUTPERFORM",
      areaServed: {
        "@type": "Country",
        name: "United Kingdom",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "25 Station Road, Hatch Beauchamp",
        addressLocality: "Taunton",
        postalCode: "TA3 6SQ",
        addressCountry: "GB",
      },
      sameAs: [
        "https://www.instagram.com/auricperformance/",
        "https://www.facebook.com/profile.php?id=61589179450146",
        "https://www.linkedin.com/company/auric-perfomance/",
        "https://g.page/r/CYlQ16bijYP8EBM",
      ],
      founder: [
        { "@id": "https://www.auricperformance.co.uk/#alex-peterson" },
        { "@id": "https://www.auricperformance.co.uk/#courtney-alexander" },
      ],
      employee: [
        { "@id": "https://www.auricperformance.co.uk/#alex-peterson" },
        { "@id": "https://www.auricperformance.co.uk/#courtney-alexander" },
      ],
      knowsAbout: [
        "Strength and conditioning",
        "Hybrid athlete training",
        "Exercise rehabilitation",
        "Tactical performance",
        "1:1 coaching",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Auric Performance programmes",
        itemListElement: [
          { "@type": "Offer", name: "OUTRUN", url: "https://www.auricperformance.co.uk/programmes#outrun" },
          { "@type": "Offer", name: "OUTLIFT", url: "https://www.auricperformance.co.uk/programmes#outlift" },
          { "@type": "Offer", name: "OUTPERFORM", url: "https://www.auricperformance.co.uk/programmes#outperform" },
          {
            "@type": "Offer",
            name: "OUTRUN : OUTLIFT : OUTPERFORM",
            url: "https://www.auricperformance.co.uk/programmes#complete-package",
          },
          { "@type": "Offer", name: "AURIC SUB60", url: "https://www.auricperformance.co.uk/programmes#auric-sub60" },
          { "@type": "Offer", name: "1:1 Coaching", url: "https://www.auricperformance.co.uk/programmes#coaching" },
          { "@type": "Offer", name: "Auric Rehab", url: "https://www.auricperformance.co.uk/programmes#auric-rehab" },
        ],
      },
    },
    {
      "@type": "Person",
      "@id": "https://www.auricperformance.co.uk/#alex-peterson",
      name: "Alex Peterson",
      jobTitle: "Co-founder and coach",
      worksFor: { "@id": "https://www.auricperformance.co.uk/#business" },
      image: "https://www.auricperformance.co.uk/images/alex.jpg",
      url: "https://www.auricperformance.co.uk/",
    },
    {
      "@type": "Person",
      "@id": "https://www.auricperformance.co.uk/#courtney-alexander",
      name: "Courtney Alexander",
      jobTitle: "Co-founder and coach",
      worksFor: { "@id": "https://www.auricperformance.co.uk/#business" },
      image: "https://www.auricperformance.co.uk/images/courtney.jpg",
      url: "https://www.auricperformance.co.uk/",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.auricperformance.co.uk/#website",
      url: "https://www.auricperformance.co.uk",
      name: "Auric Performance",
      publisher: { "@id": "https://www.auricperformance.co.uk/#business" },
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
