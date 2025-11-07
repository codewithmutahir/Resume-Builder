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
      <div className="min-h-screen relative overflow-hidden">
        {/* Vibrant Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/8 via-primary/6 to-accent/8 rounded-full blur-3xl"
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-accent/8 via-primary/6 to-primary/8 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/4 to-accent/4 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Header - Vibrant with Gradient */}
        <motion.header 
          className="bg-gradient-to-r from-white via-primary/5 to-accent/5 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5 relative z-10 sticky top-0"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-5">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-2 md:gap-4">
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0 relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-light bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight tracking-tight">
                      Resume Builder
                    </h1>
                    <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded-md inline-block border border-primary/20">
                      By EliteSolutionsCpa
                    </span>
                  </motion.div>
                  <motion.p 
                    className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-3 h-3 text-primary flex-shrink-0" />
                    </motion.div>
                    <span>Create your professional resume in minutes</span>
                  </motion.p>
                </div>
              </div>

              {/* Right Side: Live Preview Badge + User Menu */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Live Preview Badge */}
                <motion.div 
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/15 via-primary/10 to-accent/15 border border-primary/30 backdrop-blur-sm flex-shrink-0 shadow-md shadow-primary/10"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(47, 128, 237, 0.2)" }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                    transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                  >
                    <Stars className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Live Preview</span>
                </motion.div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full border border-border hover:border-primary/40 hover:bg-muted/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser?.photoURL || userData?.photoURL} />
                        <AvatarFallback className="bg-primary text-white">
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

        {/* Main Content - Clean Spacing */}
        <main className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10 relative z-10">
          {/* Step Indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StepIndicatorWrapper />
          </motion.div>

          {/* Split View: Form + Preview */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8"
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

        {/* Footer - Minimal */}
        <motion.footer 
          className="border-t border-border bg-white/50 backdrop-blur-sm mt-12 relative z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-muted-foreground">
                Built with <span className="text-primary">❤️</span> by{" "}
                <a 
                  href="https://elitesolutionscpa.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-colors font-medium"
                >
                  EliteSolutionsCpa
                </a>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>5 Templates</span>
                <span>•</span>
                <span>PDF Export</span>
                <span>•</span>
                <span>Auto-Save</span>
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
