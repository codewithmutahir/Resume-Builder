import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';

export const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const [skills, setSkills] = useState(resumeData.skills);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      const newSkills = [...skills, inputValue.trim()];
      setSkills(newSkills);
      updateSkills(newSkills);
      setInputValue('');
    }
  };

  const handleRemove = (skillToRemove) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    updateSkills(newSkills);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Skills</h2>
        <p className="text-sm text-muted-foreground">Add your professional skills. Press Enter or click Add to include each skill.</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="skill-input">Add a skill</Label>
            <Input
              id="skill-input"
              placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="self-end">
            <Button onClick={handleAdd} type="button">
              Add Skill
            </Button>
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <Label className="mb-3 block">Your Skills ({skills.length})</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-secondary/80 transition-smooth"
                >
                  {skill}
                  <button
                    onClick={() => handleRemove(skill)}
                    className="hover:text-destructive transition-smooth"
                    type="button"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">No skills added yet. Start adding your skills above.</p>
          </div>
        )}
      </div>
    </Card>
  );
};


