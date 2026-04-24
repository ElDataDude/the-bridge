/**
 * Theme System for The Bridge
 *
 * Provides a generalised, composable theme architecture with dark and light modes.
 * Tokens are organised by surface, state, and semantic purpose.
 * Use `createTheme()` to extend or override defaults.
 */

/**
 * Default dark theme — the canonical token set.
 * All keys are generic and domain-agnostic.
 * @type {Object}
 */
export const defaultTheme = {
  // Surface colors — primary application palette
  bg: "#111118",
  card: "#16161e",
  panel: "#12121a",
  statsBar: "#0a0a12",
  border: "#2a2a35",

  // Text colors — hierarchy and emphasis
  text: "#fff",
  textSec: "#999",
  textTert: "#666",
  textMuted: "#444",

  // Tier colors — hierarchy of importance (T0 highest, T4 lowest)
  tier: {
    T0: "#e94560", // Red — critical, urgent
    T1: "#f5a623", // Amber — warning, attention needed
    T2: "#4fc3f7", // Cyan — information, active
    T3: "#66bb6a", // Green — success, healthy
    T4: "#ce93d8", // Purple — extended, exploratory
  },

  // Surface semantic colors — component intent
  surface: {
    PRIMARY: "#e94560",
    SECONDARY: "#4fc3f7",
    TERTIARY: "#66bb6a",
    ACCENT: "#f5a623",
    MUTED: "#555",
  },

  // Status indicators — lifecycle states
  status: {
    active: "#66bb6a",
    staged: "#4fc3f7",
    planned: "#f5a623",
    concept: "#ce93d8",
    gap: "#e94560",
  },

  // Health states — 6-state indicator (GRAGBB: Grey/Red/Amber/Green/Blue/Black)
  health: {
    G: "#555",      // Grey — neutral, unstarted
    R: "#e94560",   // Red — failed, broken
    A: "#f5a623",   // Amber — at-risk, degraded
    Gr: "#66bb6a",  // Green — healthy, on-track
    B: "#4fc3f7",   // Blue — paused, standby
    Bl: "#333",     // Black — dark, disabled, archived
  },

  // Typography
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/**
 * Light theme variant — inverted palette suitable for daylight/print.
 * @type {Object}
 */
export const lightTheme = {
  // Surface colors — light mode
  bg: "#f9f9fb",
  card: "#ffffff",
  panel: "#f5f5f8",
  statsBar: "#efeff5",
  border: "#e0e0e8",

  // Text colors — dark text on light background
  text: "#111118",
  textSec: "#666",
  textTert: "#999",
  textMuted: "#bbb",

  // Tier colors — same as dark (colour is semantic, not lightness)
  tier: {
    T0: "#e94560",
    T1: "#f5a623",
    T2: "#4fc3f7",
    T3: "#66bb6a",
    T4: "#ce93d8",
  },

  // Surface semantic colors — same palette
  surface: {
    PRIMARY: "#e94560",
    SECONDARY: "#4fc3f7",
    TERTIARY: "#66bb6a",
    ACCENT: "#f5a623",
    MUTED: "#ddd",
  },

  // Status indicators — same
  status: {
    active: "#66bb6a",
    staged: "#4fc3f7",
    planned: "#f5a623",
    concept: "#ce93d8",
    gap: "#e94560",
  },

  // Health states — same
  health: {
    G: "#aaa",
    R: "#e94560",
    A: "#f5a623",
    Gr: "#66bb6a",
    B: "#4fc3f7",
    Bl: "#ddd",
  },

  // Typography
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/**
 * Deep-merge utility for theme composition.
 * @private
 * @param {Object} target
 * @param {Object} source
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

/**
 * Create a custom theme by merging overrides onto the default theme.
 *
 * @param {Object} overrides — Key-value pairs to override. Can be nested.
 * @returns {Object} Merged theme
 *
 * @example
 * const myTheme = createTheme({
 *   surface: { PRIMARY: "#ff0000" },
 *   tier: { T0: "#ff6600" },
 * });
 */
export function createTheme(overrides = {}) {
  return deepMerge(defaultTheme, overrides);
}

/**
 * Export named theme presets for convenience.
 */
export const themes = {
  dark: defaultTheme,
  light: lightTheme,
  default: defaultTheme,
};
