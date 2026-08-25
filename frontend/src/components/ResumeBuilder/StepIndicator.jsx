import React from 'react';
import { Check, FileText, GraduationCap, Briefcase, Brain, Plus, Palette } from 'lucide-react';
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
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <motion.div 
                className={cn(
                  "flex flex-col items-center cursor-pointer relative group",
                )}
                onClick={() => onStepClick(step.id)}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <motion.div 
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 border-2 transition-all duration-300 relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-br from-primary via-primary to-accent border-primary text-white shadow-xl shadow-primary/40"
                      : isComplete
                        ? "bg-primary/15 border-primary text-primary shadow-md shadow-primary/15"
                        : "bg-white border-slate-300 text-slate-600 shadow-md shadow-slate-200/80 ring-1 ring-slate-200"
                  )}
                  animate={isActive ? {
                    y: [0, -4, 0],
                  } : {
                    y: 0
                  }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {isComplete ? (
                    <Check className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 relative z-10 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 relative z-10" />
                  )}
                </motion.div>
                
                <span className={cn(
                  "text-xs sm:text-sm font-medium transition-all duration-300 text-center leading-tight",
                  isActive 
                    ? "text-primary font-semibold"
                    : isComplete
                      ? "text-primary font-medium"
                      : "text-slate-600 group-hover:text-slate-900"
                )}>
                  <span className="hidden sm:inline">{step.name}</span>
                  <span className="sm:hidden">{step.shortName}</span>
                </span>
                
                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-0.5 sm:mx-1 md:mx-2 rounded-full transition-colors duration-500",
                    currentStep > step.id ? "bg-primary/50" : "bg-slate-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
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
