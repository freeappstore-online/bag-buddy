import { useState } from "react";
import type { SchoolSettings, DaySchedule, Subject } from "../types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

const PRESET_SUBJECTS: { label: string; emoji: string; items: string[] }[] = [
  { label: "Maths", emoji: "📐", items: ["Calculator", "Maths Textbook", "Ruler", "Protractor"] },
  { label: "English", emoji: "📖", items: ["English Textbook", "Novel", "Dictionary"] },
  { label: "Science", emoji: "🔬", items: ["Science Textbook", "Lab Notebook", "Safety Goggles"] },
  { label: "History", emoji: "🏛️", items: ["History Textbook", "History Notebook"] },
  { label: "Geography", emoji: "🌍", items: ["Geography Textbook", "Atlas"] },
  { label: "Art", emoji: "🎨", items: ["Sketchbook", "Pencils", "Paint Brushes", "Apron"] },
  { label: "Music", emoji: "🎵", items: ["Music Book", "Instrument"] },
  { label: "PE", emoji: "👟", items: ["PE Kit", "Trainers", "Water Bottle", "Deodorant"] },
  { label: "Drama", emoji: "🎭", items: ["Drama Script", "Costume"] },
  { label: "ICT / Computing", emoji: "💻", items: ["Laptop", "Charger", "Headphones"] },
  { label: "Languages", emoji: "🗣️", items: ["Language Textbook", "Vocab Book"] },
  { label: "RE", emoji: "📿", items: ["RE Textbook", "RE Notebook"] },
  { label: "Food Tech", emoji: "🍳", items: ["Apron", "Ingredients", "Recipe Book"] },
  { label: "Design & Tech", emoji: "🔧", items: ["DT Notebook", "Safety Glasses"] },
  { label: "PSHE", emoji: "💛", items: ["PSHE Folder"] },
];

interface SettingsProps {
  settings: SchoolSettings;
  onSave: (settings: SchoolSettings) => void;
}

