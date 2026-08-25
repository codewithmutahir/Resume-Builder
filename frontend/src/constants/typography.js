/**
 * Curated typography presets for resume templates (v1).
 * Each preset locks heading + body so preview and PDF stay in sync.
 */

export const TYPOGRAPHY_PRESETS = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Classic serif body — safe, ATS-friendly',
    heading: 'SourceSerif4',
    body: 'SourceSerif4',
    sample: 'Aa',
  },
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    description: 'Neutral sans for tech and product roles',
    heading: 'Inter',
    body: 'Inter',
    sample: 'Aa',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Serif headings with readable body',
    heading: 'PlayfairDisplay',
    body: 'Lora',
    sample: 'Aa',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Light, airy sans throughout',
    heading: 'SourceSans3',
    body: 'SourceSans3',
    sample: 'Aa',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Friendly rounded sans with clean body',
    heading: 'Poppins',
    body: 'Inter',
    sample: 'Aa',
  },
];

/** Default preset per template family */
export const DEFAULT_TYPOGRAPHY_BY_TEMPLATE = {
  modern: 'modern-clean',
  classic: 'professional',
  minimal: 'minimal',
  elegant: 'executive',
  creative: 'creative',
};

/** CSS stacks for live preview (must match registered PDF family names conceptually) */
const CSS_STACKS = {
  Inter: '"Inter", system-ui, sans-serif',
  Poppins: '"Poppins", "Inter", sans-serif',
  PlayfairDisplay: '"Playfair Display", Georgia, serif',
  Lora: '"Lora", Georgia, serif',
  SourceSerif4: '"Source Serif 4", Georgia, serif',
  SourceSans3: '"Source Sans 3", "Inter", sans-serif',
};

export const getPresetById = (presetId) =>
  TYPOGRAPHY_PRESETS.find((p) => p.id === presetId) || TYPOGRAPHY_PRESETS[1];

/**
 * Resolve typography for templates.
 * @param {{ presetId?: string } | string | null | undefined} typography
 */
export const resolveTypography = (typography) => {
  const presetId =
    typeof typography === 'string'
      ? typography
      : typography?.presetId || 'modern-clean';
  const preset = getPresetById(presetId);

  return {
    presetId: preset.id,
    heading: preset.heading,
    body: preset.body,
    headingCss: CSS_STACKS[preset.heading] || CSS_STACKS.Inter,
    bodyCss: CSS_STACKS[preset.body] || CSS_STACKS.Inter,
    name: preset.name,
  };
};
