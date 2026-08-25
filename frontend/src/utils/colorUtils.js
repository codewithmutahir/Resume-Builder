/** Shared color helpers for resume templates (preview + PDF). */

export const parseHex = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
};

export const toHex = ({ r, g, b }) => {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
};

/** Relative luminance 0–1 (sRGB). */
export const luminance = (hex) => {
  const rgb = parseHex(hex);
  if (!rgb) return 0.5;
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
};

export const isLight = (hex) => luminance(hex) > 0.45;

/** Black or white text that contrasts with background. */
export const contrastText = (bgHex) => (luminance(bgHex) > 0.4 ? '#111827' : '#ffffff');

/** Mix hex toward white. amount=1 → pure white. */
export const mixWithWhite = (hex, amount = 0.9) => {
  const rgb = parseHex(hex);
  if (!rgb) return '#f5f5f5';
  const a = Math.max(0, Math.min(1, amount));
  return toHex({
    r: rgb.r + (255 - rgb.r) * a,
    g: rgb.g + (255 - rgb.g) * a,
    b: rgb.b + (255 - rgb.b) * a,
  });
};

/**
 * Soft page wash from the user's accent (falls back to primary).
 * Avoids the hardcoded purple/pink Creative used before.
 */
export const softPageBackground = (accent, primary) =>
  mixWithWhite(accent || primary || '#9ca3af', 0.9);

/**
 * Subtitle/title on a solid primary header.
 * Prefers accent when readable; otherwise white/near-white.
 */
export const headerSubtitleColor = (primary, accent) => {
  if (!isLight(primary)) {
    if (accent && isLight(accent)) return accent;
    return '#f3f4f6';
  }
  return accent || '#374151';
};

/** Skill badge colors driven entirely by selected theme. */
export const skillBadgeColors = (primary, accent) => {
  const bg = accent || mixWithWhite(primary || '#9333ea', 0.85);
  return {
    background: bg,
    color: contrastText(bg),
  };
};
