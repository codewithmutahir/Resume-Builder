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
              <Label>Description *</Label>
              <Textarea
                placeholder="• Led a team of 5 developers...\n• Improved system performance by 40%...\n• Implemented new features that increased user engagement..."
                className="min-h-[120px]"
                value={exp.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use bullet points to describe your responsibilities and achievements</p>
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