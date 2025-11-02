import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { cn } from '@/lib/utils';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with bold headers',
    preview: 'M'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout with serif fonts',
    preview: 'C'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Minimalist design with focus on content',
    preview: 'M'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography',
    preview: 'E'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and unique layout for creative professionals',
    preview: 'C'
  }
];

export const TemplateSelector = () => {
  const { selectedTemplate, setSelectedTemplate } = useResume();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Choose a Template</h2>
        <p className="text-sm text-muted-foreground">Select a template that best represents your professional style.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "relative cursor-pointer transition-smooth hover:shadow-lg",
              selectedTemplate === template.id
                ? "ring-2 ring-primary shadow-md"
                : "hover:ring-1 hover:ring-border"
            )}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="p-6 space-y-4">
              {/* Template Preview */}
              <div className={cn(
                "w-full h-40 rounded-md flex items-center justify-center text-6xl font-bold",
                selectedTemplate === template.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {template.preview}
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              {/* Select Button */}
              <Button
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTemplate(template.id);
                }}
              >
                {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};