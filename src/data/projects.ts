/**
 * Portfolio data.
 *
 * Every `hero`/`gallery` entry is a key in `media.generated.json`, produced by
 * `npm run media` from the source photo folder. To add new work: drop files in
 * the source folder, run the script, then add a project (or extend a gallery)
 * here — the grids, filters, search, lightbox, and category pages all read from
 * this file.
 */

export type CategoryId =
  | "automotive"
  | "commercial"
  | "drone"
  | "photography"
  | "social";

export type Project = {
  slug: string;
  title: string;
  subject: string;
  category: CategoryId;
  year: string;
  /** Short line used on cards and in search. */
  summary: string;
  /** Long-form copy for the project page. */
  description: string[];
  deliverables: string[];
  hero: string;
  gallery: string[];
  video?: {
    src: string;
    poster: string;
    /** Aspect ratio as width/height — the films are vertical. */
    aspect: number;
    label: string;
  };
  featured?: boolean;
};

export const categories: {
  id: CategoryId;
  label: string;
  href: string;
  eyebrow: string;
  headline: string;
  blurb: string;
}[] = [
  {
    id: "automotive",
    label: "Automotive",
    href: "/automotive",
    eyebrow: "Vertical 01",
    headline: "Automotive",
    blurb:
      "Builds, exotics, and heavy metal — shot like a launch film and cut like a trailer.",
  },
  {
    id: "commercial",
    label: "Commercial",
    href: "/commercial",
    eyebrow: "Vertical 02",
    headline: "Commercial",
    blurb:
      "Brand films and service campaigns that make a working business look national.",
  },
  {
    id: "drone",
    label: "Drone",
    href: "/drone",
    eyebrow: "Vertical 03",
    headline: "Drone",
    blurb:
      "Aerial reveals, establishing shots, and top-down movement that give a build real scale.",
  },
  {
    id: "photography",
    label: "Photography",
    href: "/photography",
    eyebrow: "Vertical 04",
    headline: "Photography",
    blurb:
      "Commercial stills that carry the same lighting and grade as the film they ship with.",
  },
  {
    id: "social",
    label: "Social Media",
    href: "/social-media",
    eyebrow: "Vertical 05",
    headline: "Social Media",
    blurb:
      "Vertical-first cutdowns built for retention on Reels, TikTok, and Shorts.",
  },
];