export function Settings({ settings, onSave }: SettingsProps) {
  const [local, setLocal] = useState<SchoolSettings>(JSON.parse(JSON.stringify(settings)));
  const [saved, setSaved] = useState(false);
  const [activeDay, setActiveDay] = useState<typeof DAYS[number]>("Monday");
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const update = (patch: Partial<SchoolSettings>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getDaySchedule = (day: typeof DAYS[number]): DaySchedule =>
    local.schedule[day] ?? { subjects: [], extraItems: [] };

  const addSubjectToDay = (subject: Subject) => {
    const day = activeDay;
    const current = getDaySchedule(day);
    if (current.subjects.find((s) => s.label === subject.label)) return;
    setLocal((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...current,
          subjects: [...current.subjects, subject],
        },
      },
    }));
    setSaved(false);
  };

  const removeSubjectFromDay = (day: typeof DAYS[number], label: string) => {
    const current = getDaySchedule(day);
    setLocal((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...current,
          subjects: current.subjects.filter((s) => s.label !== label),
        },
      },
    }));
    setSaved(false);
  };

  const toggleDayOff = (day: typeof DAYS[number]) => {
    const current = getDaySchedule(day);
    setLocal((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...current, dayOff: !current.dayOff },
      },
    }));
    setSaved(false);
  };

  const currentSchedule = getDaySchedule(activeDay);

  return (
    <div className="max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
        >
          Settings ⚙️
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Set up your school info and weekly timetable
        </p>
      </div>

      {/* School name */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        <h2 className="font-bold text-base mb-3" style={{ fontFamily: "Fraunces, serif" }}>
          🏫 Your School
        </h2>
        <div className="mb-3">
          <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--muted)" }}>
            School Name
          </label>
          <input
            type="text"
            value={local.schoolName}
            onChange={(e) => update({ schoolName: e.target.value })}
            placeholder="e.g. Greenwood Academy"
            className="w-full rounded-xl px-4 py-3 text-base font-semibold outline-none"
            style={{
              background: "var(--paper)",
              border: "2px solid var(--line)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--muted)" }}>
            Your Name
          </label>
          <input
            type="text"
            value={local.studentName}
            onChange={(e) => update({ studentName: e.target.value })}
            placeholder="e.g. Alex"
            className="w-full rounded-xl px-4 py-3 text-base font-semibold outline-none"
            style={{
              background: "var(--paper)",
              border: "2px solid var(--line)",
              color: "var(--ink)",
            }}
          />
        </div>
      </div>

      {/* Timetable */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        <h2 className="font-bold text-base mb-1" style={{ fontFamily: "Fraunces, serif" }}>
          📅 Weekly Timetable
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Add subjects for each day — Bag Buddy will remind you what to bring!
        </p>

        {/* Day tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {DAYS.map((day) => {
            const sched = getDaySchedule(day);
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: isActive ? "#6366f1" : sched.dayOff ? "var(--line)" : "var(--paper)",
                  color: isActive ? "white" : sched.dayOff ? "var(--muted)" : "var(--ink)",
                  border: isActive ? "none" : "1.5px solid var(--line)",
                  textDecoration: sched.dayOff ? "line-through" : "none",
                }}
              >
                {day.slice(0, 3)}
                {!sched.dayOff && sched.subjects.length > 0 && (
                  <span
                    className="ml-1 text-xs rounded-full px-1"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.3)" : "#6366f122",
                      color: isActive ? "white" : "#6366f1",
                    }}
                  >
                    {sched.subjects.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Day off toggle */}
        <div className="flex items-center justify-between mb-4 p-3 rounded-2xl" style={{ background: "var(--paper)" }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{activeDay}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {currentSchedule.dayOff ? "No school this day" : `${currentSchedule.subjects.length} subject${currentSchedule.subjects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => toggleDayOff(activeDay)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: currentSchedule.dayOff ? "#6366f122" : "var(--line)",
              color: currentSchedule.dayOff ? "#6366f1" : "var(--muted)",
              border: currentSchedule.dayOff ? "1.5px solid #6366f1" : "1.5px solid transparent",
            }}
          >
            {currentSchedule.dayOff ? "✓ Day Off" : "Mark as Day Off"}
          </button>
        </div>

        {!currentSchedule.dayOff && (
          <>
            {/* Current subjects for this day */}
            {currentSchedule.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {currentSchedule.subjects.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
                    style={{ background: "#6366f122", border: "1.5px solid #6366f144", color: "#4f46e5" }}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                    <button
                      onClick={() => removeSubjectFromDay(activeDay, s.label)}
                      className="ml-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subject button */}
            <button
              onClick={() => setShowSubjectPicker(!showSubjectPicker)}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: showSubjectPicker ? "#6366f1" : "var(--paper)",
                color: showSubjectPicker ? "white" : "#6366f1",
                border: "2px dashed #6366f1",
              }}
            >
              {showSubjectPicker ? "✕ Close" : `+ Add Subject to ${activeDay}`}
            </button>

            {showSubjectPicker && (
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESET_SUBJECTS.map((s) => {
                  const alreadyAdded = currentSchedule.subjects.some((sub) => sub.label === s.label);
                  return (
                    <button
                      key={s.label}
                      onClick={() => {
                        if (!alreadyAdded) addSubjectToDay({ label: s.label, emoji: s.emoji, suggestedItems: s.items });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: alreadyAdded ? "#10b98122" : "var(--paper)",
                        color: alreadyAdded ? "#059669" : "var(--ink)",
                        border: alreadyAdded ? "1.5px solid #10b981" : "1.5px solid var(--line)",
                        opacity: alreadyAdded ? 0.7 : 1,
                      }}
                    >
                      {s.emoji} {s.label} {alreadyAdded && "✓"}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* What to bring section — show suggested items from timetable */}
      <div
        className="rounded-3xl p-5 mb-4"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        <h2 className="font-bold text-base mb-1" style={{ fontFamily: "Fraunces, serif" }}>
          💡 What You'll Need This Week
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Based on your timetable — these items will be suggested for the right days
        </p>
        {DAYS.map((day) => {
          const sched = getDaySchedule(day);
          if (sched.dayOff || sched.subjects.length === 0) return null;
          const allSuggested = Array.from(
            new Set(sched.subjects.flatMap((s) => s.suggestedItems ?? []))
          );
          if (allSuggested.length === 0) return null;
          return (
            <div key={day} className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted)" }}>
                {day}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {allSuggested.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                    style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {DAYS.every((day) => {
          const s = getDaySchedule(day);
          return s.dayOff || s.subjects.length === 0;
        }) && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Add subjects to your timetable above to see what you'll need each day.
          </p>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
        style={{
          background: saved
            ? "linear-gradient(135deg, #10b981, #34d399)"
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          border: "none",
        }}
      >
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
