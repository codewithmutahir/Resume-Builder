import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useResume } from '@/context/ResumeContext';
import { Palette } from 'lucide-react';

const colorLabels = {
  primary: 'Primary Color',
  secondary: 'Secondary Color',
  accent: 'Accent Color',
  text: 'Text Color',
  textSecondary: 'Secondary Text'
};

export const ColorPicker = () => {
  const { selectedTemplate, templateColors, updateTemplateColors } = useResume();
  const colors = templateColors[selectedTemplate] || templateColors.modern;

  const handleColorChange = (colorKey, value) => {
    updateTemplateColors(selectedTemplate, {
      [colorKey]: value
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Customize Colors</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Choose your preferred color scheme for the {selectedTemplate} template
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(colors).map(([colorKey, colorValue]) => (
          <div key={colorKey} className="space-y-2">
            <Label htmlFor={colorKey} className="text-sm font-medium text-foreground">
              {colorLabels[colorKey] || colorKey}
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id={colorKey}
                value={colorValue}
                onChange={(e) => handleColorChange(colorKey, e.target.value)}
                className="w-16 h-10 rounded-md border-2 border-border cursor-pointer"
                style={{ backgroundColor: colorValue }}
              />
              <input
                type="text"
                value={colorValue}
                onChange={(e) => handleColorChange(colorKey, e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="#000000"
              />
              <div
                className="w-8 h-8 rounded border-2 border-border"
                style={{ backgroundColor: colorValue }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

