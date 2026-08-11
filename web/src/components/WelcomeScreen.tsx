import { useState } from "react";
import { BuddyMascot } from "./BuddyMascot";
import { EVENT_OPTIONS } from "../types";
import type { EventOption, EventType } from "../types";

type UserRole = "child" | "parent";

interface WelcomeScreenProps {
  onSelect: (role: UserRole, event: EventOption) => void;
}

export function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  const [step, setStep] = useState<"role" | "event">("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [customLabel, setCustomLabel] = useState("");

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep("event");
  };

  const handleEventSelect = (event: EventOption) => {
    if (!role) return;
    if (event.id === "custom") {
      // For custom, use whatever label they typed, or default
      onSelect(role, {
        ...event,
        label: customLabel.trim() || "My Event",
      });
    } else {
      onSelect(role, event);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto px-5 py-8"
      style={{ background: "var(--paper)" }}
    >
      <div className="w-full flex flex-col items-center" style={{ maxWidth: 400 }}>
        {/* Logo */}
        <BuddyMascot size={80} happy />
        <h1
          className="text-3xl font-bold mt-3 text-center"
          style={{ fontFamily: "Fraunces, serif", color: "#6366f1" }}
        >
          Bag Buddy
        </h1>

        {/* ── STEP 1: Role ── */}
        {step === "role" && (
          <>
            <p className="text-base mt-2 mb-6 text-center" style={{ color: "var(--muted)" }}>
              Never forget anything again! 🎒
            </p>
            <p
              className="text-xl font-bold mb-5 text-center"
              style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
            >
              Who's using Bag Buddy?
            </p>

            <div className="flex flex-col gap-4 w-full">
              {/* Child */}
              <button
                onClick={() => handleRoleSelect("child")}
                className="w-full rounded-3xl p-5 flex items-center gap-4 transition-all active:scale-95 hover:scale-[1.02] text-left"
                style={{
                  background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                  border: "2px solid #c4b5fd",
                }}
              >
                <span className="text-4xl">🧒</span>
                <div>
                  <p className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "#4c1d95" }}>
                    I'm a Child
                  </p>
                  <p className="text-sm" style={{ color: "#6d28d9" }}>
                    Pack my bag, earn stars & rewards
                  </p>
                </div>
              </button>

              {/* Parent */}
              <button
                onClick={() => handleRoleSelect("parent")}
                className="w-full rounded-3xl p-5 flex items-center gap-4 transition-all active:scale-95 hover:scale-[1.02] text-left"
                style={{
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  border: "2px solid #fcd34d",
                }}
              >
                <span className="text-4xl">👨‍👩‍👧</span>
                <div>
                  <p className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "#78350f" }}>
                    I'm a Parent
                  </p>
                  <p className="text-sm" style={{ color: "#92400e" }}>
                    Monitor progress & manage rewards
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Event ── */}
        {step === "event" && (
          <>
            {/* Back button */}
            <button
              onClick={() => setStep("role")}
              className="self-start mt-2 mb-4 flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95"
              style={{ background: "var(--panel)", color: "var(--muted)", border: "1.5px solid var(--line)" }}
            >
              ← Back
            </button>

            {/* Role badge */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-2xl mb-5 self-start"
              style={{
                background: role === "child" ? "#ede9fe" : "#fef3c7",
                border: `1.5px solid ${role === "child" ? "#c4b5fd" : "#fcd34d"}`,
              }}
            >
              <span>{role === "child" ? "🧒" : "👨‍👩‍👧"}</span>
              <span
                className="text-sm font-bold"
                style={{ color: role === "child" ? "#4c1d95" : "#78350f" }}
              >
                {role === "child" ? "Child" : "Parent"} Mode
              </span>
            </div>

            <p
              className="text-xl font-bold mb-2 text-center"
              style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
            >
              What are you packing for?
            </p>
            <p className="text-sm mb-5 text-center" style={{ color: "var(--muted)" }}>
              We'll suggest the right items for your occasion
            </p>

            {/* Event grid */}
            <div className="grid grid-cols-2 gap-3 w-full mb-3">
              {EVENT_OPTIONS.filter((e) => e.id !== "custom").map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className="rounded-3xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95 hover:scale-[1.02] text-center"
                  style={{
                    background: "var(--panel)",
                    border: "1.5px solid var(--line)",
                  }}
                >
                  <span className="text-3xl">{event.emoji}</span>
                  <p className="font-bold text-sm" style={{ color: "var(--ink)", fontFamily: "Fraunces, serif" }}>
                    {event.label}
                  </p>
                  <p className="text-xs leading-tight" style={{ color: "var(--muted)" }}>
                    {event.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom option */}
            <div
              className="w-full rounded-3xl p-4 flex flex-col gap-3"
              style={{
                background: "var(--panel)",
                border: "1.5px dashed var(--line)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <p className="font-bold text-sm" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
                  Something Else
                </p>
              </div>
              <input
                className="w-full rounded-xl px-3 py-2 text-sm"
                style={{
                  background: "var(--paper)",
                  border: "1.5px solid var(--line)",
                  color: "var(--ink)",
                }}
                placeholder="e.g. Music recital, Gym class…"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                maxLength={40}
              />
              <button
                onClick={() => handleEventSelect(EVENT_OPTIONS.find((e) => e.id === "custom")!)}
                className="w-full py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  border: "none",
                }}
              >
                Start with blank list →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
