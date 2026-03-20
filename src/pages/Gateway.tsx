import { motion } from "framer-motion";
import EvoTwin from "@/components/EvoTwin";
import DoodleThemeToggle from "@/components/DoodleThemeToggle";
import ProcessingButton from "@/components/ProcessingButton";
import StatusBadge from "@/components/StatusBadge";
import { useNavigate } from "react-router-dom";

const Gateway = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="fixed inset-0 bg-background aurora-bg" />
      <div className="fixed inset-0" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 45%, hsl(var(--primary) / 0.08) 0%, hsl(var(--secondary) / 0.04) 40%, transparent 70%)",
      }} />

      {/* Theme toggle */}
      <div className="fixed top-5 right-5 z-50">
        <DoodleThemeToggle />
      </div>

      {/* Hex data stream */}
      <div className="fixed top-0 left-8 opacity-[0.03] font-mono text-[10px] leading-4 select-none pointer-events-none overflow-hidden h-full">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 3, delay: i * 0.15, repeat: Infinity }}
          >
            {Math.random().toString(16).slice(2, 18).toUpperCase()}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <EvoTwin size={240} level={1} mood="curious" label="Evo-1X" sublabel="INITIALIZATION" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-3xl sm:text-4xl font-mono font-bold tracking-tighter mb-4 mt-6"
        >
          <span className="gradient-text-aurora">JOIN THE GLOBAL</span>
          <br />
          <span className="text-foreground">INTELLIGENCE_</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-sm text-muted-foreground font-sans leading-relaxed mb-10 max-w-sm"
        >
          Train your personal AI twin through micro-quests. Earn rewards while contributing to the decentralized swarm intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ProcessingButton variant="primary" onClick={() => navigate("/genesis")}>
            INITIALIZE VIA PRIVY
          </ProcessingButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex items-center gap-4"
        >
          <StatusBadge label="ZK-FL v0.9.1" variant="neutral" pulse={false} />
          <StatusBadge label="NODES: 2,847" variant="active" />
          <StatusBadge label="14ms" variant="success" pulse={false} />
        </motion.div>
      </div>
    </div>
  );
};

export default Gateway;
