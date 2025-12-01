import React from "react";
import { useTheme, PALETTES } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";

const LABELS = {
  system: "System (Auto)",
  dark: "Dark",
  light: "Light",
  ocean: "Ocean",
  sunset: "Sunset",
  "cherry-blossom": "Cherry Blossom",
};

function Swatch() {
  return (
    <div
      aria-hidden
      style={{
        width: 48,
        height: 32,
        borderRadius: 6,
        background: `linear-gradient(135deg, var(--surface) 0%, var(--accent) 100%)`,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    />
  );
}

export default function Settings() {
  const { palette, setPalette, cyclePalette } = useTheme();
  const [hoverCycle, setHoverCycle] = React.useState(false);
  const [hoveredPalette, setHoveredPalette] = React.useState(null);

  const handleKey = (e, p) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setPalette(p);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2 style={{ color: "var(--accent)" }}>Appearance</h2>
        <p>
          Choose a color palette for the app. Selection applies immediately.
        </p>

        <div
          role="listbox"
          aria-label="Color palettes"
          style={{ display: "flex", gap: 12, marginTop: 12 }}
        >
          {PALETTES.map((p) => (
            <button
              key={p}
              role="option"
              aria-selected={palette === p}
              tabIndex={0}
              onClick={() => setPalette(p)}
              onKeyDown={(e) => handleKey(e, p)}
              onMouseEnter={() => setHoveredPalette(p)}
              onMouseLeave={() => setHoveredPalette(null)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 12,
                borderRadius: 8,
                border:
                  palette === p
                    ? "2px solid var(--accent)"
                    : "1px solid var(--muted)",
                background:
                  hoveredPalette === p ? "var(--card-bg)" : "var(--surface)",
                color: "var(--on-background)",
                cursor: "pointer",
                minWidth: 160,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Swatch />
                <div style={{ fontWeight: 700 }}>{LABELS[p]}</div>
              </div>
              <div
                style={{ fontSize: 12, marginTop: 6, color: "var(--muted)" }}
              >
                {p}
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
          <button
            onClick={() => cyclePalette()}
            onMouseEnter={() => setHoverCycle(true)}
            onMouseLeave={() => setHoverCycle(false)}
            style={{
              background: hoverCycle ? "var(--surface)" : "var(--accent)",
              color: hoverCycle ? "var(--on-background)" : "var(--on-accent)",
              border: hoverCycle
                ? "1px solid var(--muted)"
                : "1px solid var(--accent)",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Cycle Palette
          </button>
          <button
            onClick={() => setPalette("dark")}
            style={{
              background: "transparent",
              color: "var(--on-background)",
              border: "1px solid var(--muted)",
              padding: "8px 12px",
              borderRadius: 8,
            }}
          >
            Reset to Dark
          </button>
        </div>
      </div>
    </>
  );
}
