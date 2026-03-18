import { motion } from "framer-motion";
import NeuralOrb from "@/components/NeuralOrb";
import GlassZone from "@/components/GlassZone";
import StatWidget from "@/components/StatWidget";
import QuestButton from "@/components/QuestButton";
import { Zap, Shield, Activity, ChevronRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-background" />
      <div
        className="fixed inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 20%, rgba(0,242,254,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">SWARM_DASHBOARD</p>
            <h1 className="text-xl font-mono font-bold tracking-tighter gradient-text-cyan">EVO_AEGIS</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-mono text-success">ONLINE</span>
          </div>
        </motion.div>

        {/* Twin Avatar & Quest CTA */}
        <GlassZone className="p-6 mb-4" glow delay={0.1}>
          <div className="flex items-center gap-5">
            <NeuralOrb size={80} />
            <div className="flex-1">
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase mb-1">DAILY MICRO-QUEST</p>
              <p className="text-sm font-sans text-foreground/90 mb-3">
                Capture a 30-second audio sample to evolve your twin.
              </p>
              <QuestButton className="w-full">
                <Zap className="w-4 h-4 text-primary" />
                <span className="gradient-text-cyan text-xs font-semibold">BEGIN BURST TRAINING</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </QuestButton>
            </div>
          </div>
        </GlassZone>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatWidget label="ZK-PROOFS" value="1,482" delay={0.2} />
          <StatWidget label="LOCAL WEIGHTS" value="847" unit="SYNCED" delay={0.3} />
          <StatWidget label="REWARD POOL" value="0.0042" unit="ETH" delay={0.4} />
          <StatWidget label="TWIN LEVEL" value="07" unit="/ 99" delay={0.5} />
        </div>

        {/* Evolution Timeline */}
        <GlassZone className="p-5 mb-4" delay={0.6}>
          <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase mb-4">NEURAL EVOLUTION</p>
          <div className="space-y-3">
            {[
              { label: "COGNITION", value: 72, color: "bg-primary" },
              { label: "PERCEPTION", value: 58, color: "bg-accent" },
              { label: "SYNTHESIS", value: 41, color: "bg-success" },
            ].map((stat, i) => (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground tracking-wider">{stat.label}</span>
                  <span className="text-[10px] font-mono text-foreground/70 mono-nums">{stat.value}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${stat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassZone>

        {/* Live Feed / Logs */}
        <GlassZone className="p-5" delay={0.8}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3 h-3 text-primary" />
            <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">SWARM ACTIVITY</p>
          </div>
          <div className="space-y-2 font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
            {[
              { time: "14:23:01", msg: "ZK-PROOF #1482 VERIFIED", icon: Shield },
              { time: "14:22:58", msg: "LOCAL WEIGHTS SYNCED TO SWARM", icon: Zap },
              { time: "14:22:41", msg: "BURST TRAINING COMPLETE — +0.0003 ETH", icon: Activity },
              { time: "14:22:12", msg: "NODE_0x7F3A CONNECTED", icon: Shield },
            ].map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-muted-foreground/30 mono-nums">{log.time}</span>
                <log.icon className="w-3 h-3 text-primary/40 shrink-0" />
                <span className="tracking-wider">{log.msg}</span>
              </motion.div>
            ))}
          </div>
        </GlassZone>

        {/* Bottom telemetry bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-center text-[9px] font-mono text-muted-foreground/30 tracking-[0.2em]"
        >
          PROOFS: 1,482 | LATENCY: 14ms | REWARD: 0.0042 ETH
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
