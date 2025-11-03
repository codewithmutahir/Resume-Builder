import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useResume } from '../../context/ResumeContext';
import summarize from '../../api/summarize';

export const PersonalDetailsForm = () => {
  const { resumeData, updatePersonal } = useResume();
  const { personal } = resumeData;

  const handleChange = (field, value) => {
    updatePersonal({ [field]: value });
  };

  const summarizeText = async (text) => {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data.summary;
  };

  const handleSummaryChange = async (e) => {
    const summary = await summarizeText(e.target.value);
    updatePersonal({ summary });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Personal Details</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself. This information will appear at the top of your resume.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={personal.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title *</Label>
          <Input
            id="title"
            placeholder="Software Engineer"
            value={personal.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={personal.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={personal.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="New York, NY"
            value={personal.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={personal.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website">Website / Portfolio</Label>
          <Input
            id="website"
            placeholder="johndoe.com"
            value={personal.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">
          Professional Summary{" "}
          <button
            type="button"
            className="ml-2 text-xs underline text-blue-600 hover:text-blue-800"
            onClick={async () => {
              // Collect relevant personal information for context
              const baseInfo = `${personal.fullName ? personal.fullName + ', ' : ''}${personal.title ? personal.title + ', ' : ''}${personal.location ? personal.location + ', ' : ''}${personal.email ? personal.email + ', ' : ''}${personal.phone ? personal.phone : ''}`;
              const linkedInWeb = [personal.linkedin, personal.website].filter(Boolean).join(', ');
              const context = `Name, Title, Location, Email, Phone: ${baseInfo}. LinkedIn/Website: ${linkedInWeb}. Please generate a concise personalized professional summary for a resume with this context.`;
              try {
                // Show a loading indication (could be replaced by state for full UX)
                handleChange('summary', "Generating summary...");
                const response = await fetch("/api/summarize", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ text: context })
                });
                const data = await response.json();
                if (data.summary) {
                  handleChange('summary', data.summary);
                } else {
                  handleChange('summary', "Could not generate summary. Please try again.");
                }
              } catch (err) {
                handleChange('summary', "Error generating summary.");
              }
            }}
          >
            Generate with AI
          </button>
        </Label>
        <Textarea
          id="summary"
          placeholder="A brief summary of your professional background, skills, and career objectives..."
          className="min-h-[120px]"
          value={personal.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">2-3 sentences highlighting your expertise and what you bring to the role</p>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">Tip:</span> Click "Generate with AI" to create a personalized summary using HuggingFace AI.
        </p>
      </div>
    </Card>
  );
};


