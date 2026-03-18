import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import QuestButton from "@/components/QuestButton";

const GenesisRoom = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "recording" | "synthesizing" | "complete">("idle");
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(32).fill(0.1));
  const [progress, setProgress] = useState(0);

  // Simulate audio visualizer
  useEffect(() => {
    if (phase !== "recording") return;
    const interval = setInterval(() => {
      setAudioLevels(prev => prev.map(() => 0.1 + Math.random() * 0.9));
    }, 80);
    // Auto-complete recording after 4s
    const timeout = setTimeout(() => setPhase("synthesizing"), 4000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase]);

  // Synthesizing progress
  useEffect(() => {
    if (phase !== "synthesizing") return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setPhase("complete");
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [phase]);

  // Navigate on complete
  useEffect(() => {
    if (phase === "complete") {
      const t = setTimeout(() => navigate("/dashboard"), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, navigate]);

  const synthLabel = useMemo(() => {
    if (progress < 30) return "Extracting vocal patterns...";
    if (progress < 60) return "Mapping neural baseline...";
    if (progress < 85) return "Calibrating twin resonance...";
    return "Synthesizing Neural Baseline...";
  }, [progress]);

  const handleStart = useCallback(() => setPhase("recording"), []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Aurora background */}
      <div className="fixed inset-0 bg-background aurora-bg" />
      <div className="fixed inset-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(160,80,255,0.08) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Phase: Idle */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tighter mb-3">
                <span className="gradient-text-aurora">GENESIS_ROOM</span>
              </h1>
              <p className="text-sm text-muted-foreground font-sans mb-10 max-w-xs leading-relaxed">
                Speak for a few seconds to create your Evo Twin's neural baseline.
              </p>

              {/* Mic button with pulsing ring */}
              <div className="relative mb-8">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "conic-gradient(from 0deg, #00E6DC, #A050FF, #FFB432, #00E6DC)" }}
                  animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                  transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-24 h-24 rounded-full bg-card flex items-center justify-center cursor-pointer m-[3px]"
                >
                  <Mic className="w-8 h-8 text-primary" />
                </motion.button>
              </div>

              <p className="text-[10px] font-mono text-muted-foreground/50 tracking-widest">TAP TO BEGIN</p>
            </motion.div>
          )}

          {/* Phase: Recording — Audio Visualizer */}
          {phase === "recording" && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs font-mono text-primary tracking-widest mb-8"
              >
                ● RECORDING
              </motion.div>

              {/* Circular audio visualizer */}
              <div className="relative w-56 h-56 mb-8">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {audioLevels.map((level, i) => {
                    const angle = (i / audioLevels.length) * Math.PI * 2 - Math.PI / 2;
                    const innerR = 55;
                    const outerR = innerR + level * 35;
                    const x1 = 100 + Math.cos(angle) * innerR;
                    const y1 = 100 + Math.sin(angle) * innerR;
                    const x2 = 100 + Math.cos(angle) * outerR;
                    const y2 = 100 + Math.sin(angle) * outerR;
                    const hue = 175 + (i / audioLevels.length) * 120;
                    return (
                      <motion.line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={`hsl(${hue}, 80%, 60%)`}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        initial={false}
                        animate={{ x2, y2 }}
                        transition={{ duration: 0.08 }}
                        opacity={0.8}
                      />
                    );
                  })}
                  {/* Center dot */}
                  <circle cx="100" cy="100" r="8" fill="url(#coreGrad)" />
                  <defs>
                    <radialGradient id="coreGrad">
                      <stop offset="0%" stopColor="#00E6DC" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#A050FF" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              <p className="text-xs font-mono text-muted-foreground tracking-wider">SPEAK NATURALLY...</p>
            </motion.div>
          )}

          {/* Phase: Synthesizing */}
          {phase === "synthesizing" && (
            <motion.div
              key="synthesizing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full mb-8"
                style={{
                  background: "conic-gradient(from 0deg, #00E6DC, #A050FF, #FFB432, transparent)",
                  mask: "radial-gradient(circle, transparent 55%, black 56%)",
                  WebkitMask: "radial-gradient(circle, transparent 55%, black 56%)",
                }}
              />

              <p className="text-sm font-mono text-foreground tracking-wider mb-2 gradient-text-aurora">
                {synthLabel}
              </p>
              <p className="text-xs font-mono text-muted-foreground mono-nums mb-6">{progress}%</p>

              {/* Progress bar */}
              <div className="w-full max-w-xs h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #00E6DC, #A050FF, #FFB432)",
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}

          {/* Phase: Complete */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "linear-gradient(135deg, #00E6DC, #A050FF)",
                  boxShadow: "0 0 40px rgba(0,230,220,0.3), 0 0 80px rgba(160,80,255,0.15)",
                }}
              >
                <span className="text-3xl">✓</span>
              </motion.div>
              <h2 className="text-xl font-mono font-bold tracking-tighter gradient-text-cyan">TWIN INITIALIZED</h2>
              <p className="text-xs font-mono text-muted-foreground mt-2 tracking-wider">REDIRECTING TO SWARM...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GenesisRoom;
