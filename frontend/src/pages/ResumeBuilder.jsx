import React from "react";
import { ResumeProvider, useResume } from "../context/ResumeContext";
import { useAuth } from "../context/AuthContext";
import { StepIndicator } from "@/components/ResumeBuilder/StepIndicator";
import FormContainer from "../components/ResumeBuilder/FormContainer";
import { ResumePreview } from "@/components/ResumeBuilder/ResumePreview";
import { FileText, Sparkles, Zap, Stars, User, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const StepIndicatorWrapper = () => {
  const { currentStep, setCurrentStep } = useResume();
  return (
    <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
  );
};

const ResumeBuilder = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Error handled in AuthContext
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
        {/* Animated Background Elements - Scaled down on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 md:top-20 -left-10 md:-left-20 w-48 h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 md:bottom-20 -right-10 md:-right-20 w-48 h-48 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 25, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Header - Fully Responsive */}
        <motion.header 
          className="bg-card/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5 relative z-10 sticky top-0"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-5">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-2 md:gap-4">
                <motion.div 
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/50 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-background" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                      Resume Builder Pro
                    </h1>
                    <span className="text-[10px] sm:text-xs font-normal text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 rounded-md inline-block w-fit">
                      By EliteSolutionsCpa
                    </span>
                  </motion.div>
                  <motion.p 
                    className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-center gap-1 md:gap-1.5 mt-0.5 md:mt-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent flex-shrink-0" />
                    <span className="hidden sm:inline">Create your professional resume in minutes</span>
                    <span className="sm:hidden">Create resume fast</span>
                  </motion.p>
                </div>
              </div>

              {/* Right Side: Live Preview Badge + User Menu */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Live Preview Badge - Hidden on small mobile */}
                <motion.div 
                  className="hidden sm:flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm flex-shrink-0"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary))" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Stars className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                  </motion.div>
                  <span className="text-xs md:text-sm font-medium text-foreground hidden md:inline">Live Preview</span>
                  <span className="text-xs font-medium text-foreground md:hidden">Live</span>
                </motion.div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full border border-primary/20 hover:border-primary/40"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser?.photoURL || userData?.photoURL} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background">
                          {getInitials(currentUser?.displayName || userData?.displayName || currentUser?.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {currentUser?.displayName || userData?.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.email}
                        </p>
                        {userData?.resumeCount !== undefined && (
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {userData.resumeCount} resume{userData.resumeCount !== 1 ? 's' : ''} generated
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content - Responsive Padding */}
        <main className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 relative z-10">
          {/* Step Indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StepIndicatorWrapper />
          </motion.div>

          {/* Split View: Form + Preview - Responsive */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Form Section - Responsive Height */}
            <motion.div 
              className="h-auto min-h-[500px] sm:min-h-[600px] lg:h-[calc(100vh-280px)]"
              whileHover={{ scale: window.innerWidth >= 1024 ? 1.01 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FormContainer />
            </motion.div>

            {/* Preview Section - Desktop Only */}
            <motion.div 
              className="h-[calc(100vh-280px)] min-h-[600px] hidden lg:block"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ResumePreview />
            </motion.div>
          </motion.div>

          {/* Mobile Preview - Better Height */}
          <motion.div 
            className="lg:hidden mt-4 md:mt-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-[500px] sm:h-[600px]">
              <ResumePreview />
            </div>
          </motion.div>
        </main>

        {/* Footer - Responsive */}
        <motion.footer 
          className="border-t border-primary/20 bg-card/60 backdrop-blur-xl mt-8 md:mt-12 relative z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Built with <span className="text-primary animate-pulse">❤️</span> by{" "}
                <a 
                  href="https://elitesolutionscpa.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent hover:underline transition-colors font-medium"
                >
                  EliteSolutionsCpa
                </a>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <motion.span 
                  whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }} 
                  className="cursor-default whitespace-nowrap"
                >
                  5 Templates
                </motion.span>
                <span className="hidden sm:inline">•</span>
                <motion.span 
                  whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }} 
                  className="cursor-default whitespace-nowrap"
                >
                  PDF Export
                </motion.span>
                <span className="hidden sm:inline">•</span>
                <motion.span 
                  whileHover={{ scale: 1.1, color: "hsl(var(--primary))" }} 
                  className="cursor-default whitespace-nowrap"
                >
                  Auto-Save
                </motion.span>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
      <Toaster position="top-center" richColors />
    </ResumeProvider>
  );
};

export default ResumeBuilder;
