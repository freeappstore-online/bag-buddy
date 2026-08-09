import { useState } from "react";
import type { RewardState, Reward, StarEntry } from "../types";

interface RewardsViewProps {
  rewardState: RewardState;
  onUpdate: (state: RewardState) => void;
  isParent: boolean;
  studentName?: string;
}

const EMOJI_OPTIONS = ["🎮", "🍕", "🎬", "📱", "🧁", "🎠", "🏖️", "🎁", "🚴", "🎨", "🏆", "⭐", "🍦", "🎤", "🎯"];

function genId() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function RewardsView({ rewardState, onUpdate, isParent, studentName }: RewardsViewProps) {
  const [tab, setTab] = useState<"rewards" | "stars" | "history">("rewards");
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddStars, setShowAddStars] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Add reward form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("🏆");
  const [newStars, setNewStars] = useState(5);

  // Add stars form
  const [starReason, setStarReason] = useState("Packed bag perfectly! 🎒");
  const [starCount, setStarCount] = useState(1);

  const name = studentName?.trim() || "Your child";

  const handleAddReward = () => {
    if (!newTitle.trim()) return;
    const reward: Reward = {
      id: genId(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      emoji: newEmoji,
      starsRequired: newStars,
      unlocked: false,
    };
    onUpdate({ ...rewardState, rewards: [...rewardState.rewards, reward] });
    setNewTitle(""); setNewDesc(""); setNewEmoji("🏆"); setNewStars(5);
    setShowAddReward(false);
  };

  const handleSaveEdit = () => {
    if (!editingReward || !editingReward.title.trim()) return;
    onUpdate({
      ...rewardState,
      rewards: rewardState.rewards.map((r) => r.id === editingReward.id ? editingReward : r),
    });
    setEditingReward(null);
  };

  const handleDeleteReward = (id: string) => {
    onUpdate({ ...rewardState, rewards: rewardState.rewards.filter((r) => r.id !== id) });
    setDeleteConfirm(null);
  };

  const handleMarkUnlocked = (id: string, val: boolean) => {
    onUpdate({
      ...rewardState,
      rewards: rewardState.rewards.map((r) => r.id === id ? { ...r, unlocked: val } : r),
    });
  };

  const handleAddStars = () => {
    if (starCount < 1) return;
    const entry: StarEntry = {
      id: genId(),
      date: new Date().toISOString().split("T")[0],
      reason: starReason.trim() || "Great job!",
      stars: starCount,
    };
    onUpdate({
      ...rewardState,
      totalStars: rewardState.totalStars + starCount,
      history: [entry, ...rewardState.history],
    });
    setStarReason("Packed bag perfectly! 🎒");
    setStarCount(1);
    setShowAddStars(false);
  };

  const handleRemoveStars = (entryId: string, stars: number) => {
    onUpdate({
      ...rewardState,
      totalStars: Math.max(0, rewardState.totalStars - stars),
      history: rewardState.history.filter((h) => h.id !== entryId),
    });
  };

  const sortedRewards = [...rewardState.rewards].sort((a, b) => a.starsRequired - b.starsRequired);

  return (
    <div className="max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
          {isParent ? "Rewards 🏆" : "My Rewards 🌟"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {isParent
            ? `Manage ${name}'s rewards and award stars`
            : "Earn stars by packing your bag — unlock awesome rewards!"}
        </p>
      </div>

      {/* Star balance */}
      <div
        className="rounded-3xl p-5 mb-5 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          border: "2px solid #fcd34d",
        }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: "#92400e" }}>Total Stars Earned</p>
          <p className="text-4xl font-bold mt-1" style={{ fontFamily: "Fraunces, serif", color: "#78350f" }}>
            ⭐ {rewardState.totalStars}
          </p>
          {!isParent && (
            <p className="text-xs mt-1" style={{ color: "#b45309" }}>
              Keep packing to earn more!
            </p>
          )}
        </div>
        {isParent && (
          <button
            onClick={() => setShowAddStars(true)}
            className="px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "#f59e0b", color: "white", border: "none" }}
          >
            + Give Stars
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-2xl p-1 mb-5 gap-1"
        style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
      >
        {(["rewards", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl font-bold text-sm transition-all"
            style={{
              background: tab === t ? "#6366f1" : "transparent",
              color: tab === t ? "white" : "var(--muted)",
              border: "none",
            }}
          >
            {t === "rewards" ? "🎁 Rewards" : "📜 History"}
          </button>
        ))}
      </div>

      {/* ── REWARDS TAB ── */}
      {tab === "rewards" && (
        <>
          {sortedRewards.length === 0 ? (
            <div
              className="rounded-3xl p-8 text-center mb-4"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
            >
              <p className="text-4xl mb-3">🎁</p>
              <p className="font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                No rewards yet
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                {isParent ? "Add some rewards below!" : "Ask a parent to add rewards!"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              {sortedRewards.map((reward) => {
                const canUnlock = rewardState.totalStars >= reward.starsRequired;
                const progress = Math.min(100, Math.round((rewardState.totalStars / reward.starsRequired) * 100));
                return (
                  <div
                    key={reward.id}
                    className="rounded-3xl p-5"
                    style={{
                      background: reward.unlocked
                        ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                        : canUnlock
                        ? "linear-gradient(135deg, #ede9fe, #ddd6fe)"
                        : "var(--panel)",
                      border: `1.5px solid ${reward.unlocked ? "#6ee7b7" : canUnlock ? "#c4b5fd" : "var(--line)"}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{
                          width: 52,
                          height: 52,
                          background: reward.unlocked ? "#10b981" : canUnlock ? "#6366f1" : "var(--line)",
                          filter: reward.unlocked ? "none" : canUnlock ? "none" : "grayscale(1)",
                        }}
                      >
                        {reward.unlocked ? "✅" : reward.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className="font-bold text-base"
                            style={{
                              fontFamily: "Fraunces, serif",
                              color: reward.unlocked ? "#065f46" : canUnlock ? "#4c1d95" : "var(--ink)",
                            }}
                          >
                            {reward.title}
                          </p>
                          {reward.unlocked && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: "#10b981", color: "white" }}
                            >
                              Given! 🎉
                            </span>
                          )}
                          {!reward.unlocked && canUnlock && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: "#6366f1", color: "white" }}
                            >
                              Ready! ✨
                            </span>
                          )}
                        </div>
                        {reward.description && (
                          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                            {reward.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>
                            ⭐ {reward.starsRequired} stars
                          </span>
                          {!reward.unlocked && (
                            <span className="text-xs" style={{ color: "var(--muted)" }}>
                              · {Math.max(0, reward.starsRequired - rewardState.totalStars)} more to go
                            </span>
                          )}
                        </div>
                        {/* Progress bar */}
                        {!reward.unlocked && (
                          <div
                            className="rounded-full mt-2 overflow-hidden"
                            style={{ height: 6, background: "var(--line)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${progress}%`,
                                background: canUnlock ? "#6366f1" : "#f59e0b",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Parent controls */}
                    {isParent && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {!reward.unlocked && canUnlock && (
                          <button
                            onClick={() => handleMarkUnlocked(reward.id, true)}
                            className="flex-1 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
                            style={{ background: "#10b981", color: "white", border: "none" }}
                          >
                            🎉 Mark as Given
                          </button>
                        )}
                        {reward.unlocked && (
                          <button
                            onClick={() => handleMarkUnlocked(reward.id, false)}
                            className="flex-1 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
                            style={{ background: "var(--paper)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
                          >
                            ↩ Mark as Not Given
                          </button>
                        )}
                        <button
                          onClick={() => setEditingReward({ ...reward })}
                          className="px-3 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
                          style={{ background: "#ede9fe", color: "#4c1d95", border: "1.5px solid #c4b5fd" }}
                        >
                          ✏️ Edit
                        </button>
                        {deleteConfirm === reward.id ? (
                          <>
                            <button
                              onClick={() => handleDeleteReward(reward.id)}
                              className="px-3 py-2 rounded-xl font-bold text-xs active:scale-95"
                              style={{ background: "#ef4444", color: "white", border: "none" }}
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-2 rounded-xl font-bold text-xs active:scale-95"
                              style={{ background: "var(--paper)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(reward.id)}
                            className="px-3 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
                            style={{ background: "#fff1f2", color: "#e11d48", border: "1.5px solid #fecdd3" }}
                          >
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add reward button (parent only) */}
          {isParent && (
            <button
              onClick={() => setShowAddReward(true)}
              className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none" }}
            >
              + Add New Reward
            </button>
          )}
        </>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div className="flex flex-col gap-3">
          {rewardState.history.length === 0 ? (
            <div
              className="rounded-3xl p-8 text-center"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
            >
              <p className="text-4xl mb-3">⭐</p>
              <p className="font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                No stars earned yet
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                {isParent ? "Award stars from the dashboard above!" : "Pack your bag to earn stars!"}
              </p>
            </div>
          ) : (
            rewardState.history.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}
              >
                <div
                  className="rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ width: 44, height: 44, background: "#fef3c7", color: "#92400e" }}
                >
                  +{entry.stars}⭐
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }}>
                    {entry.reason}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{entry.date}</p>
                </div>
                {isParent && (
                  <button
                    onClick={() => handleRemoveStars(entry.id, entry.stars)}
                    className="text-xs px-2 py-1 rounded-lg font-bold shrink-0"
                    style={{ background: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3" }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ADD REWARD MODAL ── */}
      {isParent && showAddReward && (
        <Modal title="Add New Reward" onClose={() => setShowAddReward(false)}>
          <EmojiPicker value={newEmoji} onChange={setNewEmoji} />
          <label className="text-xs font-bold mt-3 block" style={{ color: "var(--muted)" }}>Reward Title *</label>
          <input
            className="w-full rounded-xl px-3 py-2 text-sm font-semibold mt-1"
            style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
            placeholder="e.g. Extra Screen Time"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={40}
          />
          <label className="text-xs font-bold mt-3 block" style={{ color: "var(--muted)" }}>Description</label>
          <input
            className="w-full rounded-xl px-3 py-2 text-sm mt-1"
            style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
            placeholder="e.g. 30 minutes of extra screen time!"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            maxLength={80}
          />
          <label className="text-xs font-bold mt-3 block" style={{ color: "var(--muted)" }}>Stars Required</label>
          <div className="flex items-center gap-3 mt-1">
            <button onClick={() => setNewStars(Math.max(1, newStars - 1))}
              className="w-9 h-9 rounded-xl font-bold text-lg"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>−</button>
            <span className="font-bold text-lg" style={{ color: "#f59e0b" }}>⭐ {newStars}</span>
            <button onClick={() => setNewStars(newStars + 1)}
              className="w-9 h-9 rounded-xl font-bold text-lg"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>+</button>
          </div>
          <button
            onClick={handleAddReward}
            disabled={!newTitle.trim()}
            className="w-full py-3 rounded-2xl font-bold text-sm mt-4 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none" }}
          >
            Add Reward
          </button>
        </Modal>
      )}

      {/* ── EDIT REWARD MODAL ── */}
      {isParent && editingReward && (
        <Modal title="Edit Reward" onClose={() => setEditingReward(null)}>
          <EmojiPicker value={editingReward.emoji} onChange={(e) => setEditingReward({ ...editingReward, emoji: e })} />
          <label className="text-xs font-bold mt-3 block" style={{ color: "var(--muted)" }}>Reward Title *</label>
          <input
            className="w-full rounded-xl px-3 py-2 text-sm font-semibold mt-1"
            style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
            value={editingReward.title}
            onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
            maxLength={40}
          />
          <label className="text-xs font-bold mt-3 block" style={{ color: "var(--muted)" }}>Description</label>
          <input
            className="w-full rounded-xl px-3 py-2 text-sm mt-1"
            style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
            value={editingReward.description}
            onChange={(e) => setEditingReward({ ...editingReward, description: e.target.value })}
            maxLength={80}
          />
          <label className="text-xs font-bold mt-3 block" style={{ color: "var(--muted)" }}>Stars Required</label>
          <div className="flex items-center gap-3 mt-1">
            <button onClick={() => setEditingReward({ ...editingReward, starsRequired: Math.max(1, editingReward.starsRequired - 1) })}
              className="w-9 h-9 rounded-xl font-bold text-lg"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>−</button>
            <span className="font-bold text-lg" style={{ color: "#f59e0b" }}>⭐ {editingReward.starsRequired}</span>
            <button onClick={() => setEditingReward({ ...editingReward, starsRequired: editingReward.starsRequired + 1 })}
              className="w-9 h-9 rounded-xl font-bold text-lg"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>+</button>
          </div>
          <button
            onClick={handleSaveEdit}
            disabled={!editingReward.title.trim()}
            className="w-full py-3 rounded-2xl font-bold text-sm mt-4 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none" }}
          >
            Save Changes
          </button>
        </Modal>
      )}

      {/* ── ADD STARS MODAL ── */}
      {isParent && showAddStars && (
        <Modal title="Give Stars ⭐" onClose={() => setShowAddStars(false)}>
          <label className="text-xs font-bold block mb-1" style={{ color: "var(--muted)" }}>Reason</label>
          <input
            className="w-full rounded-xl px-3 py-2 text-sm mt-1"
            style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
            value={starReason}
            onChange={(e) => setStarReason(e.target.value)}
            maxLength={60}
          />
          <label className="text-xs font-bold mt-4 block" style={{ color: "var(--muted)" }}>Number of Stars</label>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => setStarCount(Math.max(1, starCount - 1))}
              className="w-9 h-9 rounded-xl font-bold text-lg"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>−</button>
            <span className="font-bold text-2xl" style={{ color: "#f59e0b" }}>⭐ {starCount}</span>
            <button onClick={() => setStarCount(starCount + 1)}
              className="w-9 h-9 rounded-xl font-bold text-lg"
              style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>+</button>
          </div>
          <button
            onClick={handleAddStars}
            className="w-full py-3 rounded-2xl font-bold text-sm mt-4 transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", border: "none" }}
          >
            ⭐ Give {starCount} Star{starCount !== 1 ? "s" : ""} to {name}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── Reusable Modal ────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full rounded-3xl p-6 flex flex-col gap-1"
        style={{ background: "var(--paper)", maxWidth: 400, boxShadow: "0 8px 48px rgba(0,0,0,0.25)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl font-bold text-lg flex items-center justify-center"
            style={{ background: "var(--panel)", color: "var(--muted)", border: "none" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Emoji Picker ──────────────────────────────────────────────────────────────
const EMOJI_LIST = ["🏆", "🎮", "🍕", "🎬", "📱", "🧁", "🎠", "🏖️", "🎁", "🚴", "🎨", "⭐", "🍦", "🎤", "🎯", "🛹", "🎪", "🎡", "🍫", "🎲"];

function EmojiPicker({ value, onChange }: { value: string; onChange: (e: string) => void }) {
  return (
    <div>
      <label className="text-xs font-bold block mb-2" style={{ color: "var(--muted)" }}>Icon</label>
      <div className="flex flex-wrap gap-2">
        {EMOJI_LIST.map((e) => (
          <button
            key={e}
            onClick={() => onChange(e)}
            className="w-10 h-10 rounded-xl text-xl transition-all active:scale-95"
            style={{
              background: value === e ? "#6366f1" : "var(--panel)",
              border: `2px solid ${value === e ? "#6366f1" : "var(--line)"}`,
            }}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
