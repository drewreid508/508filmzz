export const site = {
  name: "508 Filmzz",
  legalName: "508 Filmzz",
  tagline: "One Vision. Every Detail.",
  positioning: "Building Brands Through Cinematic Storytelling.",
  url: "https://www.508filmzz.com",
  description:
    "Premium cinematic films for automotive, businesses, and outdoor brands. Planned, filmed, edited, and delivered by one director serving Greenville and Upstate South Carolina.",
  owner: "Drew Reid",
  email: "drew@508filmzz.com",
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

export const nav = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Automotive", href: "/automotive" },
  { label: "Business Ads", href: "/business-ads" },
  { label: "Hunting & Outdoor", href: "/hunting-outdoor" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
] as const;

export type Service = {
  id: string;
  title: string;
  blurb: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "automotive",
    title: "Automotive Films",
    blurb:
      "Rolling shots, static hero sequences, and detail macro work cut to feel like a factory launch film.",
    points: ["Rolling & tracking", "Detail macro", "Launch-grade colour"],
  },
  {
    id: "business",
    title: "Business Advertisements",
    blurb:
      "Brand films and paid-social ads built around a hook, a promise, and a call to action that actually converts.",
    points: ["Brand films", "Paid social ads", "Scripting & story"],
  },
  {
    id: "outdoor",
    title: "Hunting & Outdoor",
    blurb:
      "First light to last light. Field-tested coverage for outdoor brands, guides, and boat builders.",
    points: ["Field coverage", "Product in situ", "Golden-hour work"],
  },
  {
    id: "photography",
    title: "Photography",
    blurb:
      "Commercial stills delivered alongside every film — the same lighting, the same grade, one consistent look.",
    points: ["Commercial stills", "Detail sets", "Retouch & grade"],
  },
  {
    id: "social",
    title: "Social Media Content",
    blurb:
      "Vertical-first content packages: reels, shorts, and cutdowns built for retention, not for a festival.",
    points: ["Reels & shorts", "Cutdown packages", "Hook-first edits"],
  },
  {
    id: "drone",
    title: "Drone Content",
    blurb:
      "Aerial reveals and top-down movement that give a build, a shop, or a shoreline real scale.",
    points: ["Aerial reveals", "Top-down motion", "Location scale"],
  },
];

export const capabilities = [
  "Automotive Films",
  "Business Advertisements",
  "Hunting & Outdoor Content",
  "Commercial Photography",
  "Social Media Content",
  "Reels",
  "Short Form Content",
  "Promotional Videos",
];

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
