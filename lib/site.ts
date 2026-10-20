export const site = {
  name: "Auric Performance",
  url: "https://www.auricperformance.co.uk",
  email: "info@auricperformance.co.uk",
  description:
    "1:1 personal trainer and physical performance coach based in Taunton, Somerset. Online programming, hybrid training and rehabilitation for clients across the southwest of the UK.",
  address: {
    street: "25 Station Road, Hatch Beauchamp",
    locality: "Taunton",
    region: "Somerset",
    postalCode: "TA3 6SQ",
    country: "GB",
  },
  geo: {
    latitude: 50.97887,
    longitude: -2.99259,
  },
  mapsUrl: "https://g.page/r/CYlQ16bijYP8EBM",
  mapsEmbed:
    "https://maps.google.com/maps?q=25%20Station%20Road%2C%20Hatch%20Beauchamp%2C%20Taunton%20TA3%206SQ&z=13&output=embed",
  sameAs: [
    "https://www.instagram.com/auricperformance/",
    "https://www.facebook.com/profile.php?id=61589179450146",
    "https://www.linkedin.com/company/auric-perfomance/",
    "https://g.page/r/CYlQ16bijYP8EBM",
  ],
};

export const areaServed = [
  { "@type": "AdministrativeArea" as const, name: "South West England" },
  { "@type": "AdministrativeArea" as const, name: "Somerset" },
  { "@type": "City" as const, name: "Taunton" },
  { "@type": "City" as const, name: "Exeter" },
  { "@type": "City" as const, name: "Bristol" },
  { "@type": "City" as const, name: "Bath" },
  { "@type": "AdministrativeArea" as const, name: "Devon" },
  { "@type": "AdministrativeArea" as const, name: "Dorset" },
  { "@type": "AdministrativeArea" as const, name: "Cornwall" },
  { "@type": "AdministrativeArea" as const, name: "Wiltshire" },
];

export const faqs = [
  {
    question: "What does Auric Performance offer?",
    answer:
      "Auric Performance offers 1:1 personal training, physical performance coaching, online programming and exercise rehabilitation. The current programmes are 1:1 coaching, OUTRUN, OUTLIFT, OUTPERFORM, AURIC SUB60 and Auric Rehab.",
  },
  {
    question: "Do you offer 1:1 personal training in the southwest?",
    answer:
      "Yes. Auric Performance is a 1:1 personal trainer and physical performance coach based in Hatch Beauchamp, Taunton. Alex Peterson and Courtney Alexander coach clients across Somerset, Devon, Bristol, Dorset, Cornwall, Wiltshire and the wider southwest, as well as online.",
  },
  {
    question: "Do you offer online programming?",
    answer:
      "Yes. Online programming is delivered in 12-week blocks through the Auric training app. OUTRUN, OUTLIFT, OUTPERFORM and AURIC SUB60 are programmed by Royal Marine physical training instructors and are available to clients in the southwest and across the UK.",
  },
  {
    question: "Where is Auric Performance based?",
    answer:
      "Auric Performance is based at 25 Station Road, Hatch Beauchamp, Taunton, TA3 6SQ, Somerset. The practice is listed on Google Maps and coaches clients across the southwest of the UK.",
  },
  {
    question: "Is Auric Performance a tactical performance programme?",
    answer:
      "No. Auric Performance is a physical performance coaching practice. Current services are 1:1 personal training, online programming and rehabilitation. Older pages that described tactical athlete programmes are out of date.",
  },
] as const;
