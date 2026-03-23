import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, X, CheckCircle, Square, Play, RotateCcw, Zap } from "lucide-react";
import DoodleThemeToggle from "@/components/DoodleThemeToggle";
import EvoTwin from "@/components/EvoTwin";
import ProcessingButton from "@/components/ProcessingButton";
import PremiumCard from "@/components/PremiumCard";
import StatusBadge from "@/components/StatusBadge";
import { playClick, playWhoosh, playSuccess } from "@/lib/sounds";

type Phase = "select" | "capture" | "preview" | "burst" | "broadcasting" | "complete";
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
  const [txHash, setTxHash] = useState<string>("");
  
  // Hardware Capture State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(24).fill(0.1));
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentBurstStage = useMemo<BurstStage>(() => {
    if (burstProgress < 33) return "quantizing";
    if (burstProgress < 66) return "fine-tuning";
    return "securing";
  }, [burstProgress]);

  const twinMood = useMemo(() => {
    if (phase === "select") return "curious";
    if (phase === "capture") return "excited";
    if (phase === "preview") return "thinking";
    if (phase === "burst") return "thinking";
    if (phase === "broadcasting") return "thinking";
    return "happy";
  }, [phase]);

  // Clean up media streams
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return stopStream;
  }, [stopStream]);

  // Fake Audio Visualizer while recording
  useEffect(() => {
    if (phase !== "capture" || captureMode !== "audio") return;
    const interval = setInterval(() => {
      setAudioLevels(prev => prev.map(() => 0.1 + Math.random() * 0.9));
    }, 100);
    return () => clearInterval(interval);
  }, [phase, captureMode]);

  // ML Burst Training 
  useEffect(() => {
    if (phase !== "burst") return;
    let isMounted = true;
    
    import("@/lib/ml").then(({ runBurstTraining }) => {
      runBurstTraining(captureMode, (progress) => {
        if (isMounted) setBurstProgress(Math.min(100, progress));
      }).then((result) => {
        if (isMounted) {
          setTxHash(result.txHash);
          setPhase("broadcasting");
        }
      }).catch((err) => {
        console.error("Burst training error", err);
      });
    });

    return () => { isMounted = false; };
  }, [phase, captureMode]);

  // Broadcasting Simulation
  useEffect(() => {
    if (phase !== "broadcasting") return;
    const timeout = setTimeout(() => {
      setPhase("complete");
      playSuccess();
    }, 3500);
    return () => clearTimeout(timeout);
  }, [phase]);

  const handleFinish = useCallback(() => {
    playClick();
    playWhoosh();
    stopStream();
    navigate("/dashboard");
  }, [navigate, stopStream]);

  const handleModeSelect = useCallback((mode: CaptureMode) => {
    playClick();
    setCaptureMode(mode);
  }, []);

  const startHardwareCapture = useCallback(async () => {
    playClick();
    setMediaUrl(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia(
        captureMode === "audio" ? { audio: true } : { video: { facingMode: "user" } }
      );
      setStream(s);
      
      // If video, attach stream immediately (setTimeout to wait for react state render)
      if (captureMode === "image") {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(e => console.error(e));
          }
        }, 100);
      }
      setPhase("capture");
    } catch (err) {
      console.error("Camera/Mic access denied", err);
      // Fallback if user denies permissions or has no camera (desktop PC)
      setMediaUrl(captureMode === "audio" ? "mock_audio.mp3" : "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop");
      setPhase("preview");
    }
  }, [captureMode]);

  const takePhoto = useCallback(() => {
    playClick();
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setMediaUrl(canvas.toDataURL("image/jpeg", 0.8));
      }
    }
    stopStream();
    setPhase("preview");
  }, [stopStream]);

  const stopAudioRecording = useCallback(() => {
    playClick();
    // In a real app we'd use MediaRecorder and blob the audio.
    // For this demo, we'll just stop the active mic and mock an audio URL
    setMediaUrl("mock_audio_captured.mp3");
    stopStream();
    setPhase("preview");
  }, [stopStream]);

  const handleRetake = useCallback(() => {
    playClick();
    setPhase("select");
  }, []);

  const handleTrain = useCallback(() => {
    playClick();
    playWhoosh();
    setPhase("burst");
  }, []);

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6 bg-[#030712]">
      {/* Background UI */}
      <div className="absolute inset-0 bg-background aurora-bg pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 40%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
      }} />

      <div className="absolute top-5 right-5 z-50">
        <DoodleThemeToggle />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex items-center justify-between mb-6">
          <StatusBadge label="MICRO-QUEST_01" variant="active" />
          <button onClick={handleFinish} className="text-muted-foreground hover:text-foreground aegis-transition">
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <EvoTwin size={80} level={7} mood={twinMood} interactive />
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === "select" && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center w-full">
              <h1 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">CAPTURE_DATA</h1>
              <p className="text-sm text-muted-foreground font-sans mb-8">Choose your contribution method</p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                {[
                  { mode: "audio" as CaptureMode, icon: Mic, label: "AUDIO", desc: "Voice note" },
                  { mode: "image" as CaptureMode, icon: Camera, label: "IMAGE", desc: "Visual capture" },
                ].map(({ mode, icon: Icon, label, desc }) => (
                  <PremiumCard key={mode} variant={captureMode === mode ? "gradient" : "default"} glow={captureMode === mode ? "cyan" : "none"} hoverable delay={0}>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleModeSelect(mode)} className="flex flex-col items-center gap-3 w-full cursor-pointer">
                      <Icon className={`w-8 h-8 ${captureMode === mode ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-mono tracking-wider text-foreground">{label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{desc}</span>
                    </motion.button>
                  </PremiumCard>
                ))}
              </div>
              <ProcessingButton variant="primary" onClick={startHardwareCapture} className="w-full max-w-xs">
                OPEN HARDWARE
              </ProcessingButton>
            </motion.div>
          )}

          {phase === "capture" && (
            <motion.div key="capture" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center w-full">
              {captureMode === "audio" ? (
                <>
                  <StatusBadge label="LIVE MIC ACTIVE" variant="active" className="mb-8" />
                  <div className="flex items-center justify-center gap-[3px] h-32 mb-8 w-full max-w-xs">
                    {audioLevels.map((level, i) => {
                      const hue = 175 + (i / audioLevels.length) * 105;
                      return <motion.div key={i} className="w-2 rounded-full" style={{ backgroundColor: `hsl(${hue}, 75%, 55%)` }} animate={{ height: `${level * 100}%` }} transition={{ duration: 0.1 }} />;
                    })}
                  </div>
                  <ProcessingButton variant="ghost" className="w-full max-w-xs gap-2 border border-border" onClick={stopAudioRecording}>
                    <Square className="w-4 h-4 fill-current" /> STOP RECORDING
                  </ProcessingButton>
                </>
              ) : (
                <>
                  <StatusBadge label="CAMERA SENSOR ACTIVE" variant="active" className="mb-6" />
                  <PremiumCard variant="outlined" className="w-full max-w-xs mb-6 overflow-hidden p-1 relative bg-black/40" hoverable={false}>
                    {/* Live Video Feed */}
                    <div className="relative w-full aspect-video rounded-md overflow-hidden flex items-center justify-center bg-black/80">
                      {stream ? (
                        <video ref={videoRef} playsInline muted autoPlay className="w-full h-full object-cover scale-x-[-1]" />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground/30">
                          <Camera className="w-10 h-10 mb-2" />
                          <span className="text-[10px] font-mono uppercase">Requesting Lens...</span>
                        </div>
                      )}
                      
                      {/* Reticle UI overlay */}
                      {stream && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-primary/40 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                          </div>
                        </div>
                      )}
                    </div>
                  </PremiumCard>
                  
                  <ProcessingButton variant="primary" onClick={takePhoto} className="w-full max-w-xs gap-2">
                    <Camera className="w-4 h-4" /> CAPTURE FRAME
                  </ProcessingButton>
                </>
              )}
            </motion.div>
          )}

          {phase === "preview" && (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center w-full">
              <h2 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">REVIEW_DATA</h2>
              <p className="text-sm text-muted-foreground font-sans mb-6">Confirm payload before training</p>
              
              <PremiumCard variant="outlined" className="w-full max-w-xs mb-6 overflow-hidden p-1" hoverable={false}>
                {captureMode === "image" && mediaUrl ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden border border-primary/20">
                     <img src={mediaUrl} alt="Captured preview" className="w-full h-full object-cover scale-x-[-1]" />
                     <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full border border-primary/20 text-[9px] font-mono text-primary">RAW FRAME</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                     <Play className="w-8 h-8 text-primary/80 mb-3 ml-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform" fill="currentColor" />
                     <div className="w-full h-1 bg-primary/20 rounded-full overflow-hidden mt-4 mx-8 relative">
                       <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-primary" />
                     </div>
                     <span className="text-[10px] font-mono mt-3 text-muted-foreground">AUDIO_001.WAV / 00:04</span>
                  </div>
                )}
              </PremiumCard>

              <div className="flex w-full max-w-xs gap-3">
                <button onClick={handleRetake} className="flex-1 h-12 rounded-xl font-mono text-xs font-bold text-muted-foreground border border-border bg-card/50 hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" /> RETAKE
                </button>
                <button onClick={handleTrain} className="flex-[2] h-12 rounded-xl font-mono text-xs font-bold text-background bg-primary shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Zap className="w-3.5 h-3.5 fill-current" /> TRAIN MODEL
                </button>
              </div>
            </motion.div>
          )}

          {phase === "burst" && (
            <motion.div key="burst" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
              <h2 className="text-lg font-mono font-bold tracking-tighter gradient-text-aurora mb-8">BURST TRAINING</h2>
              <div className="w-full max-w-xs space-y-5 mb-8">
                {burstStages.map((stage, i) => {
                  const isActive = currentBurstStage === stage.key;
                  const isDone = burstStages.findIndex(s => s.key === currentBurstStage) > i;
                  return (
                    <div key={stage.key} className="flex items-center gap-4">
                      <motion.div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ border: `2px solid ${isDone ? stage.color : isActive ? stage.color : "hsl(var(--border))"}`, backgroundColor: isDone ? `${stage.color}30` : "transparent" }} animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
                        {isDone ? <CheckCircle className="w-4 h-4" style={{ color: stage.color }} /> : <span className="text-[10px] font-mono" style={{ color: isActive ? stage.color : "hsl(var(--muted-foreground))" }}>{i + 1}</span>}
                      </motion.div>
                      <div className="flex-1">
                        <p className={`text-xs font-mono tracking-wider ${isActive || isDone ? "text-foreground" : "text-muted-foreground/40"}`}>{stage.label}</p>
                        {isActive && (
                          <div className="mt-2 h-1 rounded-full bg-muted/30 overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ backgroundColor: stage.color }} animate={{ width: ["0%", "100%"] }} transition={{ duration: 1.8, ease: "easeInOut" }} />
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
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))" }} animate={{ width: `${Math.min(100, burstProgress)}%` }} transition={{ duration: 0.05 }} />
                </div>
              </div>
            </motion.div>
          )}

          {phase === "broadcasting" && (
            <motion.div key="broadcasting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center w-full">
              <h2 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">BROADCASTING</h2>
              <p className="text-sm text-muted-foreground font-mono mb-8">Committing Proof to Network...</p>
              
              <div className="relative w-40 h-40 mb-8">
                <motion.div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary animate-pulse" fill="currentColor" />
                </div>
              </div>

              <div className="bg-card/40 border border-border p-4 rounded-xl w-full max-w-xs text-left">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] font-mono text-muted-foreground uppercase">Mempool Status</span>
                   <span className="text-[10px] font-mono text-primary animate-pulse uppercase">Searching Validators</span>
                </div>
                <p className="text-[9px] font-mono text-white/50 break-all leading-relaxed">
                   TX_ID: {txHash || "0x..."}
                </p>
              </div>
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} className="flex flex-col items-center">
              <EvoTwin size={120} level={8} mood="happy" className="mb-6" />
              <StatusBadge label="CONFIRMED ON-CHAIN" variant="success" className="mb-4" />
              <h2 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora mb-2">ZK-SYNC SUCCESS</h2>
              <p className="text-sm font-mono text-success mono-nums mb-6">+0.0003 ETH CLAIMED</p>
              <ProcessingButton variant="primary" onClick={handleFinish} className="w-full max-w-xs uppercase">
                Return to Swarm
              </ProcessingButton>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hidden canvas for image capture processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default MicroQuest;
