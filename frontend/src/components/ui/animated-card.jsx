import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedCard = ({ children, className, delay = 0, ...props }) => {
  return (
    <motion.div
      className={cn(
        "glass-effect rounded-lg shadow-lg hover:shadow-xl",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px hsl(var(--primary) / 0.15)" 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      className={cn(
        "relative overflow-hidden",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0"
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.button>
  );
};

