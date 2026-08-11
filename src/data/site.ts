export const site = {
  name: "508 Filmzz",
  legalName: "508 Filmzz",
  tagline: "Cinematic Media. Built To Move.",
  positioning: "Cinematic media for automotive brands, businesses, and the people who build them.",
  url: "https://www.508filmzz.com",
  description:
    "508 Filmzz creates cinematic automotive, commercial, social media, photography, and drone content for brands and businesses.",
  owner: "Drew Reid",
  email: "508filmz@gmail.com",
  phone: "(864) 915-4071",
  /** E.164 for tel: links and SMS. */
  phoneE164: "+18649154071",

  /**
   * Registered business address.
   *
   * 508 Filmzz is a service-area business: the street line is used for Google
   * verification, invoicing, and nothing else. `showStreetAddress` is the single
   * switch that governs whether the street line may be rendered anywhere public
   * (site footer, contact page, JSON-LD). Leave it false — publishing a
   * residential address exposes it permanently to scrapers, and Google's SAB
   * guidelines expect it hidden.
   */
  address: {
    street: "65 Charterhouse Ave",
    city: "Piedmont",
    state: "South Carolina",
    stateShort: "SC",
    postalCode: "29673",
    country: "US",
    showStreetAddress: false,
  },

  /** Physical base — matches the Google Business pin. */
  city: "Piedmont",
  state: "South Carolina",
  stateShort: "SC",
  /** The market the marketing copy leads with. */
  primaryMarket: "Greenville",
  location: "Piedmont, SC — serving Greenville & the Upstate",
  travel: "Available throughout South Carolina and surrounding states.",
  instagram: "https://www.instagram.com/508_filmzz/",
  tiktok: "https://www.tiktok.com/@508_filmzz",
  instagramHandle: "@508_filmzz",
  tiktokHandle: "@508_filmzz",

  /** Opening month/year, for structured data and the Google Business profile. */
  founded: "2026-08",
} as const;

/**
 * Declared service area. Drives the JSON-LD `areaServed` list, the local-SEO
 * copy, and the city list entered on the Google Business Profile — keep this
 * as the single source of truth so the three never drift apart.
 */
export const serviceAreas = [
  "Greenville",
  "Piedmont",
  "Greer",
  "Simpsonville",
  "Mauldin",
  "Easley",
  "Travelers Rest",
  "Spartanburg",
  "Anderson",
  "Laurens",
  "Greenwood",
  "Seneca",
  "Clemson",
] as const;

/** Region label used where a single phrase reads better than a city list. */
export const serviceRegion = "Upstate South Carolina";

/**
 * Business hours. `day` uses schema.org DayOfWeek values so this can feed
 * `openingHoursSpecification` directly.
 */
export const hours = [
  { day: "Monday", opens: "08:00", closes: "18:00" },
  { day: "Tuesday", opens: "08:00", closes: "18:00" },
  { day: "Wednesday", opens: "08:00", closes: "18:00" },
  { day: "Thursday", opens: "08:00", closes: "18:00" },
  { day: "Friday", opens: "08:00", closes: "18:00" },
  { day: "Saturday", opens: "09:00", closes: "16:00" },
] as const;

/** Sunday is intentionally absent above — closed days are simply not listed. */
export const closedDays = ["Sunday"] as const;

/**
 * Primary navigation. The header shows everything between Home and Contact;
 * Contact is rendered separately as the "Book a Shoot" button.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Drone", href: "/drone" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export type Service = {
  id: string;
  title: string;
  blurb: string;
  /** Everything included. Shown as a checklist on the services page. */
  points: string[];
  /** Optional: the media id used as the card's backdrop. */
  image?: string;
};

/**
 * ── EDIT ME ────────────────────────────────────────────────────────────────
 * The service catalogue. Drives the home page grid, the /services page, the
 * footer list, and the JSON-LD offer catalogue — change it here only.
 *
 * `image` is a key from src/data/portfolio.generated.json (run `npm run
 * portfolio` after dropping new photos in) or media.generated.json.
 */
export const services: Service[] = [
  {
    id: "automotive",
    title: "Automotive Cinematography",
    blurb:
      "Rolling shots, tracking work, and detail macro cut to feel like a factory launch film rather than a walkaround.",
    points: [
      "Cinematic car photography",
      "Rolling shots",
      "Tracking shots",
      "Detail shots",
      "Build videos",
      "Dealership content",
      "Automotive commercials",
    ],
    image: "pf_img_5850",
  },
  {
    id: "social",
    title: "Social Media Content",
    blurb:
      "Vertical-first packages built for retention — hook in the first two seconds, cut for the screen people actually watch on.",
    points: [
      "TikTok",
      "Instagram Reels",
      "YouTube Shorts",
      "Vertical 9:16 content",
      "Social media packages",
      "Short-form advertising",
    ],
    image: "poster-showreel",
  },
  {
    id: "commercial",
    title: "Commercial Production",
    blurb:
      "Brand films and advertisements built around a promise and a call to action, not just pretty footage.",
    points: [
      "Business commercials",
      "Product videos",
      "Promotional videos",
      "Brand campaigns",
      "Professional advertisements",
    ],
    image: "pf_img_5834",
  },
  {
    id: "drone",
    title: "Drone Services",
    blurb:
      "Aerial reveals, top-down movement, and establishing shots that give a build, a property, or a shop real scale.",
    points: [
      "Cinematic aerial footage",
      "Automotive aerial shots",
      "Property & business aerial footage",
      "Real estate aerial footage",
      "Event aerial coverage",
      "Establishing shots",
      "Top-down shots",
      "Tracking & follow shots",
      "Drone photos",
      "Commercial drone production",
    ],
  },
  {
    id: "photography",
    title: "Photography",
    blurb:
      "Commercial stills delivered alongside every film — same lighting, same grade, one consistent look across the campaign.",
    points: [
      "Automotive photography",
      "Product photography",
      "Business photography",
      "Social media photography",
    ],
    image: "pf_img_5829",
  },
  {
    id: "editing",
    title: "Video Editing",
    blurb:
      "The look is built in the timeline, not bought as a preset. Edit-only work welcome if you already have footage.",
    points: [
      "Professional color grading",
      "Cinematic editing",
      "Sound design",
      "Motion graphics",
      "Speed ramps",
      "Visual effects",
      "Social media edits",
    ],
    image: "pf_img_5860",
  },
];

