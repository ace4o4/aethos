import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, X, CheckCircle } from "lucide-react";
import QuestButton from "@/components/QuestButton";

type Phase = "select" | "capture" | "burst" | "complete";
type CaptureMode = "audio" | "image";
type BurstStage = "quantizing" | "fine-tuning" | "securing";

const burstStages: { key: BurstStage; label: string; color: string }[] = [
  { key: "quantizing", label: "QUANTIZING", color: "#00E6DC" },
  { key: "fine-tuning", label: "FINE-TUNING", color: "#A050FF" },
  { key: "securing", label: "SECURING WITH S²", color: "#FFB432" },
];

const ZkVeilOverlay = ({ active, onDone }: { active: boolean; onDone: () => void }) => {
  const [hexGrid, setHexGrid] = useState<string[]>([]);

  useEffect(() => {
    if (!active) return;
    // Generate hex grid
    const cells: string[] = [];
    for (let i = 0; i < 600; i++) {
      cells.push(Math.random().toString(16).slice(2, 6).toUpperCase());
    }
    setHexGrid(cells);

    const timeout = setTimeout(onDone, 800);
    return () => clearTimeout(timeout);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-wrap overflow-hidden"
      style={{ gap: 0 }}
    >
      {hexGrid.map((hex, i) => (
        <motion.div
          key={i}
          className="font-mono text-[6px] flex items-center justify-center"
          style={{
            width: "4%",
            height: "4%",
            color: `hsl(${175 + Math.random() * 120}, 80%, ${40 + Math.random() * 30}%)`,
            backgroundColor: `rgba(${Math.random() * 20}, ${Math.random() * 15}, ${30 + Math.random() * 30}, 0.95)`,
          }}
          animate={{
            opacity: [0.2, 1, 0.4, 0.9, 0.3],
          }}
          transition={{
            duration: 0.6,
            delay: Math.random() * 0.3,
            ease: "linear",
          }}
        >
          {hex}
        </motion.div>
      ))}
    </motion.div>
  );
};

const MicroQuest = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("select");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("audio");
  const [burstProgress, setBurstProgress] = useState(0);
  const [zkVeil, setZkVeil] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(24).fill(0.1));

  const currentBurstStage = useMemo<BurstStage>(() => {
    if (burstProgress < 33) return "quantizing";
    if (burstProgress < 66) return "fine-tuning";
    return "securing";
  }, [burstProgress]);

  // Audio sim
  useEffect(() => {
    if (phase !== "capture" || captureMode !== "audio") return;
    const interval = setInterval(() => {
      setAudioLevels(prev => prev.map(() => 0.05 + Math.random() * 0.95));
    }, 100);
    const timeout = setTimeout(() => setPhase("burst"), 3500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase, captureMode]);

  // Image capture sim
  useEffect(() => {
    if (phase !== "capture" || captureMode !== "image") return;
    const timeout = setTimeout(() => setPhase("burst"), 2500);
    return () => clearTimeout(timeout);
  }, [phase, captureMode]);

  // Burst training progress
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

  // ZK-Veil on complete
  useEffect(() => {
    if (phase === "complete") setZkVeil(true);
  }, [phase]);

  const handleZkDone = useCallback(() => {
    setZkVeil(false);
  }, []);

  const handleFinish = useCallback(() => navigate("/dashboard"), [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="fixed inset-0 bg-background aurora-bg" />
      <div className="fixed inset-0" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(0,230,220,0.06) 0%, transparent 70%)",
      }} />

      {/* ZK-Veil */}
      <AnimatePresence>
        {zkVeil && <ZkVeilOverlay active={zkVeil} onDone={handleZkDone} />}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-between mb-8"
        >
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">MICRO-QUEST_01</p>
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground aegis-transition">
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Select capture mode */}
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <h1 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">CAPTURE_DATA</h1>
              <p className="text-sm text-muted-foreground font-sans mb-10">Choose your contribution method</p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                {[
                  { mode: "audio" as CaptureMode, icon: Mic, label: "AUDIO", desc: "30s voice sample" },
                  { mode: "image" as CaptureMode, icon: Camera, label: "IMAGE", desc: "Visual capture" },
                ].map(({ mode, icon: Icon, label, desc }) => (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCaptureMode(mode)}
                    className={`glass-surface p-6 flex flex-col items-center gap-3 cursor-pointer aegis-transition ${
                      captureMode === mode ? "border-glow glow-cyan" : ""
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${captureMode === mode ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-mono tracking-wider text-foreground">{label}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{desc}</span>
                  </motion.button>
                ))}
              </div>

              <QuestButton onClick={() => setPhase("capture")} variant="primary">
                <span className="gradient-text-cyan text-xs font-semibold">BEGIN CAPTURE</span>
              </QuestButton>
            </motion.div>
          )}

          {/* Capture phase */}
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
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-mono text-primary tracking-widest mb-8"
                  >
                    ● RECORDING AUDIO
                  </motion.div>

                  {/* Horizontal waveform */}
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
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-mono text-accent tracking-widest mb-8"
                  >
                    ● CAPTURING IMAGE
                  </motion.div>

                  {/* Camera viewfinder */}
                  <div className="relative w-64 h-48 glass-surface overflow-hidden mb-8 flex items-center justify-center">
                    <div className="absolute inset-3 border border-primary/30 rounded-lg" />
                    {/* Corner brackets */}
                    {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
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

                  <p className="text-xs font-mono text-muted-foreground tracking-wider">ANALYZING VISUAL DATA...</p>
                </>
              )}
            </motion.div>
          )}

          {/* Burst Training */}
          {phase === "burst" && (
            <motion.div
              key="burst"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="text-lg font-mono font-bold tracking-tighter gradient-text-aurora mb-8">BURST TRAINING</h2>

              {/* Stages */}
              <div className="w-full max-w-xs space-y-5 mb-8">
                {burstStages.map((stage, i) => {
                  const isActive = currentBurstStage === stage.key;
                  const isDone = burstStages.findIndex(s => s.key === currentBurstStage) > i;
                  return (
                    <div key={stage.key} className="flex items-center gap-4">
                      <motion.div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          border: `2px solid ${isDone ? stage.color : isActive ? stage.color : "rgba(255,255,255,0.1)"}`,
                          backgroundColor: isDone ? stage.color + "30" : "transparent",
                        }}
                        animate={isActive ? { scale: [1, 1.1, 1], boxShadow: [`0 0 0px ${stage.color}00`, `0 0 15px ${stage.color}40`, `0 0 0px ${stage.color}00`] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4" style={{ color: stage.color }} />
                        ) : (
                          <span className="text-[10px] font-mono" style={{ color: isActive ? stage.color : "rgba(255,255,255,0.2)" }}>{i + 1}</span>
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

              {/* Overall progress */}
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-2">
                  <span>PROGRESS</span>
                  <span className="mono-nums">{Math.min(100, Math.round(burstProgress))}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #00E6DC, #A050FF, #FFB432)" }}
                    animate={{ width: `${Math.min(100, burstProgress)}%` }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              </div>

              {/* Background hex stream */}
              <div className="absolute bottom-8 left-0 right-0 text-center text-[8px] font-mono text-muted-foreground/20 tracking-wider overflow-hidden h-16">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
                  >
                    {Array.from({ length: 8 }, () => Math.random().toString(16).slice(2, 8).toUpperCase()).join(" ")}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Complete */}
          {phase === "complete" && !zkVeil && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-col items-center"
            >
              {/* Burst particles */}
              <div className="relative w-32 h-32 mb-8">
                {[...Array(12)].map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  const colors = ["#00E6DC", "#A050FF", "#FFB432", "#00B4FF"];
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: "50%", top: "50%",
                        backgroundColor: colors[i % colors.length],
                      }}
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      animate={{
                        x: Math.cos(angle) * 80,
                        y: Math.sin(angle) * 80,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    />
                  );
                })}
                <motion.div
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #00E6DC, #A050FF)",
                    boxShadow: "0 0 50px rgba(0,230,220,0.4), 0 0 100px rgba(160,80,255,0.2)",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <span className="text-4xl font-bold text-background">✓</span>
                </motion.div>
              </div>

              <h2 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">QUEST COMPLETE</h2>
              <p className="text-sm font-mono text-success mono-nums mb-6">+0.0003 ETH EARNED</p>

              <QuestButton onClick={handleFinish} variant="primary">
                <span className="gradient-text-cyan text-xs font-semibold">RETURN TO SWARM</span>
              </QuestButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MicroQuest;
