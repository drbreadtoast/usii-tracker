import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  Category,
  Manifest,
  Section,
  StatementsFile,
  Story,
} from "./types";
import { ALL_CATEGORIES } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getManifest(): Promise<Manifest> {
  return readJsonFile<Manifest>("manifest.json");
}

export async function getSection(category: Category): Promise<Section> {
  return readJsonFile<Section>(`${category}.json`);
}

export async function getStatements(): Promise<StatementsFile> {
  return readJsonFile<StatementsFile>("statements.json");
}

export async function getAllSections(): Promise<Record<Category, Section>> {
  const entries = await Promise.all(
    ALL_CATEGORIES.map(async (cat) => [cat, await getSection(cat)] as const),
  );
  return Object.fromEntries(entries) as Record<Category, Section>;
}

export async function getHomepageData(): Promise<{
  manifest: Manifest;
  sections: Record<Category, Section>;
}> {
  const [manifest, sections] = await Promise.all([
    getManifest(),
    getAllSections(),
  ]);
  return { manifest, sections };
}

export function topStoriesByImportance(stories: Story[], limit = 5): Story[] {
  return [...stories]
    .sort((a, b) => {
      if (b.importance !== a.importance) return b.importance - a.importance;
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    })
    .slice(0, limit);
}

export function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 1000 / 60 / 60;
}

export function formatTimestamp(iso: string, tz = "America/New_York"): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
