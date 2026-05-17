import type { AllSidesRating, Lean } from "./types";

export interface OutletInfo {
  name: string;
  homepage: string;
  allSidesRating: AllSidesRating;
  primaryLean: Lean;
  country: string;
  isStateMedia?: boolean;
  notes?: string;
}

export const OUTLETS: OutletInfo[] = [
  // LEFT (US)
  { name: "MSNBC", homepage: "https://www.msnbc.com", allSidesRating: "left", primaryLean: "left", country: "US" },
  { name: "CNN", homepage: "https://www.cnn.com", allSidesRating: "left", primaryLean: "left", country: "US" },
  { name: "The New York Times", homepage: "https://www.nytimes.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "Vox", homepage: "https://www.vox.com", allSidesRating: "left", primaryLean: "left", country: "US" },
  { name: "HuffPost", homepage: "https://www.huffpost.com", allSidesRating: "left", primaryLean: "left", country: "US" },
  { name: "Mother Jones", homepage: "https://www.motherjones.com", allSidesRating: "left", primaryLean: "left", country: "US" },
  { name: "The Guardian", homepage: "https://www.theguardian.com", allSidesRating: "lean-left", primaryLean: "left", country: "UK" },

  // LEAN LEFT (US)
  { name: "NPR", homepage: "https://www.npr.org", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "ABC News", homepage: "https://abcnews.go.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "NBC News", homepage: "https://www.nbcnews.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "CBS News", homepage: "https://www.cbsnews.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "The Washington Post", homepage: "https://www.washingtonpost.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "Bloomberg", homepage: "https://www.bloomberg.com", allSidesRating: "lean-left", primaryLean: "center", country: "US" },
  { name: "Politico", homepage: "https://www.politico.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },
  { name: "The Atlantic", homepage: "https://www.theatlantic.com", allSidesRating: "lean-left", primaryLean: "left", country: "US" },

  // CENTER
  { name: "Reuters", homepage: "https://www.reuters.com", allSidesRating: "center", primaryLean: "center", country: "UK" },
  { name: "Associated Press", homepage: "https://apnews.com", allSidesRating: "center", primaryLean: "center", country: "US" },
  { name: "BBC", homepage: "https://www.bbc.com", allSidesRating: "center", primaryLean: "foreign-western", country: "UK" },
  { name: "The Hill", homepage: "https://thehill.com", allSidesRating: "center", primaryLean: "center", country: "US" },
  { name: "USA Today", homepage: "https://www.usatoday.com", allSidesRating: "lean-left", primaryLean: "center", country: "US" },
  { name: "Christian Science Monitor", homepage: "https://www.csmonitor.com", allSidesRating: "center", primaryLean: "center", country: "US" },
  { name: "Axios", homepage: "https://www.axios.com", allSidesRating: "center", primaryLean: "center", country: "US" },

  // LEAN RIGHT
  { name: "The Wall Street Journal", homepage: "https://www.wsj.com", allSidesRating: "lean-right", primaryLean: "right", country: "US" },
  { name: "Washington Examiner", homepage: "https://www.washingtonexaminer.com", allSidesRating: "lean-right", primaryLean: "right", country: "US" },
  { name: "Reason", homepage: "https://reason.com", allSidesRating: "lean-right", primaryLean: "right", country: "US" },
  { name: "The Dispatch", homepage: "https://thedispatch.com", allSidesRating: "lean-right", primaryLean: "right", country: "US" },

  // RIGHT
  { name: "Fox News", homepage: "https://www.foxnews.com", allSidesRating: "right", primaryLean: "right", country: "US" },
  { name: "New York Post", homepage: "https://nypost.com", allSidesRating: "right", primaryLean: "right", country: "US" },
  { name: "Daily Wire", homepage: "https://www.dailywire.com", allSidesRating: "right", primaryLean: "right", country: "US" },
  { name: "Daily Caller", homepage: "https://dailycaller.com", allSidesRating: "right", primaryLean: "right", country: "US" },
  { name: "Washington Times", homepage: "https://www.washingtontimes.com", allSidesRating: "right", primaryLean: "right", country: "US" },
  { name: "National Review", homepage: "https://www.nationalreview.com", allSidesRating: "right", primaryLean: "right", country: "US" },

  // FOREIGN — WESTERN
  { name: "Deutsche Welle", homepage: "https://www.dw.com", allSidesRating: null, primaryLean: "foreign-western", country: "Germany" },
  { name: "Le Monde", homepage: "https://www.lemonde.fr", allSidesRating: null, primaryLean: "foreign-western", country: "France" },
  { name: "The Telegraph", homepage: "https://www.telegraph.co.uk", allSidesRating: null, primaryLean: "foreign-western", country: "UK" },
  { name: "The Times (UK)", homepage: "https://www.thetimes.co.uk", allSidesRating: null, primaryLean: "foreign-western", country: "UK" },
  { name: "Haaretz", homepage: "https://www.haaretz.com", allSidesRating: null, primaryLean: "foreign-western", country: "Israel" },
  { name: "The Jerusalem Post", homepage: "https://www.jpost.com", allSidesRating: null, primaryLean: "foreign-western", country: "Israel" },
  { name: "Financial Times", homepage: "https://www.ft.com", allSidesRating: "center", primaryLean: "foreign-western", country: "UK" },

  // FOREIGN — EASTERN (state media labeled)
  { name: "RT", homepage: "https://www.rt.com", allSidesRating: null, primaryLean: "foreign-eastern", country: "Russia", isStateMedia: true },
  { name: "Xinhua", homepage: "https://english.news.cn", allSidesRating: null, primaryLean: "foreign-eastern", country: "China", isStateMedia: true },
  { name: "CGTN", homepage: "https://www.cgtn.com", allSidesRating: null, primaryLean: "foreign-eastern", country: "China", isStateMedia: true },
  { name: "Sputnik", homepage: "https://sputnikglobe.com", allSidesRating: null, primaryLean: "foreign-eastern", country: "Russia", isStateMedia: true },
  { name: "TASS", homepage: "https://tass.com", allSidesRating: null, primaryLean: "foreign-eastern", country: "Russia", isStateMedia: true },
  { name: "Global Times", homepage: "https://www.globaltimes.cn", allSidesRating: null, primaryLean: "foreign-eastern", country: "China", isStateMedia: true },

  // FOREIGN — GLOBAL SOUTH
  { name: "Al Jazeera", homepage: "https://www.aljazeera.com", allSidesRating: null, primaryLean: "foreign-global-south", country: "Qatar" },
  { name: "The Hindu", homepage: "https://www.thehindu.com", allSidesRating: null, primaryLean: "foreign-global-south", country: "India" },
  { name: "Times of India", homepage: "https://timesofindia.indiatimes.com", allSidesRating: null, primaryLean: "foreign-global-south", country: "India" },
  { name: "South China Morning Post", homepage: "https://www.scmp.com", allSidesRating: null, primaryLean: "foreign-global-south", country: "Hong Kong" },
  { name: "Mehr News", homepage: "https://en.mehrnews.com", allSidesRating: null, primaryLean: "foreign-global-south", country: "Iran", isStateMedia: true },
  { name: "Folha de S.Paulo", homepage: "https://www1.folha.uol.com.br", allSidesRating: null, primaryLean: "foreign-global-south", country: "Brazil" },
  { name: "Daily Nation", homepage: "https://nation.africa", allSidesRating: null, primaryLean: "foreign-global-south", country: "Kenya" },

  // GOVERNMENT
  { name: "White House", homepage: "https://www.whitehouse.gov", allSidesRating: null, primaryLean: "government", country: "US" },
  { name: "US State Department", homepage: "https://www.state.gov", allSidesRating: null, primaryLean: "government", country: "US" },
  { name: "US Department of Defense", homepage: "https://www.defense.gov", allSidesRating: null, primaryLean: "government", country: "US" },
  { name: "Federal Reserve", homepage: "https://www.federalreserve.gov", allSidesRating: null, primaryLean: "government", country: "US" },
];

export function findOutlet(name: string): OutletInfo | undefined {
  const normalized = name.trim().toLowerCase();
  return OUTLETS.find(
    (o) =>
      o.name.toLowerCase() === normalized ||
      o.name.toLowerCase().replace(/^the\s+/, "") === normalized.replace(/^the\s+/, ""),
  );
}

export function outletsForLean(lean: Lean): OutletInfo[] {
  return OUTLETS.filter((o) => o.primaryLean === lean);
}
