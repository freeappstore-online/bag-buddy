import { BuddyMascot } from "./BuddyMascot";

type UserRole = "child" | "parent";

interface WelcomeScreenProps {
  onSelect: (role: UserRole) => void;
}

export function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background: "var(--paper)" }}
    >
      {/* Logo & mascot */}
      <div className="flex flex-col items-center mb-8">
        <BuddyMascot size={100} happy />
        <h1
          className="text-4xl font-bold mt-4 text-center"
          style={{ fontFamily: "Fraunces, serif", color: "#6366f1" }}
        >
          Bag Buddy
        </h1>
        <p className="text-base mt-2 text-center" style={{ color: "var(--muted)" }}>
          Never forget anything for school again! 🎒
        </p>
      </div>

      {/* Question */}
      <p
        className="text-xl font-bold mb-6 text-center"
        style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
      >
        Who's using Bag Buddy today?
      </p>

      {/* Role cards */}
      <div className="flex flex-col gap-4 w-full" style={{ maxWidth: 340 }}>
        {/* Child */}
        <button
          onClick={() => onSelect("child")}
          className="w-full rounded-3xl p-5 flex items-center gap-4 transition-all active:scale-95 hover:scale-[1.02] text-left"
          style={{
            background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
            border: "2px solid #c4b5fd",
          }}
        >
          <div
            className="rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ width: 60, height: 60, background: "#6366f1" }}
          >
            🧒
          </div>
          <div>
            <p className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "#4c1d95" }}>
              I'm a Child
            </p>
            <p className="text-sm" style={{ color: "#6d28d9" }}>
              Tick items, pack my bag & check my timetable
            </p>
          </div>
        </button>

        {/* Parent */}
        <button
          onClick={() => onSelect("parent")}
          className="w-full rounded-3xl p-5 flex items-center gap-4 transition-all active:scale-95 hover:scale-[1.02] text-left"
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            border: "2px solid #fcd34d",
          }}
        >
          <div
            className="rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ width: 60, height: 60, background: "#f59e0b" }}
          >
            👨‍👩‍👧
          </div>
          <div>
            <p className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "#78350f" }}>
              I'm a Parent
            </p>
            <p className="text-sm" style={{ color: "#92400e" }}>
              Check progress, view timetable & manage items
            </p>
          </div>
        </button>
      </div>

      <p className="text-xs mt-8 text-center" style={{ color: "var(--muted)" }}>
        You can switch anytime from the menu
      </p>
    </div>
  );
}
