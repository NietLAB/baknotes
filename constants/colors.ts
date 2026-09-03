/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#241b2f',
    tint: '#e45b4f',

    // Core surfaces
    background: '#fcf7ef',
    foreground: '#241b2f',

    // Cards / elevated surfaces
    card: '#fffdf9',
    cardForeground: '#241b2f',

    // Primary action color (buttons, links, active states)
    primary: '#e45b4f',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#f4e8df',
    secondaryForeground: '#59475f',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#f4e8df',
    mutedForeground: '#8d7b89',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#f7c96a',
    accentForeground: '#4e3522',

    // Destructive actions (delete, error states)
    destructive: '#c6424d',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#eadfd7',
    input: '#eadfd7',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;

export const noteBackgrounds = {
  cream: '#fffaf1',
  peach: '#ffe4d8',
  lilac: '#eee5f8',
  mint: '#dff1e8',
  sunny: '#fff0bd',
} as const;

export type NoteBackground = keyof typeof noteBackgrounds;
