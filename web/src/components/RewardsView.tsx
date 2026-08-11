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
  if (isParent) {
    return <ParentRewardsView rewardState={rewardState} onUpdate={onUpdate} studentName={studentName} />;
  }
  return <ChildRewardsView rewardState={rewardState} studentName={studentName} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHILD VIEW — fun, vibrant, read-only
// ─────────────────────────────────────────────────────────────────────────────
function ChildRewardsView({ rewardState, studentName }: { rewardState: RewardState; studentName?: string }) {
  const [tab, setTab] = useState<"rewards" | "history">("rewards");
  const name = studentName?.trim() || "You";
  const { totalStars, rewards, history } = rewardState;

  const starsTillNext = rewards
    .filter((r) => !r.unlocked && r.starsRequired > totalStars)
    .sort((a, b) => a.starsRequired - b.starsRequired)[0];

  return (
    <div className="flex flex-col gap-5">

      {/* ── Big star hero card ── */}
      <div
        className="rounded-3xl p-6 flex flex-col items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)",
          boxShadow: "0 8px 32px rgba(245,158,11,0.45)",
        }}
      >
        <div className="text-7xl" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>⭐</div>
        <p className="text-6xl font-black text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
          {totalStars}
        </p>
        <p className="font-black text-xl text-white/90" style={{ fontFamily: "Fraunces, serif" }}>
          {name}'s Stars! 🌟
        </p>
        {starsTillNext && (
          <div
            className="px-4 py-2 rounded-2xl text-sm font-bold text-center"
            style={{ background: "rgba(255,255,255,0.3)", color: "white" }}
          >
            🎯 {starsTillNext.starsRequired - totalStars} more stars to unlock {starsTillNext.emoji} {starsTillNext.title}!
          </div>
        )}
        {!starsTillNext && rewards.some((r) => !r.unlocked) && (
          <div
            className="px-4 py-2 rounded-2xl text-sm font-bold"
            style={{ background: "rgba(255,255,255,0.3)", color: "white" }}
          >
            🏆 You've unlocked everything — amazing!
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex rounded-2xl p-1 gap-1"
        style={{ background: "var(--panel)", border: "2px solid var(--line)" }}
      >
        {(["rewards", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl font-black text-sm transition-all"
            style={{
              background: tab === t ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
              color: tab === t ? "white" : "var(--muted)",
              boxShadow: tab === t ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
            }}
          >
            {t === "rewards" ? "🏆 Rewards" : "📜 History"}
          </button>
        ))}
      </div>

      {/* ── Rewards tab ── */}
      {tab === "rewards" && (
        <div className="flex flex-col gap-3">
          {rewards.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10">
              <span className="text-5xl">🎁</span>
              <p className="font-black text-lg text-center" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                No rewards yet!
              </p>
              <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
                Ask a parent to add some rewards for you 😊
              </p>
            </div>
          )}
          {rewards.map((reward) => {
            const canUnlock = totalStars >= reward.starsRequired;
            const pct = Math.min(100, Math.round((totalStars / reward.starsRequired) * 100));
            return (
              <div
                key={reward.id}
                className="rounded-3xl p-4 flex flex-col gap-3"
                style={{
                  background: reward.unlocked
                    ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                    : canUnlock
                    ? "linear-gradient(135deg, #ede9fe, #ddd6fe)"
                    : "var(--panel)",
                  border: reward.unlocked
                    ? "2.5px solid #6ee7b7"
                    : canUnlock
                    ? "2.5px solid #c4b5fd"
                    : "2px solid var(--line)",
                  boxShadow: canUnlock && !reward.unlocked
                    ? "0 4px 20px rgba(139,92,246,0.25)"
                    : reward.unlocked
                    ? "0 4px 20px rgba(16,185,129,0.25)"
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-4xl"
                    style={{
                      filter: reward.unlocked ? "none" : canUnlock ? "none" : "grayscale(0.5)",
                    }}
                  >
                    {reward.emoji}
                  </span>
                  <div className="flex-1">
                    <p
                      className="font-black text-base"
                      style={{
                        fontFamily: "Fraunces, serif",
                        color: reward.unlocked ? "#065f46" : canUnlock ? "#4c1d95" : "var(--ink)",
                      }}
                    >
                      {reward.title}
                      {reward.unlocked && <span className="ml-2">✅</span>}
                      {canUnlock && !reward.unlocked && <span className="ml-2">🔓</span>}
                    </p>
                    {reward.description && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        {reward.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className="font-black text-lg"
                      style={{ color: canUnlock ? "#6366f1" : "var(--muted)" }}
                    >
                      ⭐ {reward.starsRequired}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {!reward.unlocked && (
                  <div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: 10, background: "rgba(0,0,0,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: canUnlock
                            ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                            : "linear-gradient(90deg, #fbbf24, #f59e0b)",
                        }}
                      />
                    </div>
                    <p className="text-xs font-bold mt-1" style={{ color: "var(--muted)" }}>
                      {totalStars}/{reward.starsRequired} stars {canUnlock ? "— Ready to unlock! 🎉" : ""}
                    </p>
                  </div>
                )}

                {reward.unlocked && (
                  <div
                    className="rounded-2xl px-3 py-2 text-center text-sm font-black"
                    style={{ background: "#10b981", color: "white" }}
                  >
                    🎉 Reward given! Well done!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── History tab ── */}
      {tab === "history" && (
        <div className="flex flex-col gap-2">
          {history.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10">
              <span className="text-5xl">📜</span>
              <p className="font-black text-lg text-center" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                No stars yet!
              </p>
              <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
                Pack your bag and earn your first star! 🌟
              </p>
            </div>
          )}
          {[...history].reverse().map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                border: "2px solid #fcd34d",
              }}
            >
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "#78350f" }}>{entry.reason}</p>
                <p className="text-xs" style={{ color: "#92400e" }}>{entry.date}</p>
              </div>
              <span className="font-black text-lg" style={{ color: "#f59e0b" }}>+{entry.stars}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PARENT VIEW — clean, functional, full control
// ─────────────────────────────────────────────────────────────────────────────
function ParentRewardsView({
  rewardState,
  onUpdate,
  studentName,
}: {
  rewardState: RewardState;
  onUpdate: (state: RewardState) => void;
  studentName?: string;
}) {
  const [tab, setTab] = useState<"rewards" | "stars" | "history">("rewards");
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddStars, setShowAddStars] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("🏆");
  const [newStars, setNewStars] = useState(5);

  const [starReason, setStarReason] = useState("Packed bag perfectly! 🎒");
  const [starCount, setStarCount] = useState(1);

  const name = studentName?.trim() || "Your child";
  const { totalStars, rewards, history } = rewardState;

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
    onUpdate({ ...rewardState, rewards: [...rewards, reward] });
    setNewTitle(""); setNewDesc(""); setNewEmoji("🏆"); setNewStars(5);
    setShowAddReward(false);
  };

  const handleEditReward = () => {
    if (!editingReward || !newTitle.trim()) return;
    onUpdate({
      ...rewardState,
      rewards: rewards.map((r) =>
        r.id === editingReward.id
          ? { ...r, title: newTitle.trim(), description: newDesc.trim(), emoji: newEmoji, starsRequired: newStars }
          : r
      ),
    });
    setEditingReward(null); setNewTitle(""); setNewDesc(""); setNewEmoji("🏆"); setNewStars(5);
  };

  const handleDeleteReward = (id: string) => {
    onUpdate({ ...rewardState, rewards: rewards.filter((r) => r.id !== id) });
    setDeleteConfirm(null);
  };

  const handleToggleUnlocked = (id: string) => {
    onUpdate({
      ...rewardState,
      rewards: rewards.map((r) => (r.id === id ? { ...r, unlocked: !r.unlocked } : r)),
    });
  };

  const handleAddStars = () => {
    if (starCount < 1) return;
    const entry: StarEntry = {
      id: genId(),
      date: new Date().toLocaleDateString(),
      reason: starReason.trim() || "Great job!",
      stars: starCount,
    };
    onUpdate({
      ...rewardState,
      totalStars: totalStars + starCount,
      history: [...history, entry],
    });
    setStarReason("Packed bag perfectly! 🎒"); setStarCount(1);
    setShowAddStars(false);
  };

  const handleRemoveHistoryEntry = (id: string) => {
    const entry = history.find((h) => h.id === id);
    if (!entry) return;
    onUpdate({
      ...rewardState,
      totalStars: Math.max(0, totalStars - entry.stars),
      history: history.filter((h) => h.id !== id),
    });
  };

  const openEdit = (r: Reward) => {
    setEditingReward(r);
    setNewTitle(r.title); setNewDesc(r.description); setNewEmoji(r.emoji); setNewStars(r.starsRequired);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Star summary */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", border: "2px solid #fcd34d" }}
      >
        <span className="text-4xl">⭐</span>
        <div>
          <p className="font-black text-2xl" style={{ color: "#78350f" }}>{totalStars} stars</p>
          <p className="text-sm" style={{ color: "#92400e" }}>{name}'s total balance</p>
        </div>
        <button
          onClick={() => setShowAddStars(true)}
          className="ml-auto px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={{ background: "#f59e0b", color: "white", border: "none" }}
        >
          + Give Stars
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl p-1 gap-1" style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}>
        {(["rewards", "stars", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl font-bold text-sm transition-all"
            style={{
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "white" : "var(--muted)",
            }}
          >
            {t === "rewards" ? "🏆 Rewards" : t === "stars" ? "⭐ Give Stars" : "📜 History"}
          </button>
        ))}
      </div>

      {/* Rewards tab */}
      {tab === "rewards" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { setShowAddReward(true); setEditingReward(null); setNewTitle(""); setNewDesc(""); setNewEmoji("🏆"); setNewStars(5); }}
            className="w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: "var(--accent)", color: "white", border: "none" }}
          >
            + Add New Reward
          </button>

          {rewards.length === 0 && (
            <p className="text-center py-6 text-sm" style={{ color: "var(--muted)" }}>No rewards yet. Add one above!</p>
          )}

          {rewards.map((reward) => {
            const canUnlock = totalStars >= reward.starsRequired;
            return (
              <div
                key={reward.id}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{
                  background: reward.unlocked ? "#d1fae5" : canUnlock ? "#ede9fe" : "var(--panel)",
                  border: `1.5px solid ${reward.unlocked ? "#6ee7b7" : canUnlock ? "#c4b5fd" : "var(--line)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{reward.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: "var(--ink)" }}>{reward.title}</p>
                    {reward.description && <p className="text-xs" style={{ color: "var(--muted)" }}>{reward.description}</p>}
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#6366f1" }}>⭐ {reward.starsRequired} stars needed</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleToggleUnlocked(reward.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{
                      background: reward.unlocked ? "#10b981" : canUnlock ? "#6366f1" : "var(--panel)",
                      color: reward.unlocked || canUnlock ? "white" : "var(--muted)",
                      border: `1.5px solid ${reward.unlocked ? "#10b981" : canUnlock ? "#6366f1" : "var(--line)"}`,
                    }}
                  >
                    {reward.unlocked ? "✅ Given" : canUnlock ? "🎁 Mark as Given" : "🔒 Locked"}
                  </button>
                  <button
                    onClick={() => openEdit(reward)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    style={{ background: "var(--panel)", color: "var(--ink)", border: "1.5px solid var(--line)" }}
                  >
                    ✏️ Edit
                  </button>
                  {deleteConfirm === reward.id ? (
                    <>
                      <button onClick={() => handleDeleteReward(reward.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "#ef4444", color: "white", border: "none" }}>Confirm Delete</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "var(--panel)", color: "var(--muted)", border: "1.5px solid var(--line)" }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteConfirm(reward.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "var(--panel)", color: "#ef4444", border: "1.5px solid #fca5a5" }}>🗑️ Delete</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Give stars tab */}
      {tab === "stars" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}>
            <p className="font-bold" style={{ color: "var(--ink)" }}>Give stars to {name}</p>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Reason</label>
              <input
                className="w-full rounded-xl px-3 py-2 text-sm"
                style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}
                value={starReason}
                onChange={(e) => setStarReason(e.target.value)}
                placeholder="Packed bag perfectly! 🎒"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Stars to give</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setStarCount(Math.max(1, starCount - 1))} className="w-10 h-10 rounded-xl font-bold text-xl" style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>−</button>
                <span className="font-black text-2xl flex-1 text-center" style={{ color: "#f59e0b" }}>⭐ {starCount}</span>
                <button onClick={() => setStarCount(starCount + 1)} className="w-10 h-10 rounded-xl font-bold text-xl" style={{ background: "var(--paper)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>+</button>
              </div>
            </div>
            <button onClick={handleAddStars} className="w-full py-3 rounded-2xl font-bold transition-all active:scale-95" style={{ background: "#f59e0b", color: "white", border: "none" }}>
              ⭐ Give {starCount} Star{starCount !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}

      {/* History tab */}
      {tab === "history" && (
        <div className="flex flex-col gap-2">
          {history.length === 0 && <p className="text-center py-6 text-sm" style={{ color: "var(--muted)" }}>No star history yet.</p>}
          {[...history].reverse().map((entry) => (
            <div key={entry.id} className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "var(--panel)", border: "1.5px solid var(--line)" }}>
              <span className="text-xl">⭐</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{entry.reason}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{entry.date}</p>
              </div>
              <span className="font-bold" style={{ color: "#f59e0b" }}>+{entry.stars}</span>
              <button onClick={() => handleRemoveHistoryEntry(entry.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--paper)", color: "#ef4444", border: "1.5px solid #fca5a5" }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit reward modal */}
      {(showAddReward || editingReward) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full rounded-t-3xl p-6 flex flex-col gap-4" style={{ background: "var(--paper)", maxWidth: 480 }}>
            <p className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
              {editingReward ? "Edit Reward" : "Add Reward"}
            </p>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Title</label>
              <input className="w-full rounded-xl px-3 py-2 text-sm" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Extra screen time" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Description (optional)</label>
              <input className="w-full rounded-xl px-3 py-2 text-sm" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="e.g. 30 minutes of extra screen time" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Stars required</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setNewStars(Math.max(1, newStars - 1))} className="w-10 h-10 rounded-xl font-bold text-xl" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>−</button>
                <span className="font-black text-2xl flex-1 text-center" style={{ color: "#f59e0b" }}>⭐ {newStars}</span>
                <button onClick={() => setNewStars(newStars + 1)} className="w-10 h-10 rounded-xl font-bold text-xl" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>+</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--muted)" }}>Icon</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button key={e} onClick={() => setNewEmoji(e)} className="w-10 h-10 rounded-xl text-xl transition-all" style={{ background: newEmoji === e ? "var(--accent)" : "var(--panel)", border: `1.5px solid ${newEmoji === e ? "var(--accent)" : "var(--line)"}` }}>{e}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={editingReward ? handleEditReward : handleAddReward} className="flex-1 py-3 rounded-2xl font-bold transition-all active:scale-95" style={{ background: "var(--accent)", color: "white", border: "none" }}>
                {editingReward ? "Save Changes" : "Add Reward"}
              </button>
              <button onClick={() => { setShowAddReward(false); setEditingReward(null); }} className="px-5 py-3 rounded-2xl font-bold" style={{ background: "var(--panel)", color: "var(--muted)", border: "1.5px solid var(--line)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Give stars modal */}
      {showAddStars && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full rounded-t-3xl p-6 flex flex-col gap-4" style={{ background: "var(--paper)", maxWidth: 480 }}>
            <p className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>Give Stars to {name}</p>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Reason</label>
              <input className="w-full rounded-xl px-3 py-2 text-sm" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }} value={starReason} onChange={(e) => setStarReason(e.target.value)} placeholder="Packed bag perfectly! 🎒" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--muted)" }}>Stars</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setStarCount(Math.max(1, starCount - 1))} className="w-10 h-10 rounded-xl font-bold text-xl" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>−</button>
                <span className="font-black text-2xl flex-1 text-center" style={{ color: "#f59e0b" }}>⭐ {starCount}</span>
                <button onClick={() => setStarCount(starCount + 1)} className="w-10 h-10 rounded-xl font-bold text-xl" style={{ background: "var(--panel)", border: "1.5px solid var(--line)", color: "var(--ink)" }}>+</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddStars} className="flex-1 py-3 rounded-2xl font-bold transition-all active:scale-95" style={{ background: "#f59e0b", color: "white", border: "none" }}>⭐ Give Stars</button>
              <button onClick={() => setShowAddStars(false)} className="px-5 py-3 rounded-2xl font-bold" style={{ background: "var(--panel)", color: "var(--muted)", border: "1.5px solid var(--line)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
