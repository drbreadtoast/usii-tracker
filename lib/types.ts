export type Category =
  | "headlines"
  | "us-politics"
  | "foreign"
  | "markets"
  | "ai-tech"
  | "war"
  | "underreported";

export type Lean =
  | "left"
  | "center"
  | "right"
  | "foreign-western"
  | "foreign-eastern"
  | "foreign-global-south"
  | "government"
  | "social";

export type AllSidesRating =
  | "left"
  | "lean-left"
  | "center"
  | "lean-right"
  | "right"
  | "mixed"
  | null;

export interface Source {
  outlet: string;
  url: string;
  title: string;
  publishedAt: string;
  allSidesRating?: AllSidesRating;
  isStateMedia?: boolean;
}

export interface Perspective {
  lean: Lean;
  summary: string;
  keyFraming: string;
  sources: Source[];
}

export interface Story {
  id: string;
  headline: string;
  summary: string;
  category: Category;
  importance: 1 | 2 | 3 | 4 | 5;
  perspectives: Perspective[];
  firstSeenAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface Section {
  sectionId: Category;
  lastUpdated: string;
  stories: Story[];
}

export interface SectionMeta {
  lastUpdated: string;
  storyCount: number;
}

export interface Manifest {
  lastUpdated: string;
  buildId?: string;
  sections: Record<Exclude<Category, never>, SectionMeta>;
}

export const ALL_CATEGORIES: Category[] = [
  "headlines",
  "us-politics",
  "foreign",
  "markets",
  "ai-tech",
  "war",
  "underreported",
];

export const SECTION_LABELS: Record<Category, string> = {
  headlines: "Top Stories",
  "us-politics": "US Politics",
  foreign: "Foreign Affairs",
  markets: "Markets & Economy",
  "ai-tech": "AI & Tech",
  war: "War & Conflict",
  underreported: "Underreported",
};

export const SECTION_DESCRIPTIONS: Record<Category, string> = {
  headlines: "The most important stories of the day, across all categories.",
  "us-politics":
    "US domestic politics covered from left, center, right, and government perspectives.",
  foreign:
    "World affairs covered from Western, Eastern, and Global South outlets.",
  markets:
    "Energy, equities, crypto, metals, and the macro story behind the prices.",
  "ai-tech":
    "AI, semiconductors, regulation, labor impact, and the tech industry.",
  war: "Active armed conflicts and the diplomatic actions around them.",
  underreported:
    "Stories covered abroad or by smaller outlets but missing from major US front pages.",
};

export const LEAN_LABELS: Record<Lean, string> = {
  left: "Left",
  center: "Center",
  right: "Right",
  "foreign-western": "Foreign — Western",
  "foreign-eastern": "Foreign — Eastern",
  "foreign-global-south": "Foreign — Global South",
  government: "Government",
  social: "Social",
};

export const LEAN_ORDER: Lean[] = [
  "left",
  "center",
  "right",
  "foreign-western",
  "foreign-eastern",
  "foreign-global-south",
  "government",
  "social",
];
