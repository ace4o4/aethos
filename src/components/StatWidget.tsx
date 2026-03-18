import { motion } from "framer-motion";

interface StatWidgetProps {
  label: string;
  value: string;
  unit?: string;
  delay?: number;
}

const StatWidget = ({ label, value, unit = "", delay = 0 }: StatWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border-t border-white/[0.1] border-l border-r border-b border-white/[0.05] p-5 group aegis-transition hover:bg-white/[0.05]"
    >
      <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase mb-3">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-mono font-bold tracking-tighter text-foreground mono-nums">{value}</span>
        {unit && <span className="text-xs font-mono text-muted-foreground">{unit}</span>}
      </div>
    </motion.div>
  );
};

export default StatWidget;
