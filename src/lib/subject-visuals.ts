import {
  Calculator,
  Shapes,
  FlaskConical,
  Atom,
  Dna,
  BookOpenText,
  SpellCheck2,
  Library,
  Landmark,
  Globe2,
  Code2,
  Terminal,
  FileCode2,
  Globe,
  Bot,
  BrainCircuit,
  Palette,
  Brush,
  Music2,
  Mic2,
  TrendingUp,
  Leaf,
  Languages,
  Puzzle,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export interface SubjectTheme {
  icon: LucideIcon;
  bg: string; // soft tinted background for badges/icons
  text: string; // matching readable text color
  solid: string; // vivid solid background (e.g. chip when active)
  cover: string; // gradient background for illustrated course covers
  cardGradient: string; // soft pastel gradient for featured subject cards
  ring: string;
}

const THEMES = {
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    solid: "bg-rose-500",
    cover: "bg-gradient-to-br from-rose-400 to-rose-600",
    cardGradient: "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200",
    ring: "ring-rose-200",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    solid: "bg-orange-500",
    cover: "bg-gradient-to-br from-orange-400 to-orange-600",
    cardGradient: "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200",
    ring: "ring-orange-200",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    solid: "bg-amber-500",
    cover: "bg-gradient-to-br from-amber-400 to-amber-600",
    cardGradient: "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200",
    ring: "ring-amber-200",
  },
  lime: {
    bg: "bg-lime-100",
    text: "text-lime-700",
    solid: "bg-lime-500",
    cover: "bg-gradient-to-br from-lime-400 to-lime-600",
    cardGradient: "bg-gradient-to-br from-lime-50 via-lime-100 to-lime-200",
    ring: "ring-lime-200",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    solid: "bg-emerald-500",
    cover: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    cardGradient: "bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200",
    ring: "ring-emerald-200",
  },
  teal: {
    bg: "bg-teal-100",
    text: "text-teal-600",
    solid: "bg-teal-500",
    cover: "bg-gradient-to-br from-teal-400 to-teal-600",
    cardGradient: "bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200",
    ring: "ring-teal-200",
  },
  cyan: {
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    solid: "bg-cyan-500",
    cover: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    cardGradient: "bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-200",
    ring: "ring-cyan-200",
  },
  sky: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    solid: "bg-sky-500",
    cover: "bg-gradient-to-br from-sky-400 to-sky-600",
    cardGradient: "bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200",
    ring: "ring-sky-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    solid: "bg-blue-500",
    cover: "bg-gradient-to-br from-blue-400 to-blue-600",
    cardGradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200",
    ring: "ring-blue-200",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    solid: "bg-violet-500",
    cover: "bg-gradient-to-br from-violet-400 to-violet-600",
    cardGradient: "bg-gradient-to-br from-violet-50 via-violet-100 to-violet-200",
    ring: "ring-violet-200",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    solid: "bg-purple-500",
    cover: "bg-gradient-to-br from-purple-400 to-purple-600",
    cardGradient: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200",
    ring: "ring-purple-200",
  },
  fuchsia: {
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-600",
    solid: "bg-fuchsia-500",
    cover: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
    cardGradient: "bg-gradient-to-br from-fuchsia-50 via-fuchsia-100 to-fuchsia-200",
    ring: "ring-fuchsia-200",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    solid: "bg-pink-500",
    cover: "bg-gradient-to-br from-pink-400 to-pink-600",
    cardGradient: "bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200",
    ring: "ring-pink-200",
  },
} as const;

type ThemeKey = keyof typeof THEMES;

const SUBJECT_MAP: Record<string, { icon: LucideIcon; theme: ThemeKey }> = {
  Mathematics: { icon: Calculator, theme: "blue" },
  Algebra: { icon: Calculator, theme: "sky" },
  Geometry: { icon: Shapes, theme: "cyan" },
  Science: { icon: FlaskConical, theme: "emerald" },
  Physics: { icon: Atom, theme: "violet" },
  Chemistry: { icon: FlaskConical, theme: "purple" },
  Biology: { icon: Dna, theme: "lime" },
  English: { icon: BookOpenText, theme: "rose" },
  Grammar: { icon: SpellCheck2, theme: "pink" },
  Literature: { icon: Library, theme: "fuchsia" },
  History: { icon: Landmark, theme: "amber" },
  Geography: { icon: Globe2, theme: "teal" },
  "Computer Science": { icon: Terminal, theme: "blue" },
  Programming: { icon: FileCode2, theme: "sky" },
  Python: { icon: Code2, theme: "cyan" },
  "Web Development": { icon: Globe, theme: "violet" },
  Robotics: { icon: Bot, theme: "orange" },
  "Artificial Intelligence": { icon: BrainCircuit, theme: "purple" },
  Art: { icon: Palette, theme: "fuchsia" },
  Drawing: { icon: Brush, theme: "pink" },
  Music: { icon: Music2, theme: "rose" },
  Coding: { icon: Code2, theme: "blue" },
  "Public Speaking": { icon: Mic2, theme: "orange" },
  Economics: { icon: TrendingUp, theme: "emerald" },
  "Environmental Science": { icon: Leaf, theme: "lime" },
  French: { icon: Languages, theme: "sky" },
  Spanish: { icon: Languages, theme: "amber" },
  "Logical Reasoning": { icon: Puzzle, theme: "violet" },
  "Competitive Exams": { icon: Trophy, theme: "amber" },
};

const FALLBACK: { icon: LucideIcon; theme: ThemeKey } = { icon: BookOpenText, theme: "blue" };

export function getSubjectVisual(subject: string): SubjectTheme {
  const entry = SUBJECT_MAP[subject] ?? FALLBACK;
  return { icon: entry.icon, ...THEMES[entry.theme] };
}

export const SUBJECT_THEME_KEYS = Object.keys(THEMES) as ThemeKey[];
