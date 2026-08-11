import { useState } from "react";
import { BuddyMascot } from "./BuddyMascot";
import { EVENT_OPTIONS } from "../types";
import type { EventOption } from "../types";

type UserRole = "child" | "parent";

interface WelcomeScreenProps {
  onSelect: (role: UserRole, event?: EventOption) => void;
}

const EVENT_GRADIENTS: Record<string, { bg: string; border: string; text: string }> = {
  school:    { bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)", border: "#c4b5fd", text: "#4c1d95" },
  sports:    { bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)", border: "#6ee7b7", text: "#065f46" },
  sleepover: { bg: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", border: "#a5b4fc", text: "#3730a3" },
  daytrip:   { bg: "linear-gradient(135deg, #fef3c7, #fde68a)", border: "#fcd34d", text: "#78350f" },
  swimming:  { bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)", border: "#93c5fd", text: "#1e3a8a" },
  camping:   { bg: "linear-gradient(135deg, #d1fae5, #bbf7d0)", border: "#6ee7b7", text: "#14532d" },
  holiday:   { bg: "linear-gradient(135deg, #fce7f3, #fbcfe8)", border: "#f9a8d4", text: "#831843" },
  party:     { bg: "linear-gradient(135deg, #ffedd5, #fed7aa)", border: "#fdba74", text: "#7c2d12" },
};

export function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  const [step, setStep] = useState<"role" | "event">("role");
  const [customLabel, setCustomLabel] = useState("");

  const handleRoleSelect = (r: UserRole) => {
    if (r === "parent") {
      onSelect("parent");
    } else {
      setStep("event");
    }
  };

  const handleEventSelect = (event: EventOption) => {
    if (event.id === "custom") {
      onSelect("child", { ...event, label: customLabel.trim() || "My Event" });
    } else {
      onSelect("child", event);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto px-5 py-8"
      style={{ background: "var(--paper)" }}
    >
      <div className="w-full flex flex-col items-center" style={{ maxWidth: 420 }}>

        {/* ── STEP 1: Role ── */}
        {step === "role" && (
          <>
            {/* Big fun header */}
            <div
              className="w-full rounded-3xl p-6 flex flex-col items-center mb-6"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
              }}
            >
              <BuddyMascot size={90} happy />
              <h1
                className="text-4xl font-black mt-3 text-white text-center"
                style={{ fontFamily: "Fraunces, serif", textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
              >
                Bag Buddy! 🎒
              </h1>
              <p className="text-white/80 text-sm mt-1 text-center font-semibold">
                Never forget anything again ✨
              </p>
            </div>

            <p
              className="text-2xl font-black mb-5 text-center"
              style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
            >
              Who are you? 👋
            </p>

            <div className="flex flex-col gap-4 w-full">
              {/* Child — big and exciting */}
              <button
                onClick={() => handleRoleSelect("child")}
                className="w-full rounded-3xl p-5 flex items-center gap-4 transition-all active:scale-95 hover:scale-[1.02] text-left"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "3px solid #4f46e5",
                  boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                }}
              >
                <span className="text-5xl">🧒</span>
                <div className="flex-1">
                  <p className="font-black text-xl text-white" style={{ fontFamily: "Fraunces, serif" }}>
                    I'm a Kid! 🌟
                  </p>
                  <p className="text-sm text-white/80 font-semibold">
                    Pack my bag & earn cool rewards
                  </p>
                </div>
                <span className="text-white text-2xl font-black">→</span>
              </button>

              {/* Parent — smaller, more subtle */}
              <button
                onClick={() => handleRoleSelect("parent")}
                className="w-full rounded-3xl p-4 flex items-center gap-3 transition-all active:scale-95 hover:scale-[1.01] text-left"
                style={{
                  background: "var(--panel)",
                  border: "2px solid var(--line)",
                }}
              >
                <span className="text-3xl">👨‍👩‍👧</span>
                <div className="flex-1">
                  <p className="font-bold text-base" style={{ color: "var(--ink)", fontFamily: "Fraunces, serif" }}>
                    I'm a Parent / Guardian
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    View progress & manage rewards
                  </p>
                </div>
                <span className="text-lg" style={{ color: "var(--muted)" }}>→</span>
              </button>
            </div>

            <p className="text-xs mt-5 text-center px-4" style={{ color: "var(--muted)" }}>
              💡 Kids choose what they're packing for — parents just check in!
            </p>
          </>
        )}

        {/* ── STEP 2: Event (child only) ── */}
        {step === "event" && (
          <>
            {/* Fun child header */}
            <div
              className="w-full rounded-3xl p-5 flex items-center gap-4 mb-5"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 6px 24px rgba(99,102,241,0.35)",
              }}
            >
              <BuddyMascot size={60} happy />
              <div>
                <p className="text-white font-black text-xl" style={{ fontFamily: "Fraunces, serif" }}>
                  Awesome! 🎉
                </p>
                <p className="text-white/80 text-sm font-semibold">
                  What are you packing for today?
                </p>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => setStep("role")}
              className="self-start mb-4 flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
              style={{ background: "var(--panel)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
            >
              ← Back
            </button>

            {/* Event grid — colourful cards */}
            <div className="grid grid-cols-2 gap-3 w-full mb-4">
              {EVENT_OPTIONS.filter((e) => e.id !== "custom").map((event) => {
                const style = EVENT_GRADIENTS[event.id] ?? {
                  bg: "var(--panel)", border: "var(--line)", text: "var(--ink)",
                };
                return (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelect(event)}
                    className="rounded-3xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95 hover:scale-[1.04] text-center"
                    style={{
                      background: style.bg,
                      border: `2.5px solid ${style.border}`,
                      boxShadow: `0 4px 16px ${style.border}50`,
                    }}
                  >
                    <span className="text-4xl">{event.emoji}</span>
                    <p
                      className="font-black text-sm"
                      style={{ color: style.text, fontFamily: "Fraunces, serif" }}
                    >
                      {event.label}
                    </p>
                    <p className="text-xs leading-tight" style={{ color: style.text, opacity: 0.75 }}>
                      {event.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom option */}
            <div
              className="w-full rounded-3xl p-4 flex flex-col gap-3"
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                border: "2.5px dashed #fcd34d",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <p className="font-black text-sm" style={{ fontFamily: "Fraunces, serif", color: "#78350f" }}>
                  Something Else?
                </p>
              </div>
              <input
                className="w-full rounded-xl px-3 py-2 text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "2px solid #fcd34d",
                  color: "#78350f",
                }}
                placeholder="e.g. Music recital, Gym class…"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                maxLength={40}
              />
              <button
                onClick={() => handleEventSelect(EVENT_OPTIONS.find((e) => e.id === "custom")!)}
                className="w-full py-2.5 rounded-2xl font-black text-sm transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  color: "#78350f",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
                }}
              >
                Let's go! 🚀
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
