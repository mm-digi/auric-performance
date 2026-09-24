export type Programme = {
  id: string;
  kicker: string;
  title: string;
  video: string;
  price: string;
  url: string;
  intro: string;
  points: string[];
};

export const programmes: Programme[] = [
  {
    id: "outrun",
    kicker: "Hybrid programme · 12-week training blocks",
    title: "OUTRUN",
    video: "/videos/run.mp4",
    price: "£29.99 per month",
    url: "https://app.fitr.training/p/outrun",
    intro:
      "A hybrid training programme designed to improve running performance while maintaining strength, muscle and athleticism.",
    points: [
      "Run faster, get stronger and become a more complete athlete",
      "Delivered in progressive 12-week training blocks",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "outlift",
    kicker: "Hybrid programme · 12-week training blocks",
    title: "OUTLIFT",
    video: "/videos/alex-bar.mp4",
    price: "£29.99 per month",
    url: "https://app.fitr.training/p/outlift",
    intro:
      "A hybrid training programme designed to build strength while maintaining running performance, fitness and athleticism.",
    points: [
      "Get stronger without losing your engine",
      "Delivered in progressive 12-week training blocks",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "outperform",
    kicker: "Hybrid programme · 12-week training blocks",
    title: "OUTPERFORM",
    video: "/videos/box.mp4",
    price: "£29.99 per month",
    url: "https://app.fitr.training/p/outperform",
    intro: "A hybrid training programme designed to build strength and maximise running performance.",
    points: [
      "Become stronger, faster and more capable across every aspect of your performance",
      "Delivered in progressive 12-week training blocks",
      "Programmed by Royal Marine PTIs",
    ],
  },
  {
    id: "complete-package",
    kicker: "Complete programme package · Unlimited changes",
    title: "OUTRUN : OUTLIFT : OUTPERFORM",
    video: "/videos/coaches.mp4",
    price: "£39.99 monthly · £95.99 for 3 months · £287.93 yearly",
    url: "https://app.fitr.training/pa/outrunoutliftoutperform",
    intro:
      "Access OUTRUN, OUTLIFT and OUTPERFORM with unlimited programme changes. AURIC SUB60 is included with this package.",
    points: [
      "OUTRUN, OUTLIFT and OUTPERFORM included",
      "AURIC SUB60 included",
      "Unlimited programme changes",
      "Save 40% with the yearly plan",
    ],
  },
  {
    id: "auric-sub60",
    kicker: "Time-efficient hybrid programme",
    title: "AURIC SUB60",
    video: "/videos/alex-row.mp4",
    price: "£19.99 per month",
    url: "https://app.fitr.training/p/auricsub60",
    intro:
      "A time-efficient version of OUTPERFORM, with every session designed to be completed in 60 minutes or less. Buy it standalone, or get it included with OUTRUN : OUTLIFT : OUTPERFORM.",
    points: [
      "Build strength and maximise running performance",
      "Every session completed in 60 minutes or less",
      "Included with OUTRUN : OUTLIFT : OUTPERFORM",
      "Programmed by Royal Marine PTIs",
    ],
  },
];
