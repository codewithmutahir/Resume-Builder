import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const ExperienceForm = () => {
  const { resumeData, updateExperience } = useResume();
  const [experience, setExperience] = useState(resumeData.experience.length > 0 ? resumeData.experience : [
    { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }
  ]);

  const handleAdd = () => {
    const newExperience = [...experience, { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }];
    setExperience(newExperience);
    updateExperience(newExperience);
  };

  const handleRemove = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
    updateExperience(newExperience);
  };

  const handleChange = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    if (field === 'current' && value) {
      newExperience[index].endDate = '';
    }
    setExperience(newExperience);
    updateExperience(newExperience);
  };

  const handleGenerateDescription = async (index) => {
    const exp = experience[index];
    const company = exp.company || 'company';
    const position = exp.position || 'position';
    const location = exp.location || '';
    const startDate = exp.startDate || '';
    const endDate = exp.current ? 'Present' : (exp.endDate || '');
    
    // Check if required fields are provided
    if (!exp.company || exp.company.trim() === '' || !exp.position || exp.position.trim() === '') {
      handleChange(index, 'description', "Please enter company name and position first to generate a description.");
      return;
    }
    
    // Create instruction for the AI model
    const dateRange = startDate && endDate 
      ? ` from ${startDate} to ${endDate}`
      : startDate 
        ? ` starting ${startDate}`
        : '';
    
    const prompt = `Write 3-4 professional resume bullet points for a ${position} at ${company}${location ? ' in ' + location : ''}${dateRange}. Each bullet point should start with a strong action verb and highlight key responsibilities, achievements, and impact. Make them specific, quantifiable where possible, and suitable for a resume. Format as bullet points with • prefix.`;
    
    try {
      handleChange(index, 'description', "Generating description...");
      
      // Get the HF token from environment
      const HF_TOKEN = process.env.REACT_APP_HF_TOKEN;
      
      if (!HF_TOKEN || HF_TOKEN === 'YOUR_HUGGINGFACE_TOKEN_HERE') {
        handleChange(index, 'description', "Error: HuggingFace API token not configured. Please add REACT_APP_HF_TOKEN to your environment variables and redeploy.");
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
            max_tokens: 250,
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
          handleChange(index, 'description', "Authentication error: Invalid HuggingFace API token. Please check your token.");
        } else if (response.status === 503) {
          handleChange(index, 'description', "Model is loading. Please wait a moment and try again.");
        } else {
          handleChange(index, 'description', `Error: ${response.status}. Please try again.`);
        }
        return;
      }
      
      // Parse successful response
      const data = await response.json();

      // ✅ HuggingFace chat response format
      const generatedDescription = data?.choices?.[0]?.message?.content?.trim();

      if (generatedDescription) {
        handleChange(index, 'description', generatedDescription);
      } else {
        console.error('Unexpected response format:', data);
        handleChange(index, 'description', "Could not generate description. Please try again.");
      }

    } catch (err) {
      console.error('Error generating description:', err);
      handleChange(index, 'description', `Error: ${err.message}. Please check your internet connection.`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Work Experience</h2>
        <p className="text-sm text-muted-foreground">Describe your professional experience, starting with your most recent role.</p>
      </div>

      {experience.map((exp, index) => (
        <Card key={index} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Experience #{index + 1}</h3>
            {experience.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                placeholder="Google Inc."
                value={exp.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Position *</Label>
              <Input
                placeholder="Senior Software Engineer"
                value={exp.position}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="San Francisco, CA"
                value={exp.location}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id={`current-${index}`}
                checked={exp.current}
                onCheckedChange={(checked) => handleChange(index, 'current', checked)}
              />
              <Label htmlFor={`current-${index}`} className="text-sm font-normal cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>
                Description *{" "}
                <button
                  type="button"
                  className="ml-2 text-xs underline text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleGenerateDescription(index)}
                  disabled={!exp.company || exp.company.trim() === '' || !exp.position || exp.position.trim() === ''}
                >
                  Generate with AI
                </button>
              </Label>
              <Textarea
                placeholder="• Led a team of 5 developers...\n• Improved system performance by 40%...\n• Implemented new features that increased user engagement..."
                className="min-h-[120px]"
                value={exp.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use bullet points to describe your responsibilities and achievements</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">Tip:</span> Enter company name and position, then click "Generate with AI" to create professional bullet points.
              </p>
            </div>
          </div>
        </Card>
      ))}

      <Button
        onClick={handleAdd}
        variant="outline"
        className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-primary/5"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Experience
      </Button>
    </div>
  );
};