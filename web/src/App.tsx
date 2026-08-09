import { useState, useEffect, useCallback } from "react";
import { Shell } from "./components/Shell";
import { Checklist } from "./components/Checklist";
import { ManageItems } from "./components/ManageItems";
import { BuddyMascot } from "./components/BuddyMascot";

export type Category = "books" | "supplies" | "pe" | "lunch" | "tech" | "other";

export interface ChecklistItem {
  id: string;
  label: string;
  category: Category;
  recurring: boolean; // always appears daily
  emoji: string;
}

export interface DayState {
  date: string; // YYYY-MM-DD
  checked: string[]; // item ids
}

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

const CATEGORY_COLORS: Record<Category, string> = {
  books: "#6366f1",
  supplies: "#f59e0b",
  pe: "#10b981",
  lunch: "#f97316",
  tech: "#3b82f6",
  other: "#ec4899",
};

export { CATEGORY_COLORS };

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

type View = "checklist" | "manage";

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

  const [view, setView] = useState<View>("checklist");
  const [celebrating, setCelebrating] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    localStorage.setItem("bagbuddy_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_day", JSON.stringify(dayState));
  }, [dayState]);

  const toggleItem = useCallback((id: string) => {
    setDayState((prev) => {
      const isChecked = prev.checked.includes(id);
      const newChecked = isChecked
        ? prev.checked.filter((c) => c !== id)
        : [...prev.checked, id];
      return { ...prev, checked: newChecked };
    });
  }, []);

  const totalItems = items.length;
  const checkedCount = dayState.checked.filter((id) =>
    items.some((i) => i.id === id)
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
    { id: "manage" as View, label: "My Items", emoji: "⚙️" },
  ];

  return (
    <Shell
      navItems={navItems}
      activeView={view}
      onNavChange={(v) => setView(v as View)}
      appName="Bag Buddy"
    >
      {celebrating && <Celebration />}

      {view === "checklist" && (
        <Checklist
          items={items}
          checkedIds={dayState.checked}
          onToggle={toggleItem}
          onReset={resetDay}
          checkedCount={checkedCount}
          totalItems={totalItems}
          allDone={allDone}
        />
      )}
      {view === "manage" && (
        <ManageItems items={items} setItems={setItems} />
      )}
    </Shell>
  );
}

function Celebration() {
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
          You're all packed!
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
