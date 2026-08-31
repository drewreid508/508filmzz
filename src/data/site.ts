import { SITE_URL } from "@/lib/site-url";
import { MINIMUM_MONTHS } from "@/lib/offer";

export const site = {
  name: "508 Filmzz",
  legalName: "508 Filmzz",
  tagline: "Cinematic Media. Built To Move.",
  positioning:
    "Commercial video, advertising creative and social content for businesses across Greenville and Upstate South Carolina.",
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
    "Commercial video production and advertising creative in Greenville, SC. Business video, social media content, motion graphics and drone production for contractors, dealerships, and established local businesses across Upstate South Carolina.",
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
 * Contact is rendered separately as the "Start Your Project" button.
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
  Start Your Project is not in `nav`.

  It is the header's standalone button and the footer's primary action, and it
  would be a seventh item on a bar that already wraps at seven. Contact stays
  in the nav because it answers a different question — how to reach me — while
  /book is where someone goes having already decided.
*/

/*
  There is no drone entry, and that is the point.

  Drone is a capability inside a shoot, not a service someone buys on its own —
  a client hires 508 Filmzz to film their business, and the aerial is one of the
  tools that gets used. Selling it separately invites the enquiry nobody wants:
  an hour of flying with no story attached. It appears where it actually
  applies, as the line that separates Essential from Growth and Partner.
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
    id: "commercial-advertising",
    title: "Commercial Advertising",
    blurb:
      "The ad itself — a polished commercial built to sell one service to one kind of customer, ready to run wherever you spend money.",
    points: [
      "Business commercials",
      "Paid social ad creative",
      "Website hero videos",
      "Service promotions",
      "Seasonal campaigns",
    ],
    image: "poster-blueworks",
  },
  {
    id: "social-content",
    title: "Social Content",
    blurb:
      "Short-form video made for the feed — the first two seconds earn the rest, and every cut is built for a phone held vertically.",
    points: [
      "Instagram Reels",
      "TikTok",
      "YouTube Shorts",
      "Before and after",
      "Behind the scenes",
    ],
    image: "poster-nmf",
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    blurb:
      "Animated titles, logo stings, callouts and on-screen text that make your offer land — the layer most local video is missing.",
    points: [
      "Animated logo and brand stings",
      "Offer and pricing callouts",
      "Service and product breakdowns",
      "On-screen captions",
      "Lower thirds and end cards",
    ],
    image: "poster-bratchers",
  },
  {
    id: "product-service",
    title: "Product & Service Videos",
    blurb:
      "Show a customer exactly what they get before they call. The video that answers the questions your phone keeps ringing about.",
    points: [
      "Service explainers",
      "Process walkthroughs",
      "Product features",
      "Facility and shop tours",
      "Team and owner intros",
    ],
    image: "poster-night-wash",
  },
  {
    id: "campaigns",
    title: "Content Campaigns",
    blurb:
      "One production, a month of material. A single shoot cut into a commercial, a set of social videos, and stills you can use everywhere.",
    points: [
      "One shoot, many deliverables",
      "A commercial plus social cutdowns",
      "Stills from the same session",
      "One consistent look across all of it",
      "Planned before anyone shows up",
    ],
    image: "poster-ram",
  },
];

export const capabilities = [
  "Commercial Advertising",
  "Social Content",
  "Motion Graphics",
  "Drone Production",
  "Product & Service Videos",
  "Content Campaigns",
];

/**
 * ── EDIT ME: PRICING ───────────────────────────────────────────────────────
 * Every price is a starting point, so raising them later is a one-line change
 * and never makes a published number wrong.
 *
 *   price     the headline figure, e.g. "$1,250"
 *   featured  highlights one card — keep it to a single tier
 *
 * Nothing else in the codebase hardcodes a price.
 */
export type Package = {
  id: string;
  name: string;
  /** null renders as "Custom quote" — the Custom project has no figure to start from. */
  price: string | null;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const packages: Package[] = [
  {
    id: "social",
    name: "Social Media Reel",
    price: "$200+",
    summary:
      "Professionally filmed and edited short-form content ready for social media.",
    includes: [
      "Filmed on location",
      "Edited vertical reel",
      "Captions and music",
      "Ready to post",
    ],
  },
  {
    id: "automotive",
    name: "Automotive Video",
    price: "$300+",
    summary:
      "Cinematic automotive content for vehicles, builds, dealerships, detail shops, and events.",
    includes: [
      "Rolling and static coverage",
      "Detail and hero frames",
      "Full edit, colour grade and sound",
      "Vertical cutdowns included",
    ],
    featured: true,
  },
  {
    id: "commercial",
    name: "Commercial Video",
    price: "$500+",
    summary:
      "Professional promotional video content for businesses, products, and services.",
    includes: [
      "Planned before the shoot",
      "Full production day",
      "Full edit, colour grade and sound",
      "Master plus vertical cutdowns",
    ],
  },
  {
    id: "custom-project",
    name: "Custom Project",
    price: null,
    summary:
      "Anything outside the three above — a bigger production, an event, or a one-off idea.",
    includes: [
      "Scoped around the job",
      "Quoted before anything is booked",
    ],
  },
];


/**
 * ── EDIT ME: WHY A BUSINESS PAYS FOR THIS ──────────────────────────────────
 * Four reasons, in the language a business owner already uses. This is the
 * homepage answer to "why is a video worth money", and it sits before any
 * price on the page, because a figure means nothing until the reader knows
 * what it is for.
 *
 * Every line describes the work or what it is built to do. Nothing here
 * promises customers, sales, followers or growth — those are outcomes no
 * filmmaker controls, and a business owner who has been sold one before stops
 * believing the rest of the page the moment they read it.
 */
export const benefits = [
  {
    title: "Look established",
    body: "Most local businesses still look local online. Professional video is the fastest way to look like the bigger option in your market.",
  },
  {
    title: "Earn the click",
    body: "Content built to stop a thumb, not fill a feed. The first two seconds do the work everything after them depends on.",
  },
  {
    title: "Show the work",
    body: "Customers buy what they can see. Real footage of your crew, your process and your finished jobs beats anything you can say about them.",
  },
  {
    title: "Give your ads something to run",
    body: "Ad spend is only as good as the creative behind it. This is the piece most businesses are missing when their ads underperform.",
  },
];

/**
 * The division of labour, stated plainly.
 *
 * It closes the benefits grid because it answers the objection those four
 * cards raise: yes, but who does all that? One person, and not you.
 */
export const ownerPledge = {
  lines: ["You run the business.", "I'll handle the content."],
  body: "Planning, production, editing and delivery, handled end to end. You show up, do what you already do well, and get back a month of material you can actually use.",
  cta: "Start Your Project",
};

/**
 * ── EDIT ME: WHAT THE MONEY ACTUALLY BUYS ──────────────────────────────────
 * The stages between hiring me and having something to post. It exists because
 * the thing being sold looks, from outside, like a thirty-second video — and a
 * thirty-second video sounds like thirty seconds of work.
 *
 * Kept to single words. This is a chain to be glanced at, not read; the moment
 * a stage needs a sentence it stops working as a diagram. `process` below
 * carries the same four middle stages with the detail, for anyone who wants it.
 */
export const contentPipeline = [
  "Strategy",
  "Planning",
  "Production",
  "Post",
  "Content you can publish",
];

/** The point of the chain above, in one line. No numbers, nothing promised. */
export const pipelineNote =
  "One production day becomes a commercial, a month of social content, and stills you can use everywhere.";

/**
 * Why a schedule beats a one-off, for anyone weighing the monthly tiers.
 */
export const batchNote = {
  title: "One production. A month of material.",
  body: "Everything is planned and shot in batches, so you get a commercial, a set of social videos and stills out of the same day — and you are never the one deciding what to post this week.",
};


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
  /** Shown as its own line so a buyer can compare tiers without reading lists. */
  bestFor?: string;
  /*
    Bare numerals, with the unit carried by the card's label.

    They are set at display size in a half-width box: "1 shoot / month" wrapped
    onto two lines at 375px and overlapped its own caption. A numeral cannot
    wrap, so the box can never overflow however many tiers are added.
  */
  shoots?: string;
  reels?: string;
  /*
    Drone is the upgrade reason, so it is a field rather than a bullet buried in
    `includes`. A card can then say YES or NO in the same place on every tier,
    which is what makes the difference between Bronze and Silver read instantly.
  */
  drone?: boolean;
  /*
    Photos included, as a count rather than a yes/no.

    Every tier gets some, so a boolean would answer "yes" three times and tell
    a buyer nothing. The number is what separates them, which is why it sits
    beside reels and shoots as a figure rather than in the checklist.
  */
  photos?: string;
  /** Shown as the standout ribbon. One tier only, or it stops meaning anything. */
  popular?: boolean;
  /** null renders as "Custom quote" with no "Starting at" or "/month" label. */
  price: string | null;
  summary: string;
  includes: string[];
  featured?: boolean;
};

/*
  ── EDIT ME: THE MONTHLY LADDER ────────────────────────────────────────────
  Priced off shoot days, not off reel counts.

  A production day is the expensive thing here — it is the one input that costs
  a whole morning whatever else happens — so the ladder is built to hold
  revenue per shoot day flat at $500 across all three tiers. Bronze at one day,
  Silver at two, Gold at three. Move a client up and the day rate does not
  soften, which is the difference between selling more and simply working more.

  Editing scales far more cheaply than filming, so that is where the buyer's
  incentive to climb lives: reels go 4 -> 9 -> 14 and photos 5 -> 12 -> 20, so
  each step up buys proportionally more than the step in price. Per reel that
  is $125 -> $111 -> $107, a volume discount small enough to stay honest and
  visible enough to be worth taking.

  Drone is the one hard yes/no, and it is what Bronze is missing.
*/
export const monthlyPackages: MonthlyPackage[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: "$500",
    bestFor: "Businesses starting to post consistently",
    shoots: "1",
    reels: "4",
    photos: "5",
    drone: false,
    summary: "One filming day a month, edited and ready to post.",
    includes: [
      "4 professionally edited reels",
      "1 batch filming session",
      "5 photos you can use in ads and posts",
      "Captions + music",
      "Content planning",
      "1 revision round",
      "Ready-to-post vertical videos",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: "$1,000",
    bestFor: "Businesses staying active on social all month",
    shoots: "2",
    reels: "9",
    photos: "12",
    drone: true,
    summary: "Twice the filming, more than twice the content — and drone included.",
    includes: [
      "9 professionally edited reels",
      "2 batch filming sessions",
      "12 photos you can use in ads and posts",
      "Drone content included",
      "Captions + music",
      "Content planning",
      "1 revision round",
      "Ready-to-post vertical videos",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "gold",
    name: "Gold",
    price: "$1,500",
    bestFor: "Businesses that want a brand, not just posts",
    shoots: "3",
    reels: "14",
    photos: "20",
    drone: true,
    summary: "The most filming days, the most content, and first pick of the calendar.",
    includes: [
      "14 professionally edited reels",
      "3 batch filming sessions",
      "20 photos you can use in ads and posts",
      "Drone content included",
      "Priority scheduling",
      "Captions + music",
      "Content planning",
      "1 revision round",
      "Ready-to-post vertical videos",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    price: null,
    bestFor: "Built around your business",
    summary:
      "For businesses that need a custom amount of content, special projects, different shoot schedules, or something outside the standard packages.",
    includes: [
      "Custom number of videos",
      "Custom shoot schedule",
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
 * buys footage, a couple of months start building a library and a look.
 */
export const monthlyCommitment = {
  label: "2-Month Minimum",
  body: "Monthly packages run on a two-month minimum. That is not a lock-in — it is how long it takes for a content library and a consistent look to be worth anything. After that they continue month to month unless your agreement says otherwise.",
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
  body: "Start a monthly content package and your first month is billed at a reduced rate. The rest of the term runs at the standard quoted price, and the package continues month to month after that.",
  terms: [
    "New monthly clients only",
    "Applies to the first month of a package",
    `Requires the ${MINIMUM_MONTHS}-month minimum`,
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
  { term: "2 months", saving: 0, note: "The standard minimum on every monthly package." },
  { term: "6 months", saving: 0.05, note: "A half-year of consistent output, at a preferred rate." },
  { term: "12 months", saving: 0.1, note: "A full year of coverage, at the best monthly rate offered." },
];

/** Shown under the monthly grid, same job as `pricingNote` above. */
export const monthlyNote =
  "Every monthly package is quoted around your business — how often we shoot, how many locations are involved, and what needs to be delivered each month.";

/** Shown under the pricing grid so the numbers are never mistaken for quotes. */
export const pricingNote =
  "These are starting points, not a menu. What a project actually costs comes down to production time, locations, how far the shoot is, how much editing and motion graphics it needs, and how much is being delivered. Tell me what you have in mind and you get a real number in writing.";


export const process = [
  {
    step: "Plan",
    body: "We agree what the video has to do and who it is talking to before anything gets filmed. No guessing on the day.",
  },
  {
    step: "Film",
    body: "A planned production day, run properly. Every setup is there because it earns its place in the finished piece.",
  },
  {
    step: "Edit",
    body: "Cut for pace, finished with motion graphics and sound, and built around the one thing you want a customer to do next.",
  },
  {
    step: "Deliver",
    body: "Everything labelled and sized for where it runs — your website, your social, your ads — ready to publish the day it lands.",
  },
];

/*
  Stats removed.

  They were counters that animate up from zero, and on any load where the
  animation stalled they sat on screen reading "0", "0K", "0" — which reads as
  a broken site, or worse, as a business with nothing to show. The numbers were
  framing rather than achievement anyway ("1 creator", "3 verticals"), so
  nothing true was lost by deleting them.
*/
export const stats: { value: number; suffix: string; label: string }[] = [];

/** "Why work with 508 Filmzz" — the booking-page trust block. */
export const advantages = [
  {
    title: "Work That Holds Up Anywhere",
    body: "Content finished to a standard that looks right on your homepage, in a paid ad, and next to a national brand in the same feed.",
  },
  {
    title: "Drone Coverage",
    body: "Aerial coverage of properties, roofs and job sites — included on Growth and Partner, and available on any production where it adds something.",
  },
  {
    title: "Creative Direction Included",
    body: "You are not handed a shot list to fill in. The angle, the message and the hook are worked out before production starts.",
  },
  {
    title: "Fast Turnaround",
    body: "Most projects are delivered within 3–7 business days.",
  },
  {
    title: "Built For Where It Runs",
    body: "Every piece is finished more than once — a wide version for your site, vertical cutdowns for social, and versions sized for paid ads.",
  },
  {
    title: "One-on-One Communication",
    body: "You talk to the person holding the camera. No account managers, no handoffs.",
  },
  {
    title: "Greenville & Upstate South Carolina",
    body: "Based in Piedmont, minutes from Greenville, working with businesses across the Upstate. Projects further out are quoted with travel included.",
  },
];

/**
 * ── EDIT ME: WHO THIS IS FOR ───────────────────────────────────────────────
 * The industries the studio actually wants enquiries from.
 *
 * It is on the page for one reason: a roofing company that lands on a site
 * full of car videos assumes it is not for them and leaves. Naming the trades
 * outright is what stops that, and it quietly filters out the people looking
 * for a fifty-pound favour at the same time.
 *
 * Kept to industries where video demonstrably changes how a customer chooses:
 * visible work, considered purchase, local competition.
 */
export const industries = [
  "Roofing",
  "HVAC",
  "Construction",
  "Remodeling",
  "Auto Dealerships",
  "Detailing & Automotive",
  "Landscaping",
  "Pressure Washing",
  "Real Estate",
  "Med Spas",
  "Dental Practices",
  "Home Services",
];

/** The line that sits over the industry list. */
export const industriesNote =
  "If your work looks good in person, it should look good online. These are the businesses where that gap costs the most — and where professional content closes it fastest.";

/**
 * ── EDIT ME: MORE THAN JUST VIDEO ──────────────────────────────────────────
 * What is actually bundled into a production, in the client's language.
 *
 * This exists to answer the quiet objection behind every quote at this level:
 * "my nephew has a camera." The answer is not a better camera — it is that
 * six separate disciplines go into one finished piece, and a business is
 * buying all of them at once. Deliberately no tools, software or gear named:
 * a client is buying the result, not the kit that produced it.
 */
export const craft = {
  title: "More Than Just Video",
  lead: "A finished piece of advertising is not one skill. It is six, and most businesses are only ever sold one of them.",
  disciplines: [
    {
      title: "Cinematography",
      body: "Knowing where to put the camera, and what to light, so an ordinary job site looks like the best one in the market.",
    },
    {
      title: "Creative Direction",
      body: "Deciding what the video is actually saying, who it is saying it to, and what you want them to do about it.",
    },
    {
      title: "Editing",
      body: "Pace and structure. The difference between footage of your business and something a stranger watches to the end.",
    },
    {
      title: "Motion Graphics",
      body: "Animated titles, offers, callouts and branding — the layer that turns a nice video into an actual advertisement.",
    },
    {
      title: "Sound Design",
      body: "The part nobody notices until it is missing. Music and mix are most of why something feels expensive.",
    },
    {
      title: "Advertising Storytelling",
      body: "Built to sell, not just to look good. Every piece is made around one service, one customer, and one next step.",
    },
  ],
};

/**
 * ── EDIT ME: TRAVEL ────────────────────────────────────────────────────────
 * Stated plainly, before anyone asks.
 *
 * The point is not to charge for mileage. It is to set the expectation that a
 * production two hours away is a full day of the studio's week, so it gets
 * scoped as one — which is exactly the conversation that is awkward to have
 * after someone has already asked for a price.
 *
 * Written as how projects are quoted rather than as a list of fees. A travel
 * policy that reads like a surcharge schedule loses the client it was written
 * to qualify.
 */
export const travel = {
  eyebrow: "Travel & Coverage",
  title: "Where I Work",
  lead: "Greenville, Piedmont, Greer, Simpsonville, Easley, Anderson, Spartanburg and the rest of the Upstate are home ground.",
  points: [
    {
      title: "Local production",
      body: "Anywhere in the Upstate is quoted normally, with no travel line on the invoice.",
    },
    {
      title: "Extended travel",
      body: "Further out is welcome and happens often. Travel time is simply built into the quote, so the day gets the production it deserves rather than being squeezed around the drive.",
    },
    {
      title: "Outside the region",
      body: "Bigger projects further afield are quoted individually, usually as a full production day or a multi-day booking.",
    },
  ],
};

export const faqs = [
  {
    q: "How much does a project cost?",
    a: "Projects start at $750, commercials at $1,250, and campaigns at $2,000. The final number depends on production time, locations, how much is being delivered, and how far the shoot is — you get it in writing before anything is booked.",
  },
  {
    q: "How long until I get the videos?",
    a: "Most projects are delivered within 3–7 business days of the production day. Larger campaigns are scheduled with a delivery date agreed up front.",
  },
  {
    q: "Do you travel?",
    a: "Greenville and the Upstate are covered as standard. Further out is no problem — travel is simply factored into the quote so the production day is worth doing properly, and anything outside the usual service area is quoted individually.",
  },
  {
    q: "Do you offer drone footage?",
    a: "Yes, as part of a production rather than on its own. It is included on Growth and Partner, and can be added to any project where an aerial actually adds something — a roof, a property, a job site.",
  },
  {
    q: "Can I use the videos anywhere?",
    a: "Yes. Everything is delivered ready for your website, Instagram, Facebook, TikTok and YouTube, and cleared to run as paid ad creative.",
  },
];
