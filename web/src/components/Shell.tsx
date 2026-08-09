import type { ReactNode } from "react";

interface NavItem {
  id: string;
  label: string;
  emoji: string;
}

interface ShellProps {
  children: ReactNode;
  navItems?: NavItem[];
  activeView?: string;
  onNavChange?: (view: string) => void;
  appName?: string;
}

export function Shell({ children, navItems = [], activeView, onNavChange, appName = "Bag Buddy" }: ShellProps) {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0"
          style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <div className="p-6 font-bold text-xl flex items-center gap-2" style={{ fontFamily: "Fraunces, serif" }}>
            <span style={{ fontSize: 28 }}>🎒</span>
            <span style={{ color: "#6366f1" }}>{appName}</span>
          </div>

          <nav className="flex-1 px-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavChange?.(item.id)}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: activeView === item.id ? "#6366f122" : "transparent",
                  color: activeView === item.id ? "#6366f1" : "var(--muted)",
                  border: activeView === item.id ? "1.5px solid #6366f144" : "1.5px solid transparent",
                }}
              >
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center px-4 h-14 border-b shrink-0 gap-2"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span style={{ fontSize: 24 }}>🎒</span>
          <span className="font-bold text-lg" style={{ fontFamily: "Fraunces, serif", color: "#6366f1" }}>
            {appName}
          </span>
        </header>

        <main className="flex-1 overflow-auto p-4">{children}</main>

        {navItems.length > 0 && (
          <nav
            className="flex items-center justify-around h-16 border-t shrink-0"
            style={{ borderColor: "var(--line)", background: "var(--dock)" }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavChange?.(item.id)}
                className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all"
                style={{
                  color: activeView === item.id ? "#6366f1" : "var(--muted)",
                }}
              >
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <span
                  className="text-xs font-bold"
                  style={{ color: activeView === item.id ? "#6366f1" : "var(--muted)" }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
