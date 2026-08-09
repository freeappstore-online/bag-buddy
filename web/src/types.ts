export type Category = "books" | "supplies" | "pe" | "lunch" | "tech" | "other";

export interface ChecklistItem {
  id: string;
  label: string;
  category: Category;
  recurring: boolean;
  emoji: string;
}

export interface DayState {
  date: string; // YYYY-MM-DD
  checked: string[]; // item ids
}

export interface Subject {
  label: string;
  emoji: string;
  suggestedItems?: string[];
}

export interface DaySchedule {
  subjects: Subject[];
  extraItems?: string[];
  dayOff?: boolean;
}

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export interface SchoolSettings {
  schoolName: string;
  studentName: string;
  schedule: Partial<Record<WeekDay, DaySchedule>>;
}

export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: "",
  studentName: "",
  schedule: {},
};

// ── Reward system ─────────────────────────────────────────────────────────────

export interface Reward {
  id: string;
  title: string;
  description: string;
  emoji: string;
  starsRequired: number; // how many stars needed to unlock
  unlocked: boolean;     // parent marks as given
}

export interface RewardState {
  totalStars: number;       // accumulated stars
  rewards: Reward[];
  history: StarEntry[];     // log of star events
}

export interface StarEntry {
  id: string;
  date: string;        // YYYY-MM-DD
  reason: string;      // e.g. "Packed bag perfectly!"
  stars: number;
}

export const DEFAULT_REWARD_STATE: RewardState = {
  totalStars: 0,
  rewards: [
    {
      id: "r1",
      title: "Extra Screen Time",
      description: "30 minutes of extra screen time!",
      emoji: "📱",
      starsRequired: 5,
      unlocked: false,
    },
    {
      id: "r2",
      title: "Choose Dinner",
      description: "Pick whatever you want for dinner tonight!",
      emoji: "🍕",
      starsRequired: 10,
      unlocked: false,
    },
    {
      id: "r3",
      title: "Movie Night",
      description: "Pick a movie for family movie night!",
      emoji: "🎬",
      starsRequired: 20,
      unlocked: false,
    },
  ],
  history: [],
};
