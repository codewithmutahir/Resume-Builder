import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const PersonalDetailsForm = () => {
  const { resumeData, updatePersonal } = useResume();
  const { personal } = resumeData;
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    updatePersonal({ [field]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      handleChange('picture', base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    handleChange('picture', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      const HF_TOKEN = process.env.REACT_APP_HF_TOKEN;
      
      if (!HF_TOKEN || HF_TOKEN === 'YOUR_HUGGINGFACE_TOKEN_HERE') {
        handleChange('summary', "Error: HuggingFace API token not configured. Please add REACT_APP_HF_TOKEN to your environment variables and redeploy.");
        console.error('REACT_APP_HF_TOKEN is not set. Value:', process.env.REACT_APP_HF_TOKEN);
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
      
      {/* Profile Picture Upload */}
      <div className="space-y-2">
        <Label>Profile Picture (Optional)</Label>
        <div className="flex items-center gap-4">
          {personal.picture ? (
            <div className="relative">
              <img
                src={personal.picture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove picture"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: Square image (400x400 pixels or 500x500 pixels), max 5MB. JPG, PNG, or GIF.
            </p>
          </div>
        </div>
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