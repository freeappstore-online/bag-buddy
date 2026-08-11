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
  books: "📚 Books & Notes",
  supplies: "✏️ Supplies",
  pe: "👟 PE & Sports",
  lunch: "🍱 Lunch & Drinks",
  tech: "💻 Tech",
  other: "🎒 Other",
};

const CATEGORY_BG: Record<Category, string> = {
  books: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
  supplies: "linear-gradient(135deg, #fef3c7, #fde68a)",
  pe: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
  lunch: "linear-gradient(135deg, #ffedd5, #fed7aa)",
  tech: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
  other: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
};

const CATEGORY_BORDER: Record<Category, string> = {
  books: "#c4b5fd",
  supplies: "#fcd34d",
  pe: "#6ee7b7",
  lunch: "#fdba74",
  tech: "#93c5fd",
  other: "#f9a8d4",
};

const CATEGORIES: Category[] = ["books", "supplies", "pe", "lunch", "tech", "other"];

// Fun encouraging messages as items get checked
const ENCOURAGEMENTS = [
  "Nice one! 🙌", "Boom! ✅", "You got it! 💪", "Legend! 🌟",
  "Smashed it! 🎯", "Yes!! 🎉", "Go you! 🚀", "Amazing! ✨",
];

// Progress messages based on percentage
function getProgressMessage(pct: number, name?: string) {
  const n = name || "You";
  if (pct === 0) return `Let's go, ${n}! 🚀`;
  if (pct < 25) return `Great start, ${n}! Keep it up! 💪`;
  if (pct < 50) return `Halfway there, ${n}! 🔥`;
  if (pct < 75) return `Looking great, ${n}! Almost done! ⭐`;
  if (pct < 100) return `So close, ${n}! Finish strong! 🏁`;
  return `${n}'s bag is PACKED! 🎉`;
}

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
  const [encouragement, setEncouragement] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    const wasUnchecked = !checkedIds.includes(id);
    onToggle(id);
    if (wasUnchecked) {
      setRecentlyChecked((prev) => new Set([...prev, id]));
      const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setEncouragement(msg);
      setTimeout(() => {
        setRecentlyChecked((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 600);
      setTimeout(() => setEncouragement(null), 1200);
    }
  };

  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;
  const progressPct = Math.round(progress);

  // Group items by category
  const grouped = CATEGORIES.map((cat) => ({
    cat,
    catItems: items.filter((i) => i.category === cat),
  })).filter(({ catItems }) => catItems.length > 0);

  // Progress bar colour based on completion
  const barColor =
    progressPct === 100
      ? "linear-gradient(90deg, #10b981, #34d399)"
      : progressPct >= 50
      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
      : "linear-gradient(90deg, #6366f1, #a78bfa)";

  return (
    <div className="flex flex-col gap-5">

      {/* ── Hero progress card ── */}
      <div
        className="rounded-3xl p-5 flex flex-col gap-4"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
        }}
      >
        {/* Top row: mascot + message */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <BuddyMascot size={72} happy={allDone} />
            {allDone && (
              <span
                className="absolute -top-1 -right-1 text-xl"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
              >
                🏆
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-white font-bold text-lg leading-tight"
              style={{ fontFamily: "Fraunces, serif", textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
            >
              {getProgressMessage(progressPct, studentName)}
            </p>
            <p className="text-white/80 text-sm mt-1">
              {checkedCount} of {totalItems} items packed
            </p>
          </div>
          {/* Floating encouragement */}
          {encouragement && (
            <div
              className="absolute right-6 text-white font-black text-lg pointer-events-none"
              style={{
                animation: "floatUp 1.2s ease-out forwards",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
            >
              {encouragement}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 14, background: "rgba(255,255,255,0.25)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: "white",
                boxShadow: "0 0 12px rgba(255,255,255,0.6)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/70 text-xs font-semibold">0%</span>
            <span className="text-white font-black text-sm">{progressPct}%</span>
            <span className="text-white/70 text-xs font-semibold">100%</span>
          </div>
        </div>

        {/* Star count badge */}
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-2xl text-sm font-bold flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            ⭐ {checkedCount} star{checkedCount !== 1 ? "s" : ""} earned today
          </span>
          {allDone && (
            <span
              className="px-3 py-1.5 rounded-2xl text-sm font-bold"
              style={{ background: "#fbbf24", color: "#78350f" }}
            >
              🏆 All done!
            </span>
          )}
        </div>
      </div>

      {/* ── Today's subjects (if school timetable set) ── */}
      {todayWeekDay && todaySubjects.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            border: "2px solid #fcd34d",
          }}
        >
          <p className="font-black text-sm mb-2" style={{ color: "#78350f", fontFamily: "Fraunces, serif" }}>
            📅 Today's subjects — {todayWeekDay}
          </p>
          <div className="flex flex-wrap gap-2">
            {todaySubjects.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#fef3c7", color: "#92400e", border: "1.5px solid #fcd34d" }}
              >
                {s.emoji} {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Checklist by category ── */}
      {grouped.map(({ cat, catItems }) => (
        <div key={cat} className="flex flex-col gap-2">
          {/* Category header */}
          <div
            className="px-4 py-2 rounded-2xl inline-flex items-center gap-2 self-start"
            style={{
              background: CATEGORY_BG[cat],
              border: `2px solid ${CATEGORY_BORDER[cat]}`,
            }}
          >
            <span className="text-sm font-black" style={{ color: CATEGORY_COLORS[cat] }}>
              {CATEGORY_LABELS[cat]}
            </span>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: CATEGORY_COLORS[cat], color: "white" }}
            >
              {catItems.filter((i) => checkedIds.includes(i.id)).length}/{catItems.length}
            </span>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2">
            {catItems.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              const isNew = recentlyChecked.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className="w-full text-left flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-95"
                  style={{
                    background: isChecked
                      ? `linear-gradient(135deg, ${CATEGORY_BG[cat].replace("linear-gradient(135deg, ", "").split(",")[0]}, ${CATEGORY_BG[cat].replace("linear-gradient(135deg, ", "").split(",")[1].trim().replace(")", "")})`
                      : "var(--panel)",
                    border: isChecked
                      ? `2.5px solid ${CATEGORY_BORDER[cat]}`
                      : "2px solid var(--line)",
                    transform: isNew ? "scale(1.03)" : undefined,
                    boxShadow: isChecked
                      ? `0 4px 16px ${CATEGORY_COLORS[cat]}30`
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Big emoji */}
                  <span
                    className="text-2xl shrink-0 transition-transform duration-200"
                    style={{ transform: isChecked ? "scale(1.2) rotate(5deg)" : "scale(1)" }}
                  >
                    {item.emoji}
                  </span>

                  {/* Label */}
                  <span
                    className="flex-1 font-bold text-base"
                    style={{
                      color: isChecked ? CATEGORY_COLORS[cat] : "var(--ink)",
                      textDecoration: isChecked ? "line-through" : "none",
                      opacity: isChecked ? 0.75 : 1,
                    }}
                  >
                    {item.label}
                    {item.fromTimetable && (
                      <span
                        className="ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: "#fef3c7", color: "#92400e" }}
                      >
                        today
                      </span>
                    )}
                  </span>

                  {/* Checkbox */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isChecked ? CATEGORY_COLORS[cat] : "var(--paper)",
                      border: isChecked ? `2px solid ${CATEGORY_COLORS[cat]}` : "2.5px solid var(--line)",
                      boxShadow: isChecked ? `0 0 0 3px ${CATEGORY_COLORS[cat]}30` : "none",
                    }}
                  >
                    {isChecked && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Empty state ── */}
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12">
          <span className="text-6xl">🎒</span>
          <p className="font-black text-xl text-center" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
            No items yet!
          </p>
          <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
            Go to "My Items" to add things to your bag
          </p>
        </div>
      )}

      {/* ── Reset button ── */}
      {checkedCount > 0 && (
        <button
          onClick={onReset}
          className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 mt-2"
          style={{
            background: "var(--panel)",
            color: "var(--muted)",
            border: "2px dashed var(--line)",
          }}
        >
          🔄 Start fresh for tomorrow
        </button>
      )}

      {/* Float-up animation */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
