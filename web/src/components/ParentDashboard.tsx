import { useState } from "react";
import type { ChecklistItem, SchoolSettings } from "../types";
import { CATEGORY_COLORS } from "../App";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

interface ParentDashboardProps {
  items: (ChecklistItem & { fromTimetable?: boolean })[];
  checkedIds: string[];
  settings: SchoolSettings;
  checkedCount: number;
  totalItems: number;
  allDone: boolean;
  onReset: () => void;
}

export function ParentDashboard({
  items,
  checkedIds,
  settings,
  checkedCount,
  totalItems,
  allDone,
  onReset,
}: ParentDashboardProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
  const missing = items.filter((i) => !checkedIds.includes(i.id));
  const packed = items.filter((i) => checkedIds.includes(i.id));

  const studentName = settings.studentName?.trim() || "Your child";
  const schoolName = settings.schoolName?.trim() || null;

  return (
    <div className="max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
        >
          Parent View 👨‍👩‍👧
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {schoolName
            ? `Tracking ${studentName}'s bag for ${schoolName}`
            : `Tracking ${studentName}'s bag`}
        </p>
      </div>

      {/* Progress card */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{
          background: allDone
            ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
            : "linear-gradient(135deg, #ede9fe, #ddd6fe)",
          border: `1.5px solid ${allDone ? "#6ee7b7" : "#c4b5fd"}`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className="text-lg font-bold"
              style={{ fontFamily: "Fraunces, serif", color: allDone ? "#065f46" : "#4c1d95" }}
            >
              {allDone ? "🎉 All Packed!" : "Packing Progress"}
            </p>
            <p className="text-sm font-semibold" style={{ color: allDone ? "#059669" : "#6d28d9" }}>
              {checkedCount} of {totalItems} items packed
            </p>
          </div>
          <div
            className="rounded-full flex items-center justify-center font-bold text-2xl"
            style={{
              width: 64,
              height: 64,
              background: allDone ? "#059669" : "#6366f1",
              color: "white",
              fontFamily: "Fraunces, serif",
            }}
          >
            {progress}%
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 10, background: allDone ? "#6ee7b7" : "#c4b5fd" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: allDone ? "#059669" : "#6366f1",
            }}
          />
        </div>

        {allDone && (
          <p className="text-sm mt-3 font-semibold text-center" style={{ color: "#065f46" }}>
            ✨ {studentName} is ready for school!
          </p>
        )}
      </div>

      {/* Read-only checklist */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        <h2 className="font-bold text-base mb-1" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
          📋 Today's Checklist
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Read-only — only {studentName} can tick items
        </p>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>No items added yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              const color = CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] ?? "#ec4899";
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: isChecked ? "#f0fdf4" : "var(--paper)",
                    border: `1.5px solid ${isChecked ? "#6ee7b7" : "var(--line)"}`,
                    opacity: isChecked ? 0.75 : 1,
                  }}
                >
                  {/* Fake checkbox — not clickable */}
                  <div
                    className="rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      background: isChecked ? "#10b981" : "var(--paper)",
                      border: `2px solid ${isChecked ? "#10b981" : color}`,
                    }}
                  >
                    {isChecked && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base">{item.emoji}</span>
                  <span
                    className="font-semibold text-sm flex-1"
                    style={{
                      color: isChecked ? "#059669" : "var(--ink)",
                      textDecoration: isChecked ? "line-through" : "none",
                    }}
                  >
                    {item.label}
                  </span>
                  {isChecked && (
                    <span className="text-xs font-bold" style={{ color: "#10b981" }}>✓ Packed</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missing items alert */}
      {!allDone && missing.length > 0 && (
        <div
          className="rounded-3xl p-5 mb-4"
          style={{ background: "#fff7ed", border: "1.5px solid #fed7aa" }}
        >
          <h2 className="font-bold text-base mb-3" style={{ fontFamily: "Fraunces, serif", color: "#9a3412" }}>
            ⚠️ Still Needs to Pack ({missing.length})
          </h2>
          <div className="flex flex-col gap-2">
            {missing.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] ?? "#ec4899" }}
                />
                <span className="text-sm font-semibold" style={{ color: "#9a3412" }}>
                  {item.emoji} {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* This week's timetable */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        <h2 className="font-bold text-base mb-3" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
          📅 This Week's Timetable
        </h2>
        {DAYS.every((d) => !settings.schedule[d] || settings.schedule[d]?.subjects.length === 0) ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No timetable set up yet. Ask {studentName} to add subjects in Settings.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {DAYS.map((day) => {
              const sched = settings.schedule[day];
              const isDayOff = sched?.dayOff;
              const subjects = sched?.subjects ?? [];
              return (
                <div key={day} className="flex items-start gap-3">
                  <span
                    className="text-xs font-bold w-10 shrink-0 mt-1"
                    style={{ color: "var(--muted)" }}
                  >
                    {day.slice(0, 3)}
                  </span>
                  {isDayOff ? (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "var(--line)", color: "var(--muted)" }}
                    >
                      Day Off
                    </span>
                  ) : subjects.length === 0 ? (
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      No subjects added
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {subjects.map((s) => (
                        <span
                          key={s.label}
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: "#6366f122", color: "#4f46e5" }}
                        >
                          {s.emoji} {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parent actions */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        <h2 className="font-bold text-base mb-3" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
          🛠️ Parent Actions
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Reset the checklist so {studentName} can pack fresh for a new day.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: "#fff7ed",
              color: "#c2410c",
              border: "1.5px solid #fed7aa",
            }}
          >
            🔄 Reset Checklist for Today
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-center mb-1" style={{ color: "var(--ink)" }}>
              Are you sure? This will untick everything.
            </p>
            <button
              onClick={() => { onReset(); setShowResetConfirm(false); }}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{ background: "#ef4444", color: "white", border: "none" }}
            >
              Yes, Reset It
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{ background: "var(--paper)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
