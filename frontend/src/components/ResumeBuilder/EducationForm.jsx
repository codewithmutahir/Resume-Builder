import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

export const EducationForm = () => {
  const { resumeData, updateEducation } = useResume();
  const [education, setEducation] = useState(resumeData.education.length > 0 ? resumeData.education : [
    { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }
  ]);

  const handleAdd = () => {
    const newEducation = [...education, { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }];
    setEducation(newEducation);
    updateEducation(newEducation);
  };

  const handleRemove = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
    updateEducation(newEducation);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
    updateEducation(newEducation);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Education</h2>
        <p className="text-sm text-muted-foreground">Add your educational background, starting with the most recent.</p>
      </div>

      {education.map((edu, index) => (
        <Card key={index} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Education #{index + 1}</h3>
            {education.length > 1 && (
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
              <Label>School / University *</Label>
              <Input
                placeholder="Harvard University"
                value={edu.school}
                onChange={(e) => handleChange(index, 'school', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input
                placeholder="Bachelor of Science"
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                placeholder="Computer Science"
                value={edu.field}
                onChange={(e) => handleChange(index, 'field', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Relevant coursework, achievements, GPA, etc."
                className="min-h-[80px]"
                value={edu.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
              />
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
        Add Another Education
      </Button>
    </div>
  );
};