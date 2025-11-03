import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useResume } from '../../context/ResumeContext';

export const PersonalDetailsForm = () => {
  const { resumeData, updatePersonal } = useResume();
  const { personal } = resumeData;

  const handleChange = (field, value) => {
    updatePersonal({ [field]: value });
  };

  const handleGenerateSummary = async () => {
    const title = personal.title || 'professional';
    const name = personal.fullName || 'a professional';
    const location = personal.location || '';
    const email = personal.email || '';
    const phone = personal.phone || '';
    const linkedin = personal.linkedin || '';
    const website = personal.website || '';
    
    // FLAN-T5 is a text generation model that follows instructions
    // Create a clear instruction prompt for generating a professional summary
    const instruction = `Write a professional resume summary for ${name}, a ${title}${location ? ' based in ' + location : ''}${email ? ' with email ' + email : ''}${phone ? ' and phone ' + phone : ''}. 
The summary should be 2-3 sentences highlighting their expertise as a ${title}, key skills, professional value, and what they bring to potential employers. 
Make it concise, impactful, and professional. ${linkedin ? 'Mention they have LinkedIn profile ' + linkedin + '.' : ''} ${website ? 'They have a portfolio at ' + website + '.' : ''}`;
    
    try {
      handleChange('summary', "Generating summary...");
      
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: instruction })
      });
      
      // Check if response is ok before parsing
      if (!response.ok) {
        // Try to get error message
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        console.error('API Error:', errorMessage);
        handleChange('summary', errorMessage);
        return;
      }
      
      // Parse successful response
      const data = await response.json();
      
      if (data.summary) {
        handleChange('summary', data.summary);
      } else {
        handleChange('summary', "Could not generate summary. Please try again.");
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      handleChange('summary', `Error: ${err.message}`);
    }
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
            onClick={handleGenerateSummary}
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