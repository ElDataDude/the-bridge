/**
 * The Bridge — Reusable Primitive Components
 *
 * Generic, theme-driven React components for building control room dashboards.
 * All components receive `theme` (or abbreviated `T`) as a prop.
 *
 * Export as named exports. Theme structure:
 * {
 *   bg, card, panel, statsBar, border,
 *   text, textSec, textTert, textMuted,
 *   tier: { T0, T1, T2, T3, T4 },
 *   status: { active, staged, planned, concept, gap },
 *   health: { G, R, A, Gr, B, Bl },
 *   font
 * }
 */

import React, { useState, useEffect } from "react";

/**
 * Pill — Inline badge/tag component
 * @param {string} label — Display text
 * @param {string} color — Background color (hex or named)
 * @param {string} fg — Foreground text color (default: #fff)
 * @param {boolean} small — Compact size (default: false)
 * @param {object} theme — Theme object with color tokens
 */
export const Pill = ({ label, color, fg = "#fff", small, theme: T }) => (
  <span
    style={{
      display: "inline-block",
      padding: small ? "1px 5px" : "2px 8px",
      borderRadius: 10,
      background: color,
      color: fg,
      fontSize: small ? 8 : 9,
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      lineHeight: 1.4,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

/**
 * StatusDot — Colored status indicator with optional pulse
 * @param {string} status — Key into theme.status (e.g., "active", "staged")
 * @param {boolean} pulse — Show pulse animation (default: false)
 * @param {object} theme — Theme object
 */
export const StatusDot = ({ status, pulse, theme: T }) => {
  const color = (T && T.status && T.status[status]) || "#555";
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: 8,
        height: 8,
      }}
    >
      {pulse && (
        <span
          style={{
            position: "absolute",
            top: -2,
            left: -2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: color,
            opacity: 0.3,
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
      )}
      <span
        style={{
          display: "block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
        }}
      />
    </span>
  );
};

/**
 * HealthDot — 6-state health indicator (GRAGBB)
 * Maps to theme.health[state]: G, R, A, Gr, B, Bl
 * @param {string} state — Health state code
 * @param {number} size — Dot diameter in px (default: 10)
 * @param {boolean} label — Show text label (default: true)
 * @param {object} theme — Theme object
 */
export const HealthDot = ({ state, size = 10, label = true, theme: T }) => {
  const colors = T?.health || {
    G: "#555",
    R: "#e94560",
    A: "#f5a623",
    Gr: "#66bb6a",
    B: "#4fc3f7",
    Bl: "#333",
  };
  const labels = {
    G: "Grey",
    R: "Red",
    A: "Amber",
    Gr: "Green",
    B: "Blue",
    Bl: "Black",
  };
  const color = colors[state] || "#555";
  const hasOutline = state === "G";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          border: hasOutline ? "1px solid #444" : "none",
          flexShrink: 0,
        }}
      />
      {label && (
        <span style={{ fontSize: 9, color: T?.textSec || "#999" }}>
          {labels[state]}
        </span>
      )}
    </span>
  );
};

/**
 * ProgressBar — Thin inline progress bar with percentage label
 * @param {number} pct — Percentage (0–100)
 * @param {string} color — Bar color (hex)
 * @param {number} width — Bar width in px (default: 80)
 * @param {object} theme — Theme object
 */
export const ProgressBar = ({ pct, color, width = 80, theme: T }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
    }}
  >
    <span
      style={{
        width,
        height: 4,
        borderRadius: 2,
        background: T?.card || "#2a2a35",
      }}
    >
      <span
        style={{
          display: "block",
          width: `${pct}%`,
          height: 4,
          borderRadius: 2,
          background: color,
          transition: "width 0.5s",
        }}
      />
    </span>
    <span style={{ fontSize: 9, color: T?.textTert || "#666" }}>
      {Math.round(pct)}%
    </span>
  </span>
);

