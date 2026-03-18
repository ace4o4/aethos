import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassZoneProps {
  children: ReactNode;
  className?: string;
  topLit?: boolean;
  glow?: boolean;
  delay?: number;
}

const GlassZone = ({ children, className = "", topLit = true, glow = false, delay = 0 }: GlassZoneProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={`
        relative rounded-2xl bg-white/[0.03] backdrop-blur-xl
        ${topLit ? "border-t border-white/[0.1] border-l border-r border-b border-white/[0.05]" : "border border-white/[0.06]"}
        ${glow ? "glow-cyan" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassZone;
