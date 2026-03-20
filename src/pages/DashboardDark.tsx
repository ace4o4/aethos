import { motion } from "framer-motion";
import { Wifi, Lock, Sparkles, ChevronRight, ActivitySquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoodleThemeToggle from "@/components/DoodleThemeToggle";

const DashboardDark = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-full min-h-[100dvh] bg-[#030712] font-sans selection:bg-[#00F2FE]/30 overflow-hidden flex items-center justify-center">
      
      {/* 
        =======================================================================
        DYNAMIC AMBIENT AURAS (BEHIND EVERYTHING)
        =======================================================================
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
        {/* Abstract Noise Grain */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>
        
        {/* Massive Ambient Spawns (Neon Dark Mode) */}
        <motion.div 
          className="absolute w-80 h-80 rounded-full opacity-40"
          style={{ background: "#00F2FE", filter: "blur(120px)", top: "-10%", right: "-10%" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div 
          className="absolute w-96 h-96 rounded-full opacity-40"
          style={{ background: "#8B5CF6", filter: "blur(120px)", bottom: "5%", left: "-20%" }}
          animate={{ x: [0, 50, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute w-72 h-72 rounded-full opacity-30"
          style={{ background: "#FDE047", filter: "blur(100px)", top: "40%", right: "-10%" }}
          animate={{ x: [0, -20, 0], y: [0, -30, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="absolute top-6 right-6 z-50">
        <DoodleThemeToggle />
      </div>

      {/* 
        =======================================================================
        THE ORGANIC TECH-SCULPTURE (Dark Theme)
        =======================================================================
      */}
      <main className="relative w-full h-full max-w-[412px] mx-auto px-4 flex flex-col items-center justify-center">

        {/* 
          TOP LEFT SATELLITE: Swarm Sync
        */}
        <motion.div 
          className="absolute top-[12%] left-0 w-[75%] bg-white/5 backdrop-blur-[40px] border border-white/10 p-5 rounded-[20px_100px_100px_20px] shadow-[0_20px_40px_-10px_rgba(0,242,254,0.3)] z-20 flex items-center justify-between"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse shadow-[0_0_10px_#00F2FE]" />
              <span className="text-[10px] font-bold tracking-widest text-[#00F2FE] uppercase">Swarm Mesh</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter leading-none -ml-0.5">2,847</h2>
            <p className="text-[10px] font-medium text-zinc-400 mt-1 ml-1">Active Nodes</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#00F2FE]/10 flex items-center justify-center border border-[#00F2FE]/30 shrink-0 shadow-[inset_0_0_20px_rgba(0,242,254,0.2)]">
            <Wifi className="w-5 h-5 text-[#00F2FE]" />
          </div>
        </motion.div>

        {/* 
          THE CORE CENTERPIECE: Evo Twin
        */}
        <motion.div 
          className="relative top-[2%] z-30 w-64 h-64 sm:w-72 sm:h-72 bg-[#09090B]/40 backdrop-blur-[60px] border border-white/10 rounded-full flex flex-col items-center justify-center p-8 shadow-[0_30px_60px_-15px_rgba(139,92,246,0.4)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Inner pulsating core */}
          <motion.div 
            className="absolute inset-2 rounded-full border border-white/5"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Neon inner glow */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(139,92,246,0.1)] pointer-events-none" />

          <div className="text-center mt-2 relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tighter">Evo-1X</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#8B5CF6] font-bold mt-1 shadow-black">Lvl 07 Sentinel</p>
          </div>

          {/* Abstract Synthesis Dial */}
          <div className="absolute bottom-10 inset-x-0 px-12 flex flex-col items-center z-10">
             <span className="text-5xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-lg">84<span className="text-xl text-white/70">%</span></span>
             <span className="text-[9px] uppercase tracking-widest text-zinc-300 mt-2 font-bold bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">Neural Synthesis</span>
          </div>
        </motion.div>

        {/* 
          BOTTOM RIGHT SATELLITE: Privacy Metrics
        */}
        <motion.div 
          className="absolute bottom-[28%] right-0 w-[65%] bg-white/5 backdrop-blur-[40px] border border-white/10 p-5 rounded-[100px_20px_20px_100px] shadow-[0_20px_40px_-10px_rgba(253,224,71,0.2)] z-40 flex flex-col items-end text-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="w-10 h-10 rounded-full bg-[#FDE047]/10 flex items-center justify-center border border-[#FDE047]/30 mb-3 absolute top-4 left-4 shadow-[inset_0_0_15px_rgba(253,224,71,0.2)]">
            <Lock className="w-4 h-4 text-[#FDE047]" />
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">ZK Secured</h3>
          <p className="text-[10px] text-zinc-400 font-medium leading-tight max-w-[120px] mt-1 mb-3">
            Local params encrypted. Only geometric proofs leave this device.
          </p>
          <div className="bg-black/40 px-3 py-1.5 rounded-full border border-white/10 flex gap-2 items-center">
             <span className="text-sm font-bold text-white font-mono">1,482</span>
             <span className="text-[9px] uppercase tracking-wider text-[#A1A1AA] font-bold">Proofs</span>
          </div>
        </motion.div>

        {/* 
          BOTTOM LEFT SATELLITE: Intersecting Performance
        */}
        <motion.div 
          className="absolute bottom-[10%] left-6 z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Intersection Base Rectangle */}
          <div className="relative bg-white/5 backdrop-blur-[40px] border border-white/10 p-5 pr-12 rounded-[24px] shadow-[0_15px_30px_-5px_rgba(236,72,153,0.3)] flex flex-col items-start pt-8 pb-5 mt-6 ml-4">
             <span className="text-[10px] uppercase tracking-wider text-[#EC4899] font-bold mb-1">Compute Cost</span>
             <span className="text-2xl font-black text-white font-mono leading-none">12.4%</span>
          </div>
          {/* Overlapping/Intersecting Circle */}
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-[#09090B]/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] -translate-x-2 -translate-y-2 z-10">
             <ActivitySquare className="w-6 h-6 text-[#EC4899]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* 
          BOTTOM CENTER ACTION BALL
        */}
        <motion.button
            onClick={() => navigate("/quest")}
            className="absolute bottom-[5%] right-6 bg-white text-black px-8 py-5 flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] z-50 transition-transform active:scale-95 group overflow-hidden"
            style={{ clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <span className="font-bold tracking-widest text-black uppercase text-[11px] relative z-10">Init Quest</span>
           <ChevronRight className="w-4 h-4 text-black relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.button>

      </main>
    </div>
  );
};

export default DashboardDark;
