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
    slug: "bratchers-power-washing",
    title: "Bratchers",
    subject: "Bratchers Power Washing",
    category: "commercial",
    year: "2026",
    featured: true,
    summary: "A service commercial that sells on before-and-after, not adjectives.",
    description: [
      "A power-washing company sells a result, so the ad is built around the moment the result appears — the surface changing on camera, not a claim about it.",
      "Cut vertical for paid social with captioned voiceover, a service checklist, and a branded close carrying the phone number and the free-quote offer.",
    ],
    deliverables: ["Vertical commercial", "Before / after edit", "Branded end card"],
    hero: "poster-bratchers",
    gallery: ["poster-bratchers"],
    video: {
      src: "/media/video/bratchers-power-washing.mp4",
      poster: "poster-bratchers",
      aspect: 9 / 16,
      label: "Full commercial",
    },
  },
  {
    slug: "nmf",
    title: "NMF",
    subject: "Naked Metal Fab",
    category: "commercial",
    year: "2026",
    featured: true,
    summary: "A shop feature cut around the work and the person doing it.",
    description: [
      "The longest piece on the site, and the only one built around someone talking. A fabrication shop sells judgement as much as labour, so the owner explaining a job does more than another montage of sparks would.",
      "Cut between sync-sound pieces to camera and the work itself — a painted subframe on the lift, suspension going back together, the truck it all ends up under.",
    ],
    deliverables: ["Sync-sound interview", "Shop coverage", "Vertical edit"],
    hero: "poster-nmf",
    gallery: ["poster-nmf"],
    video: {
      src: "/media/video/nmf-shop.mp4",
      poster: "poster-nmf",
      aspect: 9 / 16,
      label: "Full feature",
    },
  },
  {
    slug: "blueworks",
    title: "BlueWorks",
    subject: "BlueWorks Dumpsters",
    category: "commercial",
    year: "2026",
    featured: true,
    summary: "Fabrication and haulage for a roll-off dumpster company.",
    description: [
      "Two halves of the same business: the welding that keeps the cans in service, and the roll-off truck that puts them on site.",
      "Shot close on the arc, where the light does the work on its own, then wide enough on the truck to read the door and the phone number — which is the point of the piece.",
    ],
    deliverables: ["On-location coverage", "Equipment & fleet", "Vertical edit"],
    hero: "poster-blueworks",
    gallery: ["poster-blueworks"],
    video: {
      src: "/media/video/blueworks-dumpsters.mp4",
      poster: "poster-blueworks",
      aspect: 9 / 16,
      label: "Full edit",
    },
  },
  {
    slug: "night-wash",
    title: "Night Wash",
    subject: "Bratchers Power Washing",
    category: "commercial",
    year: "2026",
    featured: false,
    summary: "Overnight service coverage, shot on location while the work happened.",
    description: [
      "Commercial cleaning happens after closing, so the shoot happens after closing. Lit almost entirely by the canopy overhead, with the wet concrete doing most of the work as a reflector.",
      "Coverage of the crew mid-job rather than a staged setup — the version a customer believes.",
    ],
    deliverables: ["On-location coverage", "Low-light shooting", "Vertical edit"],
    hero: "poster-night-wash",
    gallery: ["poster-night-wash"],
    video: {
      src: "/media/video/bratchers-night-wash.mp4",
      poster: "poster-night-wash",
      aspect: 9 / 16,
      label: "Full edit",
    },
  },
  {
    slug: "ram-2500",
    title: "RAM 2500",
    subject: "RAM 2500 on Forged Wheels",
    category: "automotive",
    year: "2026",
    featured: true,
    summary: "Static hero frames on a timber bridge, then rolling coverage at dusk.",
    description: [
      "A black RAM 2500 on polished forged wheels, shot as two halves: locked-off hero frames on an open timber bridge while the light was still soft, then rolling coverage once it dropped.",
      "The tracking pass is the point. A truck parked is a photograph; a truck moving is the reason the wheels and the stance were worth paying for.",
    ],
    deliverables: ["Rolling & tracking shots", "Static hero frames", "Vertical edit"],
    hero: "poster-ram",
    gallery: ["poster-ram"],
    video: {
      src: "/media/video/ram-2500.mp4",
      poster: "poster-ram",
      aspect: 9 / 16,
      label: "Full edit",
    },
  },
  {
    slug: "g-class",
    title: "G-Class",
    subject: "Mercedes-Benz G-Class",
    category: "automotive",
    year: "2026",
    featured: true,
    summary: "Detail coverage of a G-Class under controlled indoor light.",
    description: [
      "Shot indoors against a plain wall, where the light can be controlled rather than negotiated with. The G-Class is all hard edges and right angles, so the coverage works close — headlight, brush guard, spare carrier, badge.",
      "Detail work like this is what fills the gaps between the hero shots in a longer cut, and stands on its own as social content.",
    ],
    deliverables: ["Detail & macro coverage", "Studio lighting", "Vertical edit"],
    hero: "poster-g-wagon",
    gallery: ["poster-g-wagon"],
    video: {
      src: "/media/video/g-wagon.mp4",
      poster: "poster-g-wagon",
      aspect: 9 / 16,
      label: "Full edit",
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
      "Shot across three conditions on purpose — flat overcast for the hardware detail, sunset for the hero frames, and rain at night for the ones that stop a thumb. Finished cool and deep so the white paint holds its shape instead of washing out.",
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
    category: "commercial",
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
    category: "commercial",
    year: "2026",
    summary: "Macro work on billet and coil, lit for material rather than product.",
    description: [
      "Component detail treated like still life. A machined housing shot dead-on to show the tooling marks, and a coil spring lit until the metal reads as something closer to jewellery.",
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
