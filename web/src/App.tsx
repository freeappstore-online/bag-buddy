import { useState, useEffect, useCallback } from "react";
import { Shell } from "./components/Shell";
import { Checklist } from "./components/Checklist";
import { ManageItems } from "./components/ManageItems";
import { Settings } from "./components/Settings";
import { BuddyMascot } from "./components/BuddyMascot";
import type { ChecklistItem, DayState, SchoolSettings, WeekDay } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export type { ChecklistItem };
export type { SchoolSettings };
export type { WeekDay };
export type Category = "books" | "supplies" | "pe" | "lunch" | "tech" | "other";

export const CATEGORY_COLORS: Record<Category, string> = {
  books: "#6366f1",
  supplies: "#f59e0b",
  pe: "#10b981",
  lunch: "#f97316",
  tech: "#3b82f6",
  other: "#ec4899",
};

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: "item_1", label: "Textbooks", category: "books", recurring: true, emoji: "📚" },
  { id: "item_2", label: "Notebook", category: "books", recurring: true, emoji: "📓" },
  { id: "item_3", label: "Pencil Case", category: "supplies", recurring: true, emoji: "✏️" },
  { id: "item_4", label: "Water Bottle", category: "lunch", recurring: true, emoji: "💧" },
  { id: "item_5", label: "Lunch Box", category: "lunch", recurring: true, emoji: "🍱" },
  { id: "item_6", label: "Calculator", category: "supplies", recurring: false, emoji: "🧮" },
  { id: "item_7", label: "PE Kit", category: "pe", recurring: false, emoji: "👟" },
  { id: "item_8", label: "Headphones", category: "tech", recurring: false, emoji: "🎧" },
  { id: "item_9", label: "Charger", category: "tech", recurring: false, emoji: "🔌" },
  { id: "item_10", label: "Homework", category: "books", recurring: true, emoji: "📝" },
];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getTodayWeekDay(): WeekDay | null {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = days[new Date().getDay()];
  if (d === "Sunday" || d === "Saturday") return null;
  return d as WeekDay;
}

type View = "checklist" | "manage" | "settings";

export default function App() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem("bagbuddy_items");
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  const [dayState, setDayState] = useState<DayState>(() => {
    const saved = localStorage.getItem("bagbuddy_day");
    const today = getTodayStr();
    if (saved) {
      const parsed: DayState = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    return { date: today, checked: [] };
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem("bagbuddy_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [view, setView] = useState<View>("checklist");
  const [celebrating, setCelebrating] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    localStorage.setItem("bagbuddy_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_day", JSON.stringify(dayState));
  }, [dayState]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_settings", JSON.stringify(settings));
  }, [settings]);

  // Merge timetable-suggested items for today into the active list
  const todayWeekDay = getTodayWeekDay();
  const todaySchedule = todayWeekDay ? settings.schedule[todayWeekDay] : undefined;
  const todaySubjectItems: string[] = todaySchedule && !todaySchedule.dayOff
    ? Array.from(new Set(todaySchedule.subjects.flatMap((s) => s.suggestedItems ?? [])))
    : [];

  // Build today's effective item list: base items + any timetable suggestions not already present
  const effectiveItems: ChecklistItem[] = [
    ...items,
    ...todaySubjectItems
      .filter((label) => !items.some((i) => i.label === label))
      .map((label, idx) => ({
        id: `timetable_${idx}_${label.replace(/\s/g, "_")}`,
        label,
        category: "other" as Category,
        recurring: false,
        emoji: "📋",
        fromTimetable: true,
      })),
  ];

  const toggleItem = useCallback((id: string) => {
    setDayState((prev) => {
      const isChecked = prev.checked.includes(id);
      const newChecked = isChecked
        ? prev.checked.filter((c) => c !== id)
        : [...prev.checked, id];
      return { ...prev, checked: newChecked };
    });
  }, []);

  const totalItems = effectiveItems.length;
  const checkedCount = dayState.checked.filter((id) =>
    effectiveItems.some((i) => i.id === id)
  ).length;
  const allDone = totalItems > 0 && checkedCount === totalItems;

  useEffect(() => {
    if (allDone && !justCompleted) {
      setCelebrating(true);
      setJustCompleted(true);
      const t = setTimeout(() => setCelebrating(false), 4000);
      return () => clearTimeout(t);
    }
    if (!allDone) {
      setJustCompleted(false);
    }
  }, [allDone, justCompleted]);

  const resetDay = useCallback(() => {
    setDayState({ date: getTodayStr(), checked: [] });
    setCelebrating(false);
    setJustCompleted(false);
  }, []);

  const navItems = [
    { id: "checklist" as View, label: "Today", emoji: "🎒" },
    { id: "manage" as View, label: "My Items", emoji: "📋" },
    { id: "settings" as View, label: "Settings", emoji: "⚙️" },
  ];

  const studentName = settings.studentName?.trim();

  return (
    <Shell
      navItems={navItems}
      activeView={view}
      onNavChange={(v) => setView(v as View)}
      appName="Bag Buddy"
    >
      {celebrating && <Celebration name={studentName} />}

      {view === "checklist" && (
        <Checklist
          items={effectiveItems}
          checkedIds={dayState.checked}
          onToggle={toggleItem}
          onReset={resetDay}
          checkedCount={checkedCount}
          totalItems={totalItems}
          allDone={allDone}
          studentName={studentName}
          todaySubjects={todaySchedule?.subjects ?? []}
          todayWeekDay={todayWeekDay}
        />
      )}
      {view === "manage" && (
        <ManageItems items={items} setItems={setItems} />
      )}
      {view === "settings" && (
        <Settings settings={settings} onSave={setSettings} />
      )}
    </Shell>
  );
}

function Celebration({ name }: { name?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
      style={{ background: "rgba(0,0,0,0.35)" }}
    >
      <div
        className="pointer-events-auto rounded-3xl p-8 flex flex-col items-center gap-4 mx-4 animate-bounce-in"
        style={{
          background: "var(--paper)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.25)",
          maxWidth: 340,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 72 }}>🎉</div>
        <BuddyMascot size={80} happy />
        <h2
          className="text-2xl font-bold text-center"
          style={{ fontFamily: "Fraunces, serif", color: "#6366f1" }}
        >
          {name ? `${name}, you're all packed!` : "You're all packed!"}
        </h2>
        <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
          Bag Buddy is proud of you! Have an amazing day at school! 🌟
        </p>
        <div className="flex gap-2 flex-wrap justify-center text-2xl">
          {["⭐", "🎒", "🏆", "✨", "🎊"].map((e, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
