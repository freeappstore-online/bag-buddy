import { useState } from "react";
import type { ChecklistItem, Category } from "../types";
import { CATEGORY_COLORS } from "../App";

interface ManageItemsProps {
  items: ChecklistItem[];
  setItems: (items: ChecklistItem[]) => void;
}

const CATEGORY_OPTIONS: { value: Category; label: string; emoji: string }[] = [
  { value: "books", label: "Books & Notes", emoji: "📚" },
  { value: "supplies", label: "Supplies", emoji: "✏️" },
  { value: "pe", label: "PE & Sports", emoji: "👟" },
  { value: "lunch", label: "Lunch & Drinks", emoji: "🍱" },
  { value: "tech", label: "Tech", emoji: "💻" },
  { value: "other", label: "Other", emoji: "🎒" },
];

const EMOJI_OPTIONS = [
  "📚", "📓", "📝", "✏️", "🖊️", "📐", "📏", "🖍️",
  "🧮", "🔬", "🎨", "🎭", "🎵", "🏃", "👟", "🏊",
  "🍱", "🥪", "🍎", "💧", "☕", "🍪",
  "💻", "📱", "🎧", "🔌", "🖥️",
  "🎒", "👜", "🗂️", "📁", "🗓️", "🔑", "💊", "🧴",
];

function generateId() {
  return "item_" + Math.random().toString(36).slice(2, 9);
}

export function ManageItems({ items, setItems }: ManageItemsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("other");
  const [newEmoji, setNewEmoji] = useState("🎒");
  const [newRecurring, setNewRecurring] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const newItem: ChecklistItem = {
      id: generateId(),
      label: newLabel.trim(),
      category: newCategory,
      emoji: newEmoji,
      recurring: newRecurring,
    };
    setItems([...items, newItem]);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleToggleRecurring = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, recurring: !i.recurring } : i)));
  };

  const resetForm = () => {
    setNewLabel("");
    setNewCategory("other");
    setNewEmoji("🎒");
    setNewRecurring(true);
    setShowAdd(false);
    setShowEmojiPicker(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
        >
          My Items 📋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Customise your daily packing checklist
        </p>
      </div>

      {/* Add new item button */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full rounded-2xl py-4 mb-5 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            border: "none",
          }}
        >
          <span style={{ fontSize: 20 }}>+</span>
          Add New Item
        </button>
      )}

      {/* Add form */}
      {showAdd && (
        <div
          className="rounded-3xl p-5 mb-5"
          style={{
            background: "var(--panel)",
            border: "2px solid #6366f1",
          }}
        >
          <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "Fraunces, serif" }}>
            ✨ New Item
          </h2>

          {/* Emoji picker */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "var(--muted)" }}>
              Pick an Emoji
            </label>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-3xl rounded-xl p-2 transition-all"
              style={{ background: "var(--paper)", border: "2px solid var(--line)" }}
            >
              {newEmoji}
            </button>
            {showEmojiPicker && (
              <div
                className="mt-2 p-3 rounded-2xl flex flex-wrap gap-1"
                style={{ background: "var(--paper)", border: "1.5px solid var(--line)" }}
              >
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setNewEmoji(e);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl p-1 rounded-lg transition-all hover:scale-110"
                    style={{
                      background: newEmoji === e ? "#6366f122" : "transparent",
                      border: newEmoji === e ? "2px solid #6366f1" : "2px solid transparent",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item name */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "var(--muted)" }}>
              Item Name
            </label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Science Textbook"
              className="w-full rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all"
              style={{
                background: "var(--paper)",
                border: "2px solid var(--line)",
                color: "var(--ink)",
              }}
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "var(--muted)" }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setNewCategory(opt.value)}
                  className="px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: newCategory === opt.value ? CATEGORY_COLORS[opt.value] : "var(--paper)",
                    color: newCategory === opt.value ? "white" : "var(--muted)",
                    border: `2px solid ${newCategory === opt.value ? CATEGORY_COLORS[opt.value] : "var(--line)"}`,
                  }}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring toggle */}
          <div className="mb-5 flex items-center gap-3">
            <button
              onClick={() => setNewRecurring(!newRecurring)}
              className="relative rounded-full transition-all duration-300"
              style={{
                width: 48,
                height: 26,
                background: newRecurring ? "#6366f1" : "var(--line)",
              }}
            >
              <div
                className="absolute top-1 rounded-full bg-white transition-all duration-300"
                style={{
                  width: 18,
                  height: 18,
                  left: newRecurring ? 26 : 4,
                }}
              />
            </button>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
                Daily item
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Always appears on your checklist
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim()}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: newLabel.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "var(--line)",
                color: newLabel.trim() ? "white" : "var(--muted)",
                border: "none",
              }}
            >
              Add Item ✓
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: "var(--paper)",
                color: "var(--muted)",
                border: "1.5px solid var(--line)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "var(--panel)",
              border: "1.5px solid var(--line)",
            }}
          >
            <span style={{ fontSize: 22 }}>{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>
                {item.label}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-xs font-bold"
                  style={{ color: CATEGORY_COLORS[item.category] }}
                >
                  {CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label}
                </span>
                {item.recurring && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: `${CATEGORY_COLORS[item.category]}22`,
                      color: CATEGORY_COLORS[item.category],
                    }}
                  >
                    Daily
                  </span>
                )}
              </div>
            </div>

            {/* Toggle recurring */}
            <button
              onClick={() => handleToggleRecurring(item.id)}
              title={item.recurring ? "Make non-recurring" : "Make daily"}
              className="text-lg transition-all hover:scale-110"
            >
              {item.recurring ? "🔁" : "📅"}
            </button>

            {/* Delete */}
            <button
              onClick={() => handleDelete(item.id)}
              className="text-lg transition-all hover:scale-110 active:scale-90"
              title="Remove item"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div
          className="rounded-3xl p-8 text-center mt-4"
          style={{ background: "var(--panel)" }}
        >
          <div style={{ fontSize: 48 }}>📋</div>
          <p className="font-semibold mt-3" style={{ color: "var(--ink)" }}>
            No items yet!
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Tap "Add New Item" to build your checklist.
          </p>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
