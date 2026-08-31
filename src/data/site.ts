import { SITE_URL } from "@/lib/site-url";

export const site = {
  name: "508 Filmzz",
  legalName: "508 Filmzz",
  tagline: "Marketing • Media • Growth",
  positioning:
    "A marketing and media studio for ambitious businesses — strategy, creative, content and advertising, run by one person who works with every client directly.",
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
    "508 Filmzz is a marketing agency and creative studio in Greenville, SC. Marketing strategy, social media marketing, Meta advertising, lead generation, commercial video production and content marketing for automotive dealerships, construction companies, builders, real estate and established businesses across South Carolina.",
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
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services" },
  /*
    The route stays /pricing even though no price appears on it.

    Business owners search "pricing" and type it into a URL bar, and the page
    does answer the question — the answer is that the number comes from the
    brief rather than a menu. Renaming the path would break that search
    behaviour and every link already pointing at it to gain nothing.
  */
  { label: "Custom Marketing", href: "/pricing" },
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

export type ServiceCategory = {
  id: string;
  /** MARKETING / MEDIA / CREATIVE. */
  title: string;
  /** One line on what this discipline is actually for. */
  blurb: string;
  /** The individual capabilities inside it. */
  items: string[];
  /** Optional: the media id used as the card's backdrop. */
  image?: string;
};

/**
 * ── EDIT ME: THE THREE DISCIPLINES ─────────────────────────────────────────
 * Marketing, Media and Creative — the whole catalogue, grouped.
 *
 * Grouped rather than listed flat on purpose. A flat list of twenty services
 * reads as a menu, and a menu invites a client to order one item and judge the
 * result on its own. These three are the parts of one engagement: the strategy
 * decides what to make, the media makes it, the creative puts it in front of
 * people. Which parts a business actually needs is the outcome of looking at
 * the business, which is why nothing here carries a price.
 *
 * Photography and drone live inside MEDIA. They are things a campaign uses,
 * not products sold on their own.
 */
export const services: ServiceCategory[] = [
  {
    id: "marketing",
    title: "Marketing",
    blurb:
      "The part that decides what gets made and why. Who you are talking to, what they need to hear, where it runs, and what it is supposed to bring back.",
    items: [
      "Marketing strategy",
      "Content strategy",
      "Social media strategy",
      "Social media management",
      "Meta advertising",
      "Lead generation",
      "Campaign strategy",
    ],
    image: "poster-blueworks",
  },
  {
    id: "media",
    title: "Media",
    blurb:
      "The footage and photography the strategy runs on. Filmed properly, finished to a standard that holds up next to a national brand in the same feed.",
    items: [
      "Cinematic video",
      "Commercials",
      "Short-form video",
      "Photography",
      "Drone",
      "Automotive content",
      "Brand content",
    ],
    image: "poster-ram",
  },
  {
    id: "creative",
    title: "Creative",
    blurb:
      "What turns the footage into something that sells — the ads, the graphics, the pages people land on when the ad does its job.",
    items: [
      "Ad creative",
      "Social graphics",
      "Motion graphics",
      "Campaign creative",
      "Landing pages",
      "Website and marketing creative",
    ],
    image: "poster-nmf",
  },
];

/** The line that sits under the three disciplines. */
export const servicesNote =
  "Very few businesses need all of this, and almost none need it in the same order. I look at where you actually are — what you are already doing, what is working, what is costing you — and build the approach around that. You are hiring an approach, not picking items off a list.";

/*
  The scrolling capability list — marquee, footer, showreel captions, JSON-LD.

  Flattened out of the three disciplines rather than written again, so it can
  never advertise something the catalogue no longer offers. It was a hand-kept
  second copy once and drifted, still selling a service that had been removed.
*/
export const capabilities = services.flatMap((service) => service.items);

/*
  The three words, for anywhere a list of twenty will not fit.

  The showreel overlay animates one line at a time over twelve seconds of
  footage — twenty of them is ninety seconds of captions and a wall of text on
  a phone. This is what the intro and any other fixed-height surface uses.
*/
export const disciplines = services.map((service) => service.title);

export const benefits = [
  {
    title: "Get attention",
    body: "Work that stops the scroll and looks like it came from a business worth taking seriously — because that judgement gets made in about a second.",
  },
  {
    title: "Reach the right people",
    body: "Meta advertising and content aimed at the customers you actually want, in the market you actually serve, rather than everyone with a phone.",
  },
  {
    title: "Generate leads",
    body: "Campaigns built to end in something measurable — a call, a form, a booking — instead of a view count nobody can spend.",
  },
  {
    title: "Look like the obvious choice",
    body: "A consistent brand across your ads, your feed and your website, so a customer comparing you to three competitors already has a favourite.",
  },
];

/**
 * The division of labour, stated plainly.
 *
 * It closes the benefits grid because it answers the objection those four
 * cards raise: yes, but who does all that? One person, and not you.
 */
export const ownerPledge = {
  lines: ["You run the business.", "I'll run the marketing."],
  body: "I plan the strategy, direct the creative, film and edit the media, and build the campaigns behind it. You deal with me directly, start to finish — there is no account manager between us.",
  cta: "Talk About Your Marketing",
};

/**
 * ── EDIT ME: HOW THE WORK RUNS ─────────────────────────────────────────────
 * Strategy → Creative → Media → Advertising → Growth.
 *
 * The order is the argument. Most businesses buying video start in the middle:
 * they commission media with no strategy behind it and no advertising in front
 * of it, then judge the result by how it looked. Showing the whole sequence is
 * what separates a marketing engagement from a shoot.
 *
 * Single words, because it is a chain to be glanced at rather than read. The
 * detail lives in `process` below for anyone who wants it.
 */
export const growthPath = [
  "Strategy",
  "Creative",
  "Media",
  "Advertising",
  "Growth",
];

/** The line that sits under the chain. No promised numbers — see `benefits`. */
export const growthPathNote =
  "Most businesses buy the middle of this and wonder why it did not work. A video with no strategy behind it and no advertising in front of it is a nice video.";

/**
 * ── EDIT ME: CUSTOM MARKETING ──────────────────────────────────────────────
 * What sits where a price list used to.
 *
 * No figure appears anywhere on this site, and that is a positioning decision
 * rather than an oversight. A published number invites a business to work out
 * whether it can afford you before it has told you what it needs, and the
 * businesses worth working with are the ones comparing outcomes, not rates.
 */
export const customMarketing = {
  eyebrow: "Custom Marketing",
  title: "No packages. A plan built around your business.",
  body: "Every business has different goals, audiences, and opportunities. I don't believe in one-size-fits-all marketing packages.",
  detail:
    "Tell me about your business, what you're trying to accomplish, and where you're currently struggling. I'll review your needs and build a custom proposal around your goals.",
  cta: "Request a Custom Quote",
  /** What actually moves a number, said plainly so the absence of one reads as deliberate. */
  factors: [
    {
      title: "What you already have",
      body: "A business with a working brand and a dead social account needs something different from one starting with nothing.",
    },
    {
      title: "What you are trying to do",
      body: "Filling a calendar, launching a location, moving specific inventory and building long-term brand are four different jobs.",
    },
    {
      title: "How much of it I run",
      body: "Some businesses want the media and will handle the rest. Others want the strategy, the content and the ad account managed.",
    },
    {
      title: "How often",
      body: "A single campaign and a standing monthly engagement are priced on completely different terms.",
    },
  ],
};

export const process = [
  {
    step: "Strategy",
    body: "I look at what you sell, who buys it, what your competitors are doing, and where the gap is. Everything after this is decided here, which is why it is not an optional extra.",
  },
  {
    step: "Creative",
    body: "The angle, the message and the offer, worked out before a camera comes out of the bag. What a customer should think, and what they should do about it.",
  },
  {
    step: "Media",
    body: "A planned production. Cinematic video, short-form, photography and drone — shot in batches so one day produces a campaign rather than a clip.",
  },
  {
    step: "Advertising",
    body: "The creative built for where it runs and put behind paid distribution, so it reaches the people you want instead of whoever happens to follow you.",
  },
  {
    step: "Growth",
    body: "What performed, what did not, and what changes next. Marketing is a loop, and the second month should be better informed than the first.",
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
    title: "You Work With Me Directly",
    body: "The person you brief is the person who builds the strategy, runs the camera and cuts the edit. Nothing is passed to a junior and nothing is lost in a handover.",
  },
  {
    title: "Marketing, Not Just Media",
    body: "Most production companies hand over a file and leave. I care what the file is supposed to do, where it runs, and whether it brought anything back.",
  },
  {
    title: "Work That Holds Up Anywhere",
    body: "Finished to a standard that looks right on your homepage, inside a paid ad, and next to a national brand in the same feed.",
  },
  {
    title: "Built For Where It Runs",
    body: "Every piece is delivered sized and cut for its destination — the wide master, the vertical, the ad, the stills — not one file you have to make work everywhere.",
  },
  {
    title: "Straight Answers",
    body: "If a campaign is the wrong move for your business I will say so before you spend on it. A client who wasted a budget does not come back.",
  },
  {
    title: "Greenville & Upstate South Carolina",
    body: "Based in Piedmont, working across South Carolina and the surrounding states. Travel is quoted with the project.",
  },
];

export const industries = [
  "Automotive Dealerships",
  "Automotive & Performance",
  "Construction",
  "Builders & Developers",
  "Real Estate",
  "Luxury & Premium Brands",
  "Marine & Powersports",
  "Home Services",
  "Manufacturing & Fabrication",
  "Professional Services",
];

export const industriesNote =
  "Businesses where the product is expensive, the decision is considered, and the customer is comparing you to two or three others before they call. That is where marketing earns its money — and where looking like the obvious choice is worth the most.";

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
/**
 * ── EDIT ME: WHAT ONE PERSON ACTUALLY DOES ─────────────────────────────────
 * The disciplines behind an engagement, in the client's language.
 *
 * This exists to answer the quiet objection behind every proposal at this
 * level: "why not use an agency, or my nephew with a camera?" The answer is
 * that six separate jobs go into marketing that works, most businesses are
 * only ever sold one of them, and here they are not split across three vendors
 * who never speak to each other.
 *
 * Deliberately no tools, platforms or software named: a business is buying the
 * outcome, not the kit that produced it.
 */
export const craft = {
  title: "Six Jobs, One Person",
  lead: "Marketing that works is not one skill. It is six, and most businesses are sold one of them at a time by people who never talk to each other.",
  disciplines: [
    {
      title: "Strategy",
      body: "Who you are actually competing with, what a customer is weighing when they choose, and where the opening is. Everything else is decided here.",
    },
    {
      title: "Creative Direction",
      body: "What the campaign is saying, who it is saying it to, and what you want them to do about it — settled before anything gets made.",
    },
    {
      title: "Cinematography",
      body: "Knowing where to put the camera, and what to light, so an ordinary job site or forecourt looks like the best one in the market.",
    },
    {
      title: "Editing & Motion",
      body: "Pace, structure, titles and offers. The difference between footage of your business and something a stranger watches to the end.",
    },
    {
      title: "Paid Advertising",
      body: "Creative built for where it runs, put behind budget, and aimed at the people you want rather than whoever already follows you.",
    },
    {
      title: "Measurement",
      body: "What performed, what did not, and what changes next month. Marketing is a loop, not a delivery.",
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
    q: "Is 508 Filmzz a video company or a marketing company?",
    a: "Marketing, with the media made in house. Most businesses hire a production company for footage and an agency for everything around it. I do both, which means the strategy and the thing being filmed are decided together rather than handed between two companies.",
  },
  {
    q: "How much does it cost?",
    a: "There are no package prices, because there are no packages. What an engagement costs depends on what you already have, what you are trying to do, how much of it I run, and how often. Send a brief and you get a written proposal built around it.",
  },
  {
    q: "Do I have to take the whole thing?",
    a: "No. Some businesses want the full strategy, content and ad account run. Others have marketing handled and want the media done properly. I will tell you which parts I think are worth paying for and which are not.",
  },
  {
    q: "Who actually does the work?",
    a: "I do. 508 Filmzz is one person — I build the strategy, direct the creative, run the camera and cut the edit. You deal with me from the first call to delivery, with no account manager in between.",
  },
  {
    q: "What kind of businesses do you work with?",
    a: "Dealerships and automotive companies, construction firms and builders, real estate, and established businesses with a real marketing budget. The common thread is a considered purchase and a customer comparing two or three options before they call.",
  },
  {
    q: "Do you run Meta ads, or just make the creative?",
    a: "Both. Creative built for paid distribution and the campaigns behind it — audiences, testing, and what changes next month based on what performed.",
  },
  {
    q: "Do you travel?",
    a: "Yes. Based in Piedmont, working across South Carolina and the surrounding states. Travel is quoted with the project.",
  },
  {
    q: "How long does production take?",
    a: "Most media is delivered within 3–7 business days of the shoot. Strategy and campaign work runs on its own schedule, agreed before anything starts.",
  },
  {
    q: "Can I use the content anywhere?",
    a: "Yes. Everything is delivered ready for your website, your social channels and your ad account, sized for each.",
  },
];
