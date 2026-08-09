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
