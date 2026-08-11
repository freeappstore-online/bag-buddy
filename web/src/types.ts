export type Category = "books" | "supplies" | "pe" | "lunch" | "tech" | "other";

export interface ChecklistItem {
  id: string;
  label: string;
  category: Category;
  recurring: boolean;
  emoji: string;
  fromTimetable?: boolean;
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

// ── Event / occasion ──────────────────────────────────────────────────────────

export type EventType =
  | "school"
  | "sports"
  | "sleepover"
  | "daytrip"
  | "swimming"
  | "camping"
  | "holiday"
  | "party"
  | "custom";

export interface EventOption {
  id: EventType;
  label: string;
  emoji: string;
  description: string;
  /** Default items to suggest for this event */
  defaultItems: Array<{ label: string; emoji: string; category: Category }>;
}

export const EVENT_OPTIONS: EventOption[] = [
  {
    id: "school",
    label: "School",
    emoji: "🏫",
    description: "A regular school day",
    defaultItems: [
      { label: "Textbooks", emoji: "📚", category: "books" },
      { label: "Notebook", emoji: "📓", category: "books" },
      { label: "Pencil Case", emoji: "✏️", category: "supplies" },
      { label: "Water Bottle", emoji: "💧", category: "lunch" },
      { label: "Lunch Box", emoji: "🍱", category: "lunch" },
      { label: "Homework", emoji: "📝", category: "books" },
    ],
  },
  {
    id: "sports",
    label: "Sports",
    emoji: "⚽",
    description: "Match, training or sports day",
    defaultItems: [
      { label: "Sports Kit", emoji: "👟", category: "pe" },
      { label: "Water Bottle", emoji: "💧", category: "lunch" },
      { label: "Towel", emoji: "🧺", category: "pe" },
      { label: "Snacks", emoji: "🍌", category: "lunch" },
      { label: "Shin Pads", emoji: "🦵", category: "pe" },
      { label: "Sports Bag", emoji: "🎒", category: "other" },
    ],
  },
  {
    id: "sleepover",
    label: "Sleepover",
    emoji: "🌙",
    description: "Staying at a friend's house",
    defaultItems: [
      { label: "Pyjamas", emoji: "😴", category: "other" },
      { label: "Toothbrush", emoji: "🪥", category: "other" },
      { label: "Change of Clothes", emoji: "👕", category: "other" },
      { label: "Sleeping Bag", emoji: "🛏️", category: "other" },
      { label: "Pillow", emoji: "🛌", category: "other" },
      { label: "Phone Charger", emoji: "🔌", category: "tech" },
    ],
  },
  {
    id: "daytrip",
    label: "Day Trip",
    emoji: "🗺️",
    description: "School trip or day out",
    defaultItems: [
      { label: "Packed Lunch", emoji: "🥪", category: "lunch" },
      { label: "Water Bottle", emoji: "💧", category: "lunch" },
      { label: "Sunscreen", emoji: "🧴", category: "other" },
      { label: "Camera", emoji: "📷", category: "tech" },
      { label: "Spending Money", emoji: "💰", category: "other" },
      { label: "Comfortable Shoes", emoji: "👟", category: "pe" },
    ],
  },
  {
    id: "swimming",
    label: "Swimming",
    emoji: "🏊",
    description: "Pool, lessons or swim club",
    defaultItems: [
      { label: "Swimming Costume", emoji: "🩱", category: "pe" },
      { label: "Towel", emoji: "🧺", category: "pe" },
      { label: "Goggles", emoji: "🥽", category: "pe" },
      { label: "Swim Cap", emoji: "🏊", category: "pe" },
      { label: "Flip Flops", emoji: "🩴", category: "pe" },
      { label: "Shampoo", emoji: "🧴", category: "other" },
    ],
  },
  {
    id: "camping",
    label: "Camping",
    emoji: "⛺",
    description: "Overnight camping trip",
    defaultItems: [
      { label: "Tent", emoji: "⛺", category: "other" },
      { label: "Sleeping Bag", emoji: "🛏️", category: "other" },
      { label: "Torch", emoji: "🔦", category: "other" },
      { label: "Wellies", emoji: "🥾", category: "pe" },
      { label: "Rain Jacket", emoji: "🧥", category: "other" },
      { label: "Bug Spray", emoji: "🦟", category: "other" },
    ],
  },
  {
    id: "holiday",
    label: "Holiday",
    emoji: "✈️",
    description: "Going away on holiday",
    defaultItems: [
      { label: "Passport", emoji: "🛂", category: "other" },
      { label: "Suitcase", emoji: "🧳", category: "other" },
      { label: "Sunscreen", emoji: "🧴", category: "other" },
      { label: "Swimwear", emoji: "🩱", category: "pe" },
      { label: "Chargers", emoji: "🔌", category: "tech" },
      { label: "Spending Money", emoji: "💰", category: "other" },
    ],
  },
  {
    id: "party",
    label: "Party",
    emoji: "🎉",
    description: "Birthday party or celebration",
    defaultItems: [
      { label: "Gift", emoji: "🎁", category: "other" },
      { label: "Party Outfit", emoji: "👗", category: "other" },
      { label: "Card", emoji: "💌", category: "other" },
      { label: "Phone Charger", emoji: "🔌", category: "tech" },
    ],
  },
  {
    id: "custom",
    label: "Something Else",
    emoji: "✨",
    description: "Create your own checklist",
    defaultItems: [],
  },
];

// ── Reward system ─────────────────────────────────────────────────────────────

export interface Reward {
  id: string;
  title: string;
  description: string;
  emoji: string;
  starsRequired: number;
  unlocked: boolean;
}

export interface RewardState {
  totalStars: number;
  rewards: Reward[];
  history: StarEntry[];
}

export interface StarEntry {
  id: string;
  date: string;
  reason: string;
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
