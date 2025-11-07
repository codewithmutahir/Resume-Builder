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
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <motion.div 
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 border-2 transition-all duration-300 shadow-lg relative overflow-hidden",
                    currentStep === step.id 
                      ? "bg-gradient-to-br from-primary via-primary to-accent border-primary text-white shadow-xl shadow-primary/40"
                      : currentStep > step.id
                        ? "bg-success border-success text-white shadow-md"
                        : "bg-white border-border text-muted-foreground hover:border-primary/50 hover:shadow-md"
                  )}
                  animate={currentStep === step.id ? {
                    y: [0, -6, 0],
                    boxShadow: [
                      "0 8px 20px rgba(47, 128, 237, 0.3)",
                      "0 12px 30px rgba(47, 128, 237, 0.4)",
                      "0 8px 20px rgba(47, 128, 237, 0.3)"
                    ]
                  } : {
                    y: 0
                  }}
                  transition={{ 
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  {currentStep === step.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 relative z-10" />
                  ) : (
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 relative z-10" />
                  )}
                </motion.div>
                
                {/* Step Name - Show short name on mobile, full name on desktop */}
                <span className={cn(
                  "text-xs sm:text-sm font-medium transition-all duration-300 text-center leading-tight",
                  currentStep === step.id 
                    ? "text-primary font-semibold"
                    : currentStep > step.id
                      ? "text-success font-medium"
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
