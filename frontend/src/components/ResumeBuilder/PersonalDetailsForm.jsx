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
    const name = personal.fullName || 'candidate';
    const location = personal.location || '';
    
    // Check if title is provided
    if (!personal.title || personal.title.trim() === '') {
      handleChange('summary', "Please enter your professional title first to generate a summary.");
      return;
    }
    
    // Create instruction for the AI model
    const prompt = `Write a professional 2-3 sentence resume summary for a ${title}${location ? ' based in ' + location : ''}. The summary should highlight their expertise, key skills, and professional value. Make it concise, impactful, and suitable for a resume header. Focus on what makes them valuable to potential employers.`;
    
    try {
      handleChange('summary', "Generating summary...");
      
      // Get the HF token from environment or prompt user
      const HF_TOKEN = process.env.REACT_APP_HF_TOKEN || 'YOUR_HUGGINGFACE_TOKEN_HERE';
      
      if (HF_TOKEN === 'YOUR_HUGGINGFACE_TOKEN_HERE') {
        handleChange('summary', "Error: HuggingFace API token not configured. Please add your HF_TOKEN to environment variables.");
        return;
      }
      
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
            messages: [
              { role: "user", content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
          })
        }
      );
      
     // Clone response before reading
const resClone = response.clone();

// Check if response is ok before parsing
if (!response.ok) {
  const errorText = await resClone.text();
  console.error('HuggingFace API Error:', response.status, errorText);
  
  if (response.status === 401) {
    handleChange('summary', "Authentication error: Invalid HuggingFace API token. Please check your token.");
  } else if (response.status === 503) {
    handleChange('summary', "Model is loading. Please wait a moment and try again.");
  } else {
    handleChange('summary', `Error: ${response.status}. Please try again.`);
  }
  return;
}
      
      // Parse successful response
const data = await response.json();

// ✅ HuggingFace chat response format
const generatedSummary = data?.choices?.[0]?.message?.content?.trim();

if (generatedSummary) {
  handleChange('summary', generatedSummary);
} else {
  console.error('Unexpected response format:', data);
  handleChange('summary', "Could not generate summary. Please try again.");
}



    }
    
    catch (err) {
      console.error('Error generating summary:', err);
      handleChange('summary', `Error: ${err.message}. Please check your internet connection.`);
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
            className="ml-2 text-xs underline text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateSummary}
            disabled={!personal.title || personal.title.trim() === ''}
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
          <span className="font-medium">Tip:</span> Enter your professional title, then click "Generate with AI" to create a personalized summary.
        </p>
      </div>
    </Card>
  );
}