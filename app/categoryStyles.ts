// Shared category styling so the archive grid and individual entry pages
// stay visually consistent — one source of truth for what each category
// looks like across the site.
export const CATEGORY_STYLES: Record<string, { label: string; badge: string; glow: string; accent: string }> = {
  character: {
    label: "Character",
    badge: "border-sky-500/40 bg-sky-500/10 text-sky-300",
    glow: "hover:border-sky-500/50 hover:shadow-[0_0_24px_rgba(56,189,248,0.15)]",
    accent: "#38bdf8",
  },
  planet: {
    label: "Planet",
    badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    glow: "hover:border-emerald-500/50 hover:shadow-[0_0_24px_rgba(52,211,153,0.15)]",
    accent: "#34d399",
  },
  species: {
    label: "Species",
    badge: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    glow: "hover:border-amber-500/50 hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]",
    accent: "#f59e0b",
  },
  kyberCrystal: {
    label: "Kyber Crystal",
    badge: "border-violet-500/40 bg-violet-500/10 text-violet-300",
    glow: "hover:border-violet-500/50 hover:shadow-[0_0_24px_rgba(167,139,250,0.15)]",
    accent: "#a78bfa",
  },
  faction: {
    label: "Faction / Organization",
    badge: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
    glow: "hover:border-yellow-500/50 hover:shadow-[0_0_24px_rgba(234,179,8,0.15)]",
    accent: "#eab308",
  },
  vehicle: {
    label: "Vehicle / Ship",
    badge: "border-slate-400/40 bg-slate-400/10 text-slate-300",
    glow: "hover:border-slate-400/50 hover:shadow-[0_0_24px_rgba(148,163,184,0.15)]",
    accent: "#94a3b8",
  },
  technology: {
    label: "Technology / Artifact",
    badge: "border-teal-500/40 bg-teal-500/10 text-teal-300",
    glow: "hover:border-teal-500/50 hover:shadow-[0_0_24px_rgba(20,184,166,0.15)]",
    accent: "#14b8a6",
  },
  event: {
    label: "Event",
    badge: "border-red-500/40 bg-red-500/10 text-red-300",
    glow: "hover:border-red-500/50 hover:shadow-[0_0_24px_rgba(239,68,68,0.15)]",
    accent: "#ef4444",
  },
};

export const DEFAULT_CATEGORY_STYLE = {
  label: "",
  badge: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  glow: "hover:border-zinc-500/50",
  accent: "#71717a",
};

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "character", label: "Character" },
  { value: "planet", label: "Planet" },
  { value: "species", label: "Species" },
  { value: "kyberCrystal", label: "Kyber Crystal" },
  { value: "faction", label: "Faction / Organization" },
  { value: "vehicle", label: "Vehicle / Ship" },
  { value: "technology", label: "Technology / Artifact" },
  { value: "event", label: "Event" },
];

export const ERA_OPTIONS = [
  { value: "all", label: "All Eras" },
  { value: "The Old Republic", label: "The Old Republic" },
  { value: "The High Republic", label: "The High Republic" },
  { value: "Prequel Era", label: "Prequel Era" },
  { value: "Original Trilogy", label: "Original Trilogy" },
  { value: "New Republic", label: "New Republic" },
  { value: "Sequel Era", label: "Sequel Era" },
];

export function categoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;
}
