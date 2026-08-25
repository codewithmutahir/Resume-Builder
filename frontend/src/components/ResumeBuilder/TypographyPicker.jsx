import React from 'react';
import { Card } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { Type, Check } from 'lucide-react';
import { TYPOGRAPHY_PRESETS, resolveTypography } from '@/constants/typography';
import { cn } from '@/lib/utils';

export const TypographyPicker = () => {
  const { selectedTemplate, templateTypography, updateTemplateTypography } = useResume();
  const current = resolveTypography(templateTypography?.[selectedTemplate]);

  const handleSelect = (presetId) => {
    updateTemplateTypography(selectedTemplate, presetId);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Typography</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Pick a font pairing for the {selectedTemplate} template. Heading and body stay matched in preview and PDF.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TYPOGRAPHY_PRESETS.map((preset) => {
          const fonts = resolveTypography(preset.id);
          const selected = current.presetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset.id)}
              className={cn(
                'relative text-left rounded-lg border-2 p-4 transition-all hover:shadow-md',
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-background hover:border-primary/40'
              )}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              <div
                className="text-3xl font-bold mb-2 text-foreground leading-none"
                style={{ fontFamily: fonts.headingCss }}
              >
                {preset.sample}
              </div>
              <div className="font-semibold text-foreground mb-0.5" style={{ fontFamily: fonts.headingCss }}>
                {preset.name}
              </div>
              <p className="text-xs text-muted-foreground leading-snug mb-3" style={{ fontFamily: fonts.bodyCss }}>
                {preset.description}
              </p>
              <p className="text-[11px] text-muted-foreground/80" style={{ fontFamily: fonts.bodyCss }}>
                The quick brown fox jumps over the lazy dog.
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