export const projects: Project[] = [
  {
    slug: "vertical-cutdowns",
    title: "Vertical Cutdowns",
    subject: "Mobile Detail Campaign",
    category: "social",
    year: "2026",
    featured: true,
    summary: "A full detail film cut vertical for Reels, TikTok, and Shorts.",
    description: [
      "A complete detail shot as one continuous move — foam, contact, reveal — so the process reads as a single piece of craft rather than a list of steps.",
      "Framed 9:16 from the start rather than cropped down afterwards, which is the difference between content that was made for the feed and content that was squeezed into it.",
    ],
    deliverables: ["Vertical hero film", "Reels & TikTok cutdowns", "Detail stills"],
    hero: "poster-showreel",
    gallery: ["poster-showreel", "poster-reel-loop"],
    video: {
      src: "/media/video/showreel.mp4",
      poster: "poster-showreel",
      aspect: 9 / 16,
      label: "Full film",
    },
  },
  {
    slug: "super-duty",
    title: "Super Duty",
    subject: "Lifted Ford F-250 / F-350 Program",
    category: "automotive",
    year: "2026",
    featured: true,
    summary: "A full build program shot across daylight, sunset, and rain.",
    description: [
      "Twelve frames covering the same program from every angle a buyer cares about: the stance from the front, the badge work up close, the wheel and suspension hardware underneath, and the whole truck sitting in its lot at last light.",
      "Shot across three conditions on purpose — flat overcast for the hardware detail, sunset for the hero frames, and rain at night for the ones that stop a thumb. Graded cool and deep so the white paint holds shape instead of blowing out.",
    ],
    deliverables: ["Hero stills", "Hardware detail set", "Night / rain frames"],
    hero: "pf_img_5850",
    gallery: [
      "pf_img_5850",
      "pf_img_5849",
      "pf_img_5853",
      "pf_img_5854",
      "pf_img_5855",
      "pf_img_5851",
      "pf_img_5852",
      "pf_img_5856",
      "pf_img_5857",
      "pf_img_5858",
      "pf_img_5859",
      "pf_img_5848",
    ],
  },
  {
    slug: "deep-creek",
    title: "Deep Creek",
    subject: "Deep Creek Marine Customs",
    category: "commercial",
    year: "2026",
    featured: true,
    summary: "Product-in-water coverage for a custom boat builder.",
    description: [
      "A full brand set for a custom marine shop, shot where the boats actually live. Deck texture and laser-etched branding up close, rigged gear in the shallows, and the hull running wide open with the spray still in the air.",
      "The rule for the set was that nothing gets photographed on a stand. Every frame is on the water or on the trailer, in the light the day gave.",
    ],
    deliverables: ["Deck & branding detail", "Rigged product stills", "Running footage frames"],
    hero: "pf_img_5838",
    gallery: [
      "pf_img_5838",
      "pf_img_5823",
      "pf_img_5824",
      "pf_img_5815",
      "pf_img_5816",
      "pf_img_5837",
      "pf_img_5840",
      "pf_img_5841",
      "pf_img_5836",
      "pf_img_5839",
    ],
  },
  {
    slug: "season",
    title: "Season",
    subject: "Waterfowl & Wild Country",
    category: "photography",
    year: "2026",
    featured: true,
    summary: "A full season documented from blind to last light.",
    description: [
      "Field coverage across a whole waterfowl season — the blind on the water before light, the walk out with a limit, the spread laid out in the leaves, and the country it all happens in.",
      "The wildlife frames are the ones that take the most waiting. Two red fox mid-scuffle on open asphalt, cypress standing in black water under a clear night sky, and a lake burning down to nothing at the end of the day.",
    ],
    deliverables: ["Field coverage", "Wildlife frames", "Landscape set"],
    hero: "pf_img_5813",
    gallery: [
      "pf_img_5813",
      "pf_img_5842",
      "pf_img_5818",
      "pf_img_5843",
      "pf_img_5847",
      "pf_img_5835",
      "pf_img_5819",
      "pf_img_5825",
    ],
  },
  {
    slug: "long-haul",
    title: "Long Haul",
    subject: "Owner-Operator Trucking",
    category: "commercial",
    year: "2026",
    featured: true,
    summary: "Chrome under blue sky, then the same rigs lit only by their own lights.",
    description: [
      "A recruiting and brand set built around one contrast: a Kenworth polished and parked under an open sky by day, and the same yard after dark with nothing but marker lights and headlamps doing the work.",
      "The night frames are the ones that earn the job. They turn a working truck into a landmark, and they are the frames that get shared.",
    ],
    deliverables: ["Fleet stills", "Night hero frames", "Recruiting cutdowns"],
    hero: "pf_img_5834",
    gallery: [
      "pf_img_5834",
      "pf_img_5833",
      "pf_img_5832",
      "pf_img_5831",
      "pf_img_5820",
    ],
  },
  {
    slug: "shop-floor",
    title: "Shop Floor",
    subject: "Performance Fabrication",
    category: "commercial",
    year: "2026",
    summary: "A working shop shot as texture, hardware, and one finished car.",
    description: [
      "Inside a live performance shop: raw billet on the bench, jack stands and tooling laid out across the floor, and a Dark Horse sitting finished under the lights at the end of it.",
      "Available light only. The bay is the set, and the grade leans cool so the aluminium and concrete stay honest.",
    ],
    deliverables: ["Process stills", "Facility set", "Finished-car frame"],
    hero: "pf_img_5860",
    gallery: ["pf_img_5860", "pf_img_5862", "pf_img_5863"],
  },
  {
    slug: "precision",
    title: "Precision",
    subject: "Machined Components",
    category: "photography",
    year: "2026",
    summary: "Macro work on billet and coil, lit for material rather than product.",
    description: [
      "Component photography treated like still life. A machined housing shot dead-on to show tooling marks, and a coil spring lit through teal gel until the metal reads as something closer to glass.",
      "Deliberately abstract — these are the frames a supplier uses when the part itself has to look engineered rather than merely photographed.",
    ],
    deliverables: ["Macro component set", "Material studies"],
    hero: "pf_img_5829",
    gallery: ["pf_img_5829", "pf_img_5828"],
  },
  {
    slug: "midnight-silverado",
    title: "Midnight",
    subject: "Chevrolet Silverado",
    category: "automotive",
    year: "2026",
    summary: "A lowered Silverado shot after hours in an empty deck.",
    description: [
      "Three frames, one location, no daylight. A parking deck after close, the truck lit by its own underglow and the ceiling fixtures, and nothing else moving.",
      "Kept deliberately dark. The blacks stay black, the red stays saturated, and the only detail that survives is the detail worth keeping.",
    ],
    deliverables: ["Night hero frames", "Badge detail"],
    hero: "pf_img_5845",
    gallery: ["pf_img_5845", "pf_img_5844", "pf_img_5846"],
  },
  {
    slug: "denali",
    title: "Denali",
    subject: "GMC Sierra Denali",
    category: "automotive",
    year: "2026",
    summary: "Shop-day coverage of a clean Denali on the wash pad.",
    description: [
      "Straightforward client work: the truck fresh off the wash pad, shot square to the building so the stance and the grille read immediately.",
      "Overcast light, which for a white truck on a grey lot is the easiest day you can ask for.",
    ],
    deliverables: ["Hero stills", "Shop-day coverage"],
    hero: "pf_img_5830",
    gallery: ["pf_img_5830", "pf_img_5821"],
  },
];

export function projectsByCategory(id: CategoryId) {
  return projects.filter((p) => p.category === id);
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function relatedProjects(project: Project, count = 3) {
  const sameCategory = projects.filter(
    (p) => p.category === project.category && p.slug !== project.slug
  );
  const others = projects.filter(
    (p) => p.category !== project.category && p.slug !== project.slug
  );
  return [...sameCategory, ...others].slice(0, count);
}

/** Flat list of every image in the portfolio, for the gallery + lightbox. */
export function allGalleryItems() {
  const seen = new Set<string>();
  const items: { media: string; project: Project }[] = [];
  for (const project of projects) {
    for (const media of project.gallery) {
      const key = `${project.slug}:${media}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ media, project });
    }
  }
  return items;
}
