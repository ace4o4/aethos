import { motion } from "framer-motion";
import { ReactNode } from "react";

interface QuestButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const QuestButton = ({ children, onClick, className = "" }: QuestButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`relative group cursor-pointer ${className}`}
    >
      {/* Spinning conic gradient border */}
      <div className="absolute -inset-[1px] rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 0deg, #00F2FE, #7C3AED, #00F2FE)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Inner content */}
      <div className="relative rounded-xl bg-background/95 backdrop-blur-xl px-8 py-4 font-mono text-sm tracking-wider text-foreground flex items-center justify-center gap-3 aegis-transition group-hover:bg-background/80">
        {children}
      </div>
    </motion.button>
  );
};

export default QuestButton;