/**
 * ActionIcon — Small circular button for launching actions (chat, command, etc.)
 * Uses theme.tier.T2 for color by default.
 * @param {function} onClick — Click handler
 * @param {object} theme — Theme object
 */
export const ActionIcon = ({ onClick, theme: T }) => {
  const color = T?.tier?.T2 || "#4fc3f7";
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title="Start action"
      style={{
        background: color + "22",
        border: `1px solid ${color}55`,
        borderRadius: "50%",
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 0.2s",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill={color}
        stroke="none"
      >
        <path d="M12 2C6.48 2 2 6.04 2 11c0 2.76 1.36 5.22 3.5 6.84V22l3.73-2.04c.87.24 1.8.37 2.77.37 5.52 0 10-4.04 10-9S17.52 2 12 2z" />
      </svg>
    </button>
  );
};

/**
 * DetailDrawer — Right-side detail panel for entity inspection
 * Shows name, health, risks, wins, entity details, and action launcher.
 * @param {object} item — Entity object with name, health, role, owner, etc.
 * @param {function} onClose — Close handler
 * @param {function} onAction — Action/chat launcher handler
 * @param {object} theme — Theme object
 */
export const DetailDrawer = ({ item, onClose, onAction, theme: T }) => {
  if (!item) return null;

  const healthState = item.health || item.gragbb || "G";
  const healthColor = T?.health?.[healthState] || "#555";
  const healthLabels = {
    G: "Grey",
    R: "Red",
    A: "Amber",
    Gr: "Green",
    B: "Blue",
    Bl: "Black",
  };

  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        background: T?.panel || "#12121a",
        borderLeft: `1px solid ${T?.border || "#2a2a35"}`,
        padding: 16,
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: T?.text || "#fff" }}>
            {item.name || item.topic || "Untitled"}
          </div>
          {item.role && (
            <div
              style={{
                fontSize: 11,
                color: T?.tier?.T1 || "#f5a623",
                fontWeight: 600,
              }}
            >
              {item.role}
            </div>
          )}
          {item.owner && (
            <div style={{ fontSize: 10, color: T?.textSec || "#999" }}>
              Owner: {item.owner}
            </div>
          )}
          {item.kso && (
            <div style={{ fontSize: 9, color: T?.tier?.T1 || "#f5a623" }}>
              KSO: {item.kso}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: T?.textTert || "#666",
            fontSize: 16,
            cursor: "pointer",
            padding: 4,
          }}
        >
          x
        </button>
      </div>

      {/* Health Status Box */}
      <div
        style={{
          background: healthColor + "15",
          border: `1px solid ${healthColor}44`,
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: T?.textTert || "#666",
            }}
          >
            Health Status
          </span>
          <HealthDot state={healthState} size={12} theme={T} />
        </div>
        <div
          style={{
            fontSize: 11,
            color: T?.textSec || "#999",
            lineHeight: 1.6,
          }}
        >
          {item.explain || item.gragbbExplain || "No detail available."}
        </div>
      </div>

      {/* Risks */}
      {item.risks && item.risks.length > 0 && (
        <div
          style={{
            background: T?.card || "#16161e",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            border: `1px solid ${T?.border || "#2a2a35"}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T?.health?.R || "#e94560",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Risks
          </div>
          {item.risks.map((r, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                color: T?.textSec || "#999",
                lineHeight: 1.6,
                paddingLeft: 12,
                borderLeft: `2px solid ${(T?.health?.R || "#e94560") + "33"}`,
                marginBottom: 4,
              }}
            >
              {r}
            </div>
          ))}
        </div>
      )}

      {/* Wins / Evidence */}
      {item.wins && item.wins.length > 0 && (
        <div
          style={{
            background: T?.card || "#16161e",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            border: `1px solid ${T?.border || "#2a2a35"}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T?.health?.Gr || "#66bb6a",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Evidence / Wins
          </div>
          {item.wins.map((w, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                color: T?.textSec || "#999",
                lineHeight: 1.6,
                paddingLeft: 12,
                borderLeft: `2px solid ${(T?.health?.Gr || "#66bb6a") + "33"}`,
                marginBottom: 4,
              }}
            >
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Entity Details (Tier, Status, etc.) */}
      {(item.tier || item.status || item.surfaces) && (
        <div
          style={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {item.tier && (
            <Pill
              label={item.tier}
              color={T?.tier?.[item.tier] || "#555"}
              theme={T}
            />
          )}
          {item.status && (
            <Pill
              label={item.status}
              color={(T?.status?.[item.status] || "#555") + "33"}
              fg={T?.status?.[item.status] || "#555"}
              theme={T}
            />
          )}
          {item.surfaces &&
            item.surfaces.map((s) => (
              <Pill
                key={s}
                label={s}
                color={
                  {
                    CW: "#e94560",
                    WEB: "#4fc3f7",
                    CODE: "#66bb6a",
                    CHAT: "#f5a623",
                  }[s] || "#555"
                }
                fg={s === "CW" ? "#fff" : "#111"}
                small
                theme={T}
              />
            ))}
        </div>
      )}

      {/* Metrics */}
      {item.busMessages !== undefined && item.busMessages > 0 && (
        <div
          style={{
            background: T?.card || "#16161e",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 12,
            border: `1px solid ${T?.border || "#2a2a35"}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: T?.textTert || "#666",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Bus Activity
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: T?.tier?.T2 || "#4fc3f7",
            }}
          >
            {item.busMessages}{" "}
            <span style={{ fontSize: 10, color: T?.textTert || "#666" }}>
              messages
            </span>
          </div>
        </div>
      )}

      {/* Connections */}
      {item.connections && item.connections.length > 0 && (
        <div
          style={{
            background: T?.card || "#16161e",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 12,
            border: `1px solid ${T?.border || "#2a2a35"}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: T?.textTert || "#666",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Connections
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {item.connections.map((c) => (
              <Pill
                key={c}
                label={c}
                color={(T?.tier?.T2 || "#4fc3f7") + "33"}
                fg={T?.tier?.T2 || "#4fc3f7"}
                small
                theme={T}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action Launcher */}
      <div
        style={{
          background: (T?.tier?.T2 || "#4fc3f7") + "0a",
          borderRadius: 8,
          padding: 12,
          border: `1px solid ${(T?.tier?.T2 || "#4fc3f7") + "33"}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={T?.tier?.T2 || "#4fc3f7"}
            stroke="none"
          >
            <path d="M12 2C6.48 2 2 6.04 2 11c0 2.76 1.36 5.22 3.5 6.84V22l3.73-2.04c.87.24 1.8.37 2.77.37 5.52 0 10-4.04 10-9S17.52 2 12 2z" />
          </svg>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T?.tier?.T2 || "#4fc3f7",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Start Action
          </span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: T?.textSec || "#999",
            marginBottom: 8,
            lineHeight: 1.5,
          }}
        >
          Open a session with context-aware starter prompt included.
        </div>
        <button
          onClick={() => onAction?.(item)}
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${T?.tier?.T2 || "#4fc3f7"}, ${T?.tier?.T3 || "#66bb6a"})`,
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            color: "#111",
            fontWeight: 700,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: T?.font || "sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M12 2C6.48 2 2 6.04 2 11c0 2.76 1.36 5.22 3.5 6.84V22l3.73-2.04c.87.24 1.8.37 2.77.37 5.52 0 10-4.04 10-9S17.52 2 12 2z" />
          </svg>
          Start Session
        </button>
      </div>
    </div>
  );
};

/**
 * ActionLauncher — Slide-in panel for launching actions with editable prompt
 * @param {object} item — Entity context
 * @param {function} onClose — Close handler
 * @param {function} getStarterPrompt — Function to generate context-aware prompts
 * @param {string} actionLabel — Button label (default: "Start Session")
 * @param {object} theme — Theme object
 */
export const ActionLauncher = ({
  item,
  onClose,
  getStarterPrompt,
  actionLabel = "Start Session",
  theme: T,
}) => {
  const [prompt, setPrompt] = useState("");
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const initialPrompt = getStarterPrompt?.(item) || "";
    setPrompt(initialPrompt);
    setLaunched(false);
  }, [item, getStarterPrompt]);

  const skillName = item?.skill || (item?.code ? "ships-computer" : "cowork");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        background: T?.panel || "#12121a",
        borderLeft: `2px solid ${T?.tier?.T2 || "#4fc3f7"}`,
        boxShadow: "-4px 0 30px rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        fontFamily: T?.font || "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${T?.border || "#2a2a35"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 14,
              color: T?.text || "#fff",
            }}
          >
            {actionLabel}
          </div>
          <div
            style={{
              fontSize: 10,
              color: T?.tier?.T2 || "#4fc3f7",
              fontWeight: 600,
            }}
          >
            /{skillName}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: T?.textTert || "#666",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          x
        </button>
      </div>

      {/* Context Section */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${T?.border || "#2a2a35"}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T?.textTert || "#666",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 6,
          }}
        >
          Context
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          {item?.health && (
            <HealthDot state={item.health} size={10} theme={T} />
          )}
          <span style={{ fontWeight: 700, fontSize: 12, color: T?.text }}>
            {item?.name || item?.topic || "Untitled"}
          </span>
        </div>
        {item?.role && (
          <div
            style={{
              fontSize: 9,
              color: T?.tier?.T1 || "#f5a623",
              fontWeight: 600,
            }}
          >
            {item.role}
          </div>
        )}
        {item?.desc && (
          <div
            style={{
              fontSize: 9,
              color: T?.textSec || "#999",
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {item.desc}
          </div>
        )}
      </div>

      {/* Prompt Editor */}
      <div
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T?.textTert || "#666",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 8,
          }}
        >
          Starter Prompt (editable)
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            flex: 1,
            background: T?.card || "#16161e",
            border: `1px solid ${T?.border || "#2a2a35"}`,
            borderRadius: 8,
            color: T?.text || "#fff",
            fontFamily: T?.font || "sans-serif",
            fontSize: 11,
            lineHeight: 1.6,
            padding: 12,
            resize: "none",
            outline: "none",
          }}
        />
      </div>

      {/* Action Footer */}
      <div style={{ padding: 16, borderTop: `1px solid ${T?.border || "#2a2a35"}` }}>
        {!launched ? (
          <button
            onClick={() => setLaunched(true)}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${T?.tier?.T2 || "#4fc3f7"}, ${T?.tier?.T3 || "#66bb6a"})`,
              border: "none",
              borderRadius: 8,
              padding: "12px 16px",
              color: "#111",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: T?.font || "sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {actionLabel}
          </button>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 11,
                color: T?.tier?.T3 || "#66bb6a",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Prompt Ready
            </div>
            <div
              style={{
                fontSize: 9,
                color: T?.textSec || "#999",
                lineHeight: 1.5,
              }}
            >
              Copy the prompt above and paste into a new{" "}
              <span
                style={{
                  color: T?.tier?.T2 || "#4fc3f7",
                  fontWeight: 600,
                }}
              >
                /{skillName}
              </span>{" "}
              session.
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(prompt);
                }}
                style={{
                  background: (T?.tier?.T3 || "#66bb6a") + "22",
                  border: `1px solid ${T?.tier?.T3 || "#66bb6a"}`,
                  borderRadius: 6,
                  color: T?.tier?.T3 || "#66bb6a",
                  padding: "6px 14px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: T?.font || "sans-serif",
                }}
              >
                Copy Prompt
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: `1px solid ${T?.border || "#2a2a35"}`,
                  borderRadius: 6,
                  color: T?.textSec || "#999",
                  padding: "6px 14px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: T?.font || "sans-serif",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
