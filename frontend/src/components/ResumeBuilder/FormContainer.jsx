import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { PersonalDetailsForm } from './PersonalDetailsForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { AdditionalInfoForm } from './AdditionalInfoForm';
import { TemplateSelector } from './TemplateSelector';
import { toast } from 'sonner';

const steps = [
  { id: 0, component: PersonalDetailsForm, title: 'Personal Details' },
  { id: 1, component: EducationForm, title: 'Education' },
  { id: 2, component: ExperienceForm, title: 'Work Experience' },
  { id: 3, component: SkillsForm, title: 'Skills' },
  { id: 4, component: AdditionalInfoForm, title: 'Additional Information' },
  { id: 5, component: TemplateSelector, title: 'Choose Template' }
];

const FormContainer = () => {
  const { currentStep, setCurrentStep, resumeData, resetResume } = useResume();
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast.success('Progress saved!');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetResume();
      toast.success('Resume data has been reset');
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{steps[currentStep].title}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <CurrentStepComponent />
      </div>

      <div className="p-6 border-t bg-card flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={isFirstStep}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Save className="w-4 h-4" />
          <span>Auto-saved</span>
        </div>

        <Button
          onClick={handleNext}
          disabled={isLastStep}
          className="gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default FormContainer;