export const capabilities = [
  "Automotive Cinematography",
  "Social Media Content",
  "Commercial Production",
  "Drone Services",
  "Photography",
  "Video Editing",
];

/**
 * ── EDIT ME: PRICING ───────────────────────────────────────────────────────
 * Every price is a starting point, so raising them later is a one-line change
 * and never makes a published number wrong.
 *
 *   price     the headline figure, e.g. "$300+"
 *   featured  highlights one card — keep it to a single tier
 *
 * Nothing else in the codebase hardcodes a price.
 */
export type Package = {
  id: string;
  name: string;
  price: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const packages: Package[] = [
  {
    id: "social",
    name: "Social Content",
    price: "$200+",
    summary: "Vertical-first content built to run on Reels, TikTok, and Shorts.",
    includes: [
      "Half-day shoot",
      "Vertical 9:16 cutdowns",
      "Colour grade & sound design",
      "Ready to post",
    ],
  },
  {
    id: "automotive",
    name: "Automotive Production",
    price: "$300+",
    summary: "Rolling, static, and detail coverage for a build, a car, or a shop.",
    includes: [
      "Rolling & tracking shots",
      "Detail and hero frames",
      "Full edit and grade",
      "Stills set included",
    ],
    featured: true,
  },
  {
    id: "commercial",
    name: "Commercial Production",
    price: "$500+",
    summary: "A full brand film for a business, product, or campaign.",
    includes: [
      "Concept and shot list",
      "Full production day",
      "Motion graphics",
      "Master plus social cutdowns",
    ],
  },
  {
    id: "drone",
    name: "Drone Production",
    price: "$200+",
    summary: "Aerial coverage on its own or added to any other package.",
    includes: [
      "Cinematic aerial footage",
      "Establishing & top-down shots",
      "Tracking and follow work",
      "Aerial stills",
    ],
  },
  {
    id: "full",
    name: "Full Content Package",
    price: "$750+",
    summary: "Ground, air, stills, and social — one shoot, everything delivered.",
    includes: [
      "Full production day",
      "Drone coverage included",
      "Photography included",
      "Master film plus social cutdowns",
    ],
  },
];

/** Shown under the pricing grid so the numbers are never mistaken for quotes. */
export const pricingNote =
  "Every project is custom quoted on shoot time, location, and deliverables. These are starting points — tell me what you have in mind and I'll give you a real number.";


export const process = [
  {
    step: "Plan",
    body: "We lock the story, the shot list, and the deliverables before a single frame is shot. No guessing on the day.",
  },
  {
    step: "Film",
    body: "One operator, cinema glass, controlled light. Every setup is chosen because it earns its place in the cut.",
  },
  {
    step: "Edit",
    body: "Cut to rhythm, graded for depth, mixed for impact. The look is built in the timeline, not bought as a preset.",
  },
  {
    step: "Deliver",
    body: "Master file, vertical cutdowns, and stills — packaged, labelled, and ready to publish the day you get them.",
  },
];

/** Framing stats — descriptive of the offer, not invented client metrics. */
export const stats = [
  { value: 1, suffix: "", label: "Creator, every step" },
  { value: 4, suffix: "K", label: "Cinema delivery" },
  { value: 3, suffix: "", label: "Core verticals" },
  { value: 8, suffix: "", label: "Services offered" },
];

/** "Why work with 508 Filmzz" — the booking-page trust block. */
export const advantages = [
  {
    title: "Professional Cinema Quality",
    body: "Cinema glass, controlled light, and a grade built in the timeline — not bought as a preset.",
  },
  {
    title: "Drone Footage Available",
    body: "Aerial reveals and top-down movement available on most projects.",
  },
  {
    title: "Creative Direction Included",
    body: "The story, the shot list, and the hook are planned before the camera comes out of the bag.",
  },
  {
    title: "Fast Turnaround",
    body: "Most projects are delivered within 3–7 business days.",
  },
  {
    title: "Social Media Optimized",
    body: "Every film is finished twice — a wide master and a vertical cutdown for reels and shorts.",
  },
  {
    title: "One-on-One Communication",
    body: "You talk to the person holding the camera. No account managers, no handoffs.",
  },
  {
    title: "Serving Greenville & Upstate SC",
    body: "Based in Piedmont, minutes from Greenville, and available throughout South Carolina and surrounding states.",
  },
];

export const faqs = [
  {
    q: "How much does a shoot cost?",
    a: "Every project is custom quoted based on your goals, shoot time, and deliverables.",
  },
  {
    q: "How long does editing take?",
    a: "Most projects are delivered within 3–7 business days.",
  },
  {
    q: "Do you travel?",
    a: "Yes. I travel throughout South Carolina and surrounding states.",
  },
  {
    q: "Do you offer drone footage?",
    a: "Absolutely. Drone footage is available for most projects.",
  },
  {
    q: "Can I use my videos anywhere?",
    a: "Yes. All content is delivered ready for Instagram, Facebook, TikTok, YouTube, and your website.",
  },
];
