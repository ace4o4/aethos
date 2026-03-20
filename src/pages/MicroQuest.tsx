import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, X, CheckCircle } from "lucide-react";
import DoodleThemeToggle from "@/components/DoodleThemeToggle";
import EvoTwin from "@/components/EvoTwin";
import ProcessingButton from "@/components/ProcessingButton";
import PremiumCard from "@/components/PremiumCard";
import StatusBadge from "@/components/StatusBadge";

type Phase = "select" | "capture" | "burst" | "complete";
type CaptureMode = "audio" | "image";
type BurstStage = "quantizing" | "fine-tuning" | "securing";

const burstStages: { key: BurstStage; label: string; color: string }[] = [
  { key: "quantizing", label: "QUANTIZING", color: "hsl(175, 90%, 55%)" },
  { key: "fine-tuning", label: "FINE-TUNING", color: "hsl(280, 70%, 60%)" },
  { key: "securing", label: "SECURING WITH S²", color: "hsl(35, 95%, 60%)" },
];

const MicroQuest = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("select");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("audio");
  const [burstProgress, setBurstProgress] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(24).fill(0.1));

  const currentBurstStage = useMemo<BurstStage>(() => {
    if (burstProgress < 33) return "quantizing";
    if (burstProgress < 66) return "fine-tuning";
    return "securing";
  }, [burstProgress]);

  const twinMood = useMemo(() => {
    if (phase === "select") return "curious" as const;
    if (phase === "capture") return "excited" as const;
    if (phase === "burst") return "thinking" as const;
    return "happy" as const;
  }, [phase]);

  useEffect(() => {
    if (phase !== "capture" || captureMode !== "audio") return;
    const interval = setInterval(() => {
      setAudioLevels(prev => prev.map(() => 0.05 + Math.random() * 0.95));
    }, 100);
    const timeout = setTimeout(() => setPhase("burst"), 3500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase, captureMode]);

  useEffect(() => {
    if (phase !== "capture" || captureMode !== "image") return;
    const timeout = setTimeout(() => setPhase("burst"), 2500);
    return () => clearTimeout(timeout);
  }, [phase, captureMode]);

  useEffect(() => {
    if (phase !== "burst") return;
    const interval = setInterval(() => {
      setBurstProgress(prev => {
        if (prev >= 100) {
          setPhase("complete");
          return 100;
        }
        return prev + 1.2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  const handleFinish = useCallback(() => navigate("/dashboard"), [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="fixed inset-0 bg-background aurora-bg" />
      <div className="fixed inset-0" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 40%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
      }} />

      {/* Theme toggle */}
      <div className="fixed top-5 right-5 z-50">
        <DoodleThemeToggle />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-between mb-6"
        >
          <StatusBadge label="MICRO-QUEST_01" variant="active" />
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground aegis-transition">
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Mini EvoTwin companion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <EvoTwin size={80} level={7} mood={twinMood} />
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <h1 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">CAPTURE_DATA</h1>
              <p className="text-sm text-muted-foreground font-sans mb-8">Choose your contribution method</p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                {[
                  { mode: "audio" as CaptureMode, icon: Mic, label: "AUDIO", desc: "30s voice sample" },
                  { mode: "image" as CaptureMode, icon: Camera, label: "IMAGE", desc: "Visual capture" },
                ].map(({ mode, icon: Icon, label, desc }) => (
                  <PremiumCard
                    key={mode}
                    variant={captureMode === mode ? "gradient" : "default"}
                    glow={captureMode === mode ? "cyan" : "none"}
                    hoverable
                    delay={0}
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setCaptureMode(mode)}
                      className="flex flex-col items-center gap-3 w-full cursor-pointer"
                    >
                      <Icon className={`w-8 h-8 ${captureMode === mode ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-mono tracking-wider text-foreground">{label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{desc}</span>
                    </motion.button>
                  </PremiumCard>
                ))}
              </div>

              <ProcessingButton
                variant="primary"
                onClick={() => setPhase("capture")}
                className="w-full max-w-xs"
              >
                BEGIN CAPTURE
              </ProcessingButton>
            </motion.div>
          )}

          {phase === "capture" && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center w-full"
            >
              {captureMode === "audio" ? (
                <>
                  <StatusBadge label="RECORDING AUDIO" variant="active" className="mb-8" />

                  <div className="flex items-center justify-center gap-[3px] h-32 mb-8">
                    {audioLevels.map((level, i) => {
                      const hue = 175 + (i / audioLevels.length) * 105;
                      return (
                        <motion.div
                          key={i}
                          className="w-2 rounded-full"
                          style={{ backgroundColor: `hsl(${hue}, 75%, 55%)` }}
                          animate={{ height: `${level * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      );
                    })}
                  </div>

                  <p className="text-xs font-mono text-muted-foreground tracking-wider">CAPTURING VOCAL SIGNATURE...</p>
                </>
              ) : (
                <>
                  <StatusBadge label="CAPTURING IMAGE" variant="pending" className="mb-8" />

                  <PremiumCard variant="outlined" className="w-64 mb-8" hoverable={false}>
                    <div className="relative h-40 flex items-center justify-center">
                      <div className="absolute inset-0 border border-primary/30 rounded-lg" />
                      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-4 h-4`}>
                          <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-full h-[2px] bg-primary/60`} />
                          <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-[2px] h-full bg-primary/60`} />
                        </div>
                      ))}
                      <Camera className="w-10 h-10 text-muted-foreground/30" />
                      <motion.div
                        className="absolute inset-0 bg-primary/5"
                        animate={{ opacity: [0, 0.1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </PremiumCard>

                  <p className="text-xs font-mono text-muted-foreground tracking-wider">ANALYZING VISUAL DATA...</p>
                </>
              )}
            </motion.div>
          )}

          {phase === "burst" && (
            <motion.div
              key="burst"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="text-lg font-mono font-bold tracking-tighter gradient-text-aurora mb-8">BURST TRAINING</h2>

              <div className="w-full max-w-xs space-y-5 mb-8">
                {burstStages.map((stage, i) => {
                  const isActive = currentBurstStage === stage.key;
                  const isDone = burstStages.findIndex(s => s.key === currentBurstStage) > i;
                  return (
                    <div key={stage.key} className="flex items-center gap-4">
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          border: `2px solid ${isDone ? stage.color : isActive ? stage.color : "hsl(var(--border))"}`,
                          backgroundColor: isDone ? `${stage.color}30` : "transparent",
                        }}
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4" style={{ color: stage.color }} />
                        ) : (
                          <span className="text-[10px] font-mono" style={{ color: isActive ? stage.color : "hsl(var(--muted-foreground))" }}>{i + 1}</span>
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <p className={`text-xs font-mono tracking-wider ${isActive || isDone ? "text-foreground" : "text-muted-foreground/40"}`}>
                          {stage.label}
                        </p>
                        {isActive && (
                          <div className="mt-2 h-1 rounded-full bg-muted/30 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: stage.color }}
                              animate={{ width: ["0%", "100%"] }}
                              transition={{ duration: 1.8, ease: "easeInOut" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="w-full max-w-xs">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-2">
                  <span>PROGRESS</span>
                  <span className="mono-nums">{Math.min(100, Math.round(burstProgress))}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))" }}
                    animate={{ width: `${Math.min(100, burstProgress)}%` }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-col items-center"
            >
              <EvoTwin size={120} level={8} mood="happy" className="mb-6" />

              <StatusBadge label="COMPLETE" variant="success" className="mb-4" />
              <h2 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">QUEST COMPLETE</h2>
              <p className="text-sm font-mono text-success mono-nums mb-6">+0.0003 ETH EARNED</p>

              <ProcessingButton variant="primary" onClick={handleFinish} className="w-full max-w-xs">
                RETURN TO SWARM
              </ProcessingButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MicroQuest;
