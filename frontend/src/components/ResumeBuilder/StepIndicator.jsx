import React from 'react';
import { CheckCircle2, FileText, GraduationCap, Briefcase, Brain, Plus, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const steps = [
  { id: 0, name: 'Personal', shortName: 'Info', icon: FileText },
  { id: 1, name: 'Education', shortName: 'Edu', icon: GraduationCap },
  { id: 2, name: 'Experience', shortName: 'Exp', icon: Briefcase },
  { id: 3, name: 'Skills', shortName: 'Skills', icon: Brain },
  { id: 4, name: 'Additional', shortName: 'More', icon: Plus },
  { id: 5, name: 'Template', shortName: 'Style', icon: Palette }
];

export const StepIndicator = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full py-3 sm:py-4 md:py-6">
      <div className="flex items-center justify-between max-w-full sm:max-w-2xl md:max-w-3xl mx-auto px-2 sm:px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <motion.div 
                className={cn(
                  "flex flex-col items-center cursor-pointer relative group",
                )}
                onClick={() => onStepClick(step.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 sm:mb-1.5 md:mb-2 border-2 transition-all duration-300",
                    currentStep === step.id 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110"
                      : currentStep > step.id
                        ? "bg-success border-success text-success-foreground shadow-md"
                        : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                  )}
                  animate={currentStep === step.id ? {
                    boxShadow: [
                      "0 0 20px hsl(var(--primary) / 0.5)",
                      "0 0 30px hsl(var(--primary) / 0.7)",
                      "0 0 20px hsl(var(--primary) / 0.5)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  )}
                </motion.div>
                
                {/* Step Name - Show short name on mobile, full name on desktop */}
                <span className={cn(
                  "text-[9px] sm:text-[10px] md:text-xs font-medium transition-all duration-300 text-center leading-tight",
                  currentStep === step.id 
                    ? "text-primary font-bold"
                    : currentStep > step.id
                      ? "text-success"
                      : "text-muted-foreground group-hover:text-foreground"
                )}>
                  <span className="hidden sm:inline">{step.name}</span>
                  <span className="sm:hidden">{step.shortName}</span>
                </span>
                
                {/* Active indicator dot */}
                {currentStep === step.id && (
                  <motion.div
                    className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div 
                  className={cn(
                    "flex-1 h-0.5 mx-0.5 sm:mx-1 md:mx-2 transition-all duration-500 rounded-full",
                    currentStep > step.id ? "bg-success" : "bg-border"
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  style={{ originX: 0 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Current Step Title - Mobile Only */}
      <motion.div 
        className="sm:hidden text-center mt-3"
        key={currentStep}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-semibold text-foreground">
          {steps[currentStep].name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Step {currentStep + 1} of {steps.length}
        </p>
      </motion.div>
    </div>
  );
};
