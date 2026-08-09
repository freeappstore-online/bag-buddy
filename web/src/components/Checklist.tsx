import { useState } from "react";
import type { ChecklistItem, Category, Subject, WeekDay } from "../types";
import { CATEGORY_COLORS } from "../App";
import { BuddyMascot } from "./BuddyMascot";

interface ChecklistProps {
  items: (ChecklistItem & { fromTimetable?: boolean })[];
  checkedIds: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
  checkedCount: number;
  totalItems: number;
  allDone: boolean;
  studentName?: string;
  todaySubjects?: Subject[];
  todayWeekDay?: WeekDay | null;
}

const CATEGORY_LABELS: Record<Category, string> = {
  books: "Books & Notes",
  supplies: "Supplies",
  pe: "PE & Sports",
  lunch: "Lunch & Drinks",
  tech: "Tech",
  other: "Other",
};

const CATEGORIES: Category[] = ["books", "supplies", "pe", "lunch", "tech", "other"];

export function Checklist({
  items,
  checkedIds,
  onToggle,
  onReset,
  checkedCount,
  totalItems,
  allDone,
  studentName,
  todaySubjects = [],
  todayWeekDay,
}: ChecklistProps) {
  const [recentlyChecked, setRecentlyChecked] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    const wasUnchecked = !checkedIds.includes(id);
    onToggle(id);
    if (wasUnchecked) {
      setRecentlyChecked((prev) => new Set([...prev, id]));
      setTimeout(() => {
        setRecentlyChecked((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 600);
    }
  };

  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;
  const remaining = totalItems - checkedCount;

  const itemsByCategory = CATEGORIES.map((cat) => ({
    cat,
    catItems: items.filter((i) => i.category === cat),
  })).filter(({ catItems }) => catItems.length > 0);

  // Timetable items (fromTimetable) grouped separately
  const timetableItems = items.filter((i) => (i as any).fromTimetable);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const greeting = studentName ? `Hey ${studentName}! 👋` : "Pack your bag!";

  return (
    <div className="max-w-lg mx-auto">
      {/* Header card */}
      <div
        className="rounded-3xl p-5 mb-5 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "white",
        }}
      >
        <BuddyMascot size={72} happy={allDone} />
        <div className="flex-1 min-w-0">
          <p className="text-xs opacity-80 font-semibold uppercase tracking-wider mb-0.5">
            {today}
          </p>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {allDone ? "All packed! 🎉" : greeting}
          </h1>
          <p className="text-sm opacity-90 mt-1">
            {allDone
              ? "Have a great day at school!"
              : remaining === 0
              ? "Nothing to pack today!"
              : `${remaining} item${remaining !== 1 ? "s" : ""} left to pack`}
          </p>
          {/* Today's subjects */}
          {todaySubjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {todaySubjects.map((s) => (
                <span
                  key={s.label}
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.25)", color: "white" }}
                >
                  {s.emoji} {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 px-1">
        <div className="flex justify-between text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>
          <span>Progress</span>
          <span style={{ color: "#6366f1" }}>
            {checkedCount}/{totalItems}
          </span>
        </div>
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 12, background: "var(--line)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: allDone
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #6366f1, #a78bfa)",
            }}
          />
        </div>
      </div>

      {/* Timetable items for today (if any) */}
      {timetableItems.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              📅 Today's Timetable Extras
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {timetableItems.map((item) => (
              <CheckItem
                key={item.id}
                item={item}
                checked={checkedIds.includes(item.id)}
                animating={recentlyChecked.has(item.id)}
                onToggle={() => handleToggle(item.id)}
                accent="#10b981"
              />
            ))}
          </div>
        </div>
      )}

      {/* Checklist by category */}
      <div className="flex flex-col gap-4 mb-6">
        {itemsByCategory.map(({ cat, catItems }) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: CATEGORY_COLORS[cat] }}
              />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                {CATEGORY_LABELS[cat]}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {catItems.map((item) => (
                <CheckItem
                  key={item.id}
                  item={item}
                  checked={checkedIds.includes(item.id)}
                  animating={recentlyChecked.has(item.id)}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reset button */}
      {checkedCount > 0 && (
        <div className="flex justify-center mb-8">
          <button
            onClick={onReset}
            className="text-sm font-semibold px-5 py-2 rounded-xl transition-all"
            style={{
              background: "var(--panel)",
              color: "var(--muted)",
              border: "1.5px solid var(--line)",
            }}
          >
            🔄 Reset for Today
          </button>
        </div>
      )}

      {/* Empty state */}
      {totalItems === 0 && (
        <div
          className="rounded-3xl p-8 text-center"
          style={{ background: "var(--panel)" }}
        >
          <div style={{ fontSize: 48 }}>🎒</div>
          <p className="font-semibold mt-3" style={{ color: "var(--ink)" }}>
            No items yet!
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Go to "My Items" to add things, or set up your timetable in Settings.
          </p>
        </div>
      )}
    </div>
  );
}

interface CheckItemProps {
  item: ChecklistItem & { fromTimetable?: boolean };
  checked: boolean;
  animating: boolean;
  onToggle: () => void;
  accent?: string;
}

function CheckItem({ item, checked, animating, onToggle, accent }: CheckItemProps) {
  const color = accent ?? CATEGORY_COLORS[item.category as Category] ?? "#6366f1";

  return (
    <button
      onClick={onToggle}
      className="w-full text-left flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-95"
      style={{
        background: checked ? `${color}18` : "var(--panel)",
        border: `2px solid ${checked ? color : "var(--line)"}`,
        transform: animating ? "scale(1.04)" : undefined,
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Checkbox */}
      <div
        className="shrink-0 flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          width: 28,
          height: 28,
          background: checked ? color : "transparent",
          border: `2.5px solid ${checked ? color : "var(--line-strong)"}`,
        }}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7L5.5 10L11.5 4"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Emoji */}
      <span style={{ fontSize: 22 }}>{item.emoji}</span>

      {/* Label */}
      <span
        className="flex-1 font-semibold text-base"
        style={{
          color: checked ? "var(--muted)" : "var(--ink)",
          textDecoration: checked ? "line-through" : "none",
          transition: "all 0.2s",
        }}
      >
        {item.label}
      </span>

      {/* Recurring badge */}
      {item.recurring && (
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: `${color}22`,
            color: color,
          }}
        >
          Daily
        </span>
      )}
    </button>
  );
}
