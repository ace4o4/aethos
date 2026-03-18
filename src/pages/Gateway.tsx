import { motion } from "framer-motion";
import NeuralOrb from "@/components/NeuralOrb";
import QuestButton from "@/components/QuestButton";
import { useNavigate } from "react-router-dom";

const Gateway = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background ambient layers */}
      <div className="fixed inset-0 bg-background" />
      <div
        className="fixed inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,242,254,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 60% 60%, rgba(127,58,237,0.1) 0%, transparent 60%)",
        }}
      />

      {/* Floating hex data stream (background decoration) */}
      <div className="fixed top-0 left-8 opacity-[0.04] font-mono text-[10px] leading-4 select-none pointer-events-none overflow-hidden h-full">
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
        {/* Neural Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <NeuralOrb size={260} className="mb-8" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-3xl sm:text-4xl font-mono font-bold tracking-tighter mb-4"
        >
          <span className="gradient-text-cyan">JOIN THE GLOBAL</span>
          <br />
          <span className="text-foreground">INTELLIGENCE_</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-sm text-muted-foreground font-sans leading-relaxed mb-10 max-w-sm"
        >
          Train your personal AI twin through micro-quests. Earn rewards while contributing to the decentralized swarm intelligence.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <QuestButton onClick={() => navigate("/dashboard")}>
            <span className="gradient-text-cyan font-semibold">INITIALIZE VIA PRIVY</span>
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </QuestButton>
        </motion.div>

        {/* Bottom telemetry */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex items-center gap-6 text-[10px] font-mono text-muted-foreground/50 tracking-widest"
        >
          <span>ZK-FL v0.9.1</span>
          <span className="w-1 h-1 rounded-full bg-success" />
          <span>NODES: 2,847</span>
          <span className="w-1 h-1 rounded-full bg-primary/50" />
          <span>LATENCY: 14ms</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Gateway;
