import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, BarChart2 } from "lucide-react";
import EvoTwin from "@/components/EvoTwin";
import DoodleThemeToggle from "@/components/DoodleThemeToggle";
import { playClick, playWhoosh } from "@/lib/sounds";
import { getTodayFocusMinutes, getRecentSessions } from "@/lib/sessionManager";
import { computePatterns } from "@/lib/patternEngine";
import { loadTwinState, levelProgress, xpForLevel } from "@/lib/twinEngine";
import { getTodayChallenge, type DailyChallenge } from "@/lib/challengeGen";
import { getGreeting } from "@/lib/twinAgent";

const FocusDashboard = () => {
  const navigate = useNavigate();

  const [todayMins, setTodayMins] = useState(0);
  const [greeting, setGreeting] = useState("Loading…");
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  const twinState = loadTwinState();

  useEffect(() => {
    (async () => {
      const [mins, sessions] = await Promise.all([
        getTodayFocusMinutes(),
        getRecentSessions(30),
      ]);
      const patterns = computePatterns(sessions);
      setTodayMins(mins);
      const ch = getTodayChallenge(patterns, twinState);
      setChallenge(ch);
      setLoading(false);
      const msg = await getGreeting({ patterns, twin: twinState, todayMins: mins });
      setGreeting(msg);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartFocus = useCallback(() => {
    playClick();
    playWhoosh();
    navigate("/focus");
  }, [navigate]);

  const handleInsights = useCallback(() => {
    playClick();
    navigate("/insights");
  }, [navigate]);

  const progress = levelProgress(twinState);
  const xpNeeded = xpForLevel(twinState.level);
  const xpCurrent = Math.round(progress * xpNeeded);

  return (
    <div className="relative min-h-[100dvh] bg-background overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 15%, hsl(var(--primary) / 0.07) 0%, transparent 70%)",
      }} />

      <div className="fixed top-5 right-5 z-50"><DoodleThemeToggle /></div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 pb-28">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Focus Twin</p>
            <h1 className="text-xl font-mono font-bold tracking-tighter gradient-text-aurora">Home</h1>
          </div>
          <button
            onClick={handleInsights}
            className="w-9 h-9 rounded-full bg-card/60 border border-border flex items-center justify-center hover:bg-muted/40 transition-colors"
            aria-label="View insights"
          >
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Twin + greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-6"
        >
          <EvoTwin
            size={180}
            level={twinState.level}
            mood={twinState.streakDays >= 3 ? "excited" : "curious"}
            interactive
            label={twinState.name}
            sublabel={`LVL ${twinState.level}`}
          />

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: loading ? 0 : 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 px-4 py-3 rounded-2xl bg-card/60 border border-border max-w-xs text-center"
          >
            <p className="text-sm font-sans text-foreground/90 leading-relaxed">{greeting}</p>
          </motion.div>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card/60 border border-border p-4 mb-4"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">Twin Evolution</p>
            <p className="text-[10px] font-mono text-muted-foreground">{xpCurrent} / {xpNeeded} XP</p>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Daily challenge */}
        {challenge && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card/60 border border-border p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[10px] font-mono text-amber-400 tracking-wider uppercase">Daily Challenge</p>
              {challenge.completed && (
                <span className="ml-auto text-[9px] font-mono text-green-400 tracking-wider">✓ DONE</span>
              )}
            </div>
            <p className="text-sm font-sans font-semibold text-foreground mb-1">{challenge.title}</p>
            <p className="text-xs font-sans text-muted-foreground leading-relaxed">{challenge.description}</p>
          </motion.div>
        )}

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <MiniStat label="TODAY" value={`${todayMins}m`} />
          <MiniStat label="STREAK" value={`${twinState.streakDays}d`} />
          <MiniStat label="SESSIONS" value={`${twinState.totalSessions}`} />
        </motion.div>

        {/* Start Focus CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleStartFocus}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-16 rounded-2xl font-mono text-base font-bold text-background tracking-wider shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          >
            START FOCUS
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-card/60 border border-border p-3 text-center">
    <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">{label}</p>
    <p className="text-lg font-mono font-bold gradient-text-aurora">{value}</p>
  </div>
);

export default FocusDashboard;
