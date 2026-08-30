import { SITE_URL } from "@/lib/site-url";

export const site = {
  name: "508 Filmzz",
  legalName: "508 Filmzz",
  tagline: "Cinematic Media. Built To Move.",
  positioning: "Cinematic media for automotive brands, businesses, and the people who build them.",
  /**
   * The canonical origin — where the site actually answers.
   *
   * Every canonical tag, the sitemap, robots.txt, and the JSON-LD are built
   * from this. It must match reality: a canonical pointing at a domain that
   * does not resolve tells Google the real page lives somewhere it cannot
   * fetch, and the pages that do exist go unindexed.
   *
   * Set NEXT_PUBLIC_SITE_URL to the live origin. Once DNS is pointed at
   * www.508filmzz.com, change that one variable (and drop
   * NEXT_PUBLIC_BASE_PATH) and everything follows.
   */
  url: SITE_URL,
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
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/*
  Drone is off the nav, not deleted.

  Six items is the most a phone header carries without wrapping, and drone is a
  service rather than a section — it is reached from Services and from the
  homepage vertical grid, both of which still link to /drone. The page, its
  copy and its route are untouched.
*/

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
    image: "poster-revuelto",
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

/**
 * ── EDIT ME: THE CASE FOR IT ───────────────────────────────────────────────
 * What the money buys, in business terms rather than production terms. Sits
 * above the prices, because a figure only means something once the reader knows
 * what it is for.
 *
 * Deliberately no numbers, no guarantees, no invented results — nothing here
 * promises customers, sales, or views. Every line is a description of the work
 * and what it is built to do, which is the only honest claim available and the
 * only one a serious business owner believes anyway.
 */
export const valueProps = [
  {
    title: "Get noticed",
    body: "Content shot and cut for the platforms your customers already scroll, not repurposed from a widescreen edit.",
  },
  {
    title: "Build trust",
    body: "Your actual work, filmed properly. People hire what they can already picture you doing for them.",
  },
  {
    title: "Look premium",
    body: "Cinema glass, controlled light, and a grade built in the timeline. The look does the arguing about your price for you.",
  },
  {
    title: "Stay consistent",
    body: "One shoot delivers a master plus vertical cutdowns and stills — enough to keep posting without going quiet.",
  },
  {
    title: "Turn views into contact",
    body: "Every piece is cut toward one action: a call, a message, a booking. Attention is only worth what it converts into.",
  },
];

/** The sign-off under the value grid. First person, like the rest of the site. */
export const valueStatement =
  "You handle the business. I handle making it look impossible to ignore.";

/**
 * ── EDIT ME: MONTHLY CONTENT ───────────────────────────────────────────────
 * The recurring side of the business, kept deliberately separate from
 * `packages` above. A one-off is a project; this is a partnership, and mixing
 * the two in one grid makes a monthly figure look like a single shoot's price.
 *
 *   price     the headline figure, or null for "Custom quote"
 *   featured  highlights one card — keep it to a single tier
 */
export type MonthlyPackage = {
  id: string;
  name: string;
  /** null renders as "Custom quote" with no "Starting at" or "/month" label. */
  price: string | null;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const monthlyPackages: MonthlyPackage[] = [
  {
    id: "starter",
    name: "Monthly Starter",
    price: "$700+",
    summary:
      "For businesses that need consistent content without a huge production schedule.",
    includes: [
      "1 shoot per month",
      "2–3 hour production session",
      "2 edited vertical videos",
      "Rolling & static coverage",
      "Basic photography",
      "Colour grade & sound design",
      "Ready-to-post content",
    ],
  },
  {
    id: "growth",
    name: "Monthly Growth",
    price: "$1,000+",
    summary:
      "Built for businesses that want to stay active on social media throughout the month.",
    includes: [
      "2 shoots per month",
      "Rolling & tracking shots",
      "4–6 edited vertical videos",
      "Photography included",
      "Drone coverage when needed",
      "Multiple locations / vehicles",
      "Colour grade & sound design",
      "Social-ready delivery",
    ],
    featured: true,
  },
  {
    id: "full-coverage",
    name: "Monthly Full Coverage",
    price: "$1,500+",
    summary:
      "Full-service monthly content for businesses that want their brand consistently filmed at a higher level.",
    includes: [
      "2–4 production days per month",
      "Full automotive coverage",
      "Rolling, tracking & detail shots",
      "Drone coverage",
      "Professional photography",
      "6–10+ social videos",
      "Hero / brand film",
      "Motion graphics",
      "Full colour grade & sound design",
    ],
  },
  {
    id: "custom",
    name: "Custom Monthly",
    price: null,
    summary: "For brands that need a completely custom content schedule.",
    includes: [
      "Custom shoot schedule",
      "Creative planning",
      "Cars, products, people & locations",
      "Rolling / vehicle coverage",
      "Drone production",
      "Photography",
      "Social media content",
      "Commercial / brand films",
      "Custom deliverables",
    ],
  },
];

/**
 * Terms for the monthly packages only — never shown against the one-off tiers,
 * which carry no commitment at all.
 *
 * Written as a term of the partnership rather than a restriction. A minimum is
 * only worth stating because it is what makes the work compound: a single month
 * buys footage, two months start building a library and a recognisable look.
 */
export const monthlyCommitment = {
  label: "3-Month Minimum",
  body: "Monthly content partnerships run on a three-month minimum. After the initial term, packages continue month-to-month unless your agreement says otherwise.",
  custom: "Custom packages may carry different terms, set by the scope of the work.",
};

/**
 * The introductory offer for new monthly clients.
 *
 * Framed as a first-month rate rather than a sale. The reason the discount can
 * exist at all is that a monthly client books once and shoots repeatedly, so
 * the copy points at that rather than at the saving — a studio that discounts
 * to win work invites being asked to discount again.
 *
 * The percentage and the arithmetic live in src/lib/offer.ts. Nothing here
 * states a reduced figure, so raising a package price cannot leave a stale one.
 */
export const newClientOffer = {
  eyebrow: "New Monthly Clients",
  label: "Your first month, reduced",
  body: "Start a monthly content package and your first month is billed at a reduced rate. Months two and three run at the standard quoted price, and the package continues month-to-month after that.",
  terms: [
    "New monthly clients only",
    "Applies to the first month of a package",
    "Requires the three-month minimum",
    "Your exact rate comes from your quote",
  ],
  cta: "Start Your Monthly Content",
};

/**
 * Longer commitments, better monthly rate.
 *
 * `saving` is a fraction so the copy and the arithmetic cannot drift — the
 * label under each term is generated from it, not typed alongside it.
 *
 * Billing is monthly in every case. That is stated on the block itself because
 * "12 months" next to a price reads as a figure due today, and a client who
 * thinks they are being asked for a year up front stops reading.
 */
export const commitmentTiers = [
  { term: "3 months", saving: 0, note: "The standard minimum on every monthly package." },
  { term: "6 months", saving: 0.05, note: "A half-year of consistent output, at a preferred rate." },
  { term: "12 months", saving: 0.1, note: "A full year of coverage, at the best monthly rate offered." },
];

/** Shown under the monthly grid, same job as `pricingNote` above. */
export const monthlyNote =
  "Every monthly package is custom quoted based on shoot frequency, production time, locations, and deliverables.";

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
