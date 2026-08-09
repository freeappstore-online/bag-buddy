import { useState, useEffect, useCallback } from "react";
import { Shell } from "./components/Shell";
import { Checklist } from "./components/Checklist";
import { ManageItems } from "./components/ManageItems";
import { Settings } from "./components/Settings";
import { ParentDashboard } from "./components/ParentDashboard";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { RewardsView } from "./components/RewardsView";
import { BuddyMascot } from "./components/BuddyMascot";
import type { ChecklistItem, DayState, SchoolSettings, WeekDay, RewardState } from "./types";
import { DEFAULT_SETTINGS, DEFAULT_REWARD_STATE } from "./types";

export type { ChecklistItem };
export type { SchoolSettings };
export type { WeekDay };
export type Category = "books" | "supplies" | "pe" | "lunch" | "tech" | "other";
export type UserRole = "child" | "parent";

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

type ChildView = "checklist" | "rewards" | "manage" | "settings";
type ParentView = "parent" | "rewards" | "manage";

export default function App() {
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem("bagbuddy_role");
    return (saved as UserRole) ?? null;
  });

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

  const [rewardState, setRewardState] = useState<RewardState>(() => {
    const saved = localStorage.getItem("bagbuddy_rewards");
    return saved ? JSON.parse(saved) : DEFAULT_REWARD_STATE;
  });

  const [childView, setChildView] = useState<ChildView>("checklist");
  const [parentView, setParentView] = useState<ParentView>("parent");
  const [celebrating, setCelebrating] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (role) localStorage.setItem("bagbuddy_role", role);
    else localStorage.removeItem("bagbuddy_role");
  }, [role]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_day", JSON.stringify(dayState));
  }, [dayState]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("bagbuddy_rewards", JSON.stringify(rewardState));
  }, [rewardState]);

  // Timetable-suggested items for today
  const todayWeekDay = getTodayWeekDay();
  const todaySchedule = todayWeekDay ? settings.schedule[todayWeekDay] : undefined;
  const todaySubjectItems: string[] = todaySchedule && !todaySchedule.dayOff
    ? Array.from(new Set(todaySchedule.subjects.flatMap((s) => s.suggestedItems ?? [])))
    : [];

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
    if (allDone && !justCompleted && role === "child") {
      setCelebrating(true);
      setJustCompleted(true);
    }
    if (!allDone) {
      setJustCompleted(false);
    }
  }, [allDone, justCompleted, role]);

  const resetDay = useCallback(() => {
    setDayState({ date: getTodayStr(), checked: [] });
    setCelebrating(false);
    setJustCompleted(false);
  }, []);

  const studentName = settings.studentName?.trim();

  // ── WELCOME SCREEN ────────────────────────────────────────────────────────
  if (!role) {
    return <WelcomeScreen onSelect={(r) => setRole(r)} />;
  }

  // ── CHILD MODE ────────────────────────────────────────────────────────────
  if (role === "child") {
    const childNavItems = [
      { id: "checklist" as ChildView, label: "Today", emoji: "🎒" },
      { id: "rewards" as ChildView, label: "Rewards", emoji: "⭐" },
      { id: "manage" as ChildView, label: "My Items", emoji: "📋" },
      { id: "settings" as ChildView, label: "Settings", emoji: "⚙️" },
    ];

    return (
      <Shell
        navItems={childNavItems}
        activeView={childView}
        onNavChange={(v) => setChildView(v as ChildView)}
        appName="Bag Buddy"
      >
        {celebrating && (
          <Celebration
            name={studentName}
            onClose={() => setCelebrating(false)}
            onReset={() => { resetDay(); setCelebrating(false); }}
          />
        )}

        {childView === "checklist" && (
          <>
            <SwitchRoleBanner role="child" onSwitch={() => setRole(null)} />
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
          </>
        )}
        {childView === "rewards" && (
          <RewardsView
            rewardState={rewardState}
            onUpdate={setRewardState}
            isParent={false}
            studentName={studentName}
          />
        )}
        {childView === "manage" && (
          <ManageItems items={items} setItems={setItems} />
        )}
        {childView === "settings" && (
          <Settings settings={settings} onSave={setSettings} />
        )}
      </Shell>
    );
  }

  // ── PARENT MODE ───────────────────────────────────────────────────────────
  const parentNavItems = [
    { id: "parent" as ParentView, label: "Dashboard", emoji: "👨‍👩‍👧" },
    { id: "rewards" as ParentView, label: "Rewards", emoji: "⭐" },
    { id: "manage" as ParentView, label: "Items", emoji: "📋" },
  ];

  return (
    <Shell
      navItems={parentNavItems}
      activeView={parentView}
      onNavChange={(v) => setParentView(v as ParentView)}
      appName="Bag Buddy"
    >
      {parentView === "parent" && (
        <>
          <SwitchRoleBanner role="parent" onSwitch={() => setRole(null)} />
          <ParentDashboard
            items={effectiveItems}
            checkedIds={dayState.checked}
            settings={settings}
            checkedCount={checkedCount}
            totalItems={totalItems}
            allDone={allDone}
            onReset={resetDay}
          />
        </>
      )}
      {parentView === "rewards" && (
        <RewardsView
          rewardState={rewardState}
          onUpdate={setRewardState}
          isParent={true}
          studentName={studentName}
        />
      )}
      {parentView === "manage" && (
        <ManageItems items={items} setItems={setItems} />
      )}
    </Shell>
  );
}

// ── Switch Role Banner ────────────────────────────────────────────────────────
function SwitchRoleBanner({ role, onSwitch }: { role: UserRole; onSwitch: () => void }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-4 py-3 mb-4"
      style={{
        background: role === "child" ? "#fef3c7" : "#ede9fe",
        border: `1.5px solid ${role === "child" ? "#fcd34d" : "#c4b5fd"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{role === "child" ? "🧒" : "👨‍👩‍👧"}</span>
        <span className="text-sm font-bold" style={{ color: role === "child" ? "#92400e" : "#4c1d95" }}>
          {role === "child" ? "Child Mode" : "Parent Mode"}
        </span>
      </div>
      <button
        onClick={onSwitch}
        className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
        style={{
          background: role === "child" ? "#f59e0b" : "#6366f1",
          color: "white",
          border: "none",
        }}
      >
        {role === "child" ? "Switch to Parent" : "Switch to Child"}
      </button>
    </div>
  );
}

// ── Celebration popup ─────────────────────────────────────────────────────────
interface CelebrationProps {
  name?: string;
  onClose: () => void;
  onReset: () => void;
}

function Celebration({ name, onClose, onReset }: CelebrationProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="rounded-3xl p-8 flex flex-col items-center gap-4 mx-4"
        style={{
          background: "var(--paper)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.3)",
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
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
          ))}
        </div>
        <div className="flex flex-col gap-2 w-full mt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none" }}
          >
            ← Back to Checklist
          </button>
          <button
            onClick={onReset}
            className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "var(--panel)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
          >
            🔄 Reset & Start Again
          </button>
        </div>
      </div>
    </div>
  );
}
