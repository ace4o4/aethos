import { motion } from "framer-motion";

const NeuralOrb = ({ size = 300, className = "" }: { size?: number; className?: string }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,242,254,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary glow ring */}
      <motion.div
        className="absolute inset-[15%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(127,58,237,0.2) 0%, transparent 70%)",
        }}
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Core orb */}
      <motion.div
        className="absolute inset-[25%] rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 35%, rgba(0,242,254,0.5) 0%, rgba(127,58,237,0.3) 50%, rgba(0,242,254,0.1) 100%)",
          boxShadow: "0 0 40px rgba(0,242,254,0.2), inset 0 0 30px rgba(0,242,254,0.1)",
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner bright core */}
      <motion.div
        className="absolute inset-[40%] rounded-full"
        style={{
          background: "radial-gradient(circle at 45% 40%, rgba(0,242,254,0.8) 0%, rgba(79,172,254,0.3) 60%, transparent 100%)",
          filter: "blur(2px)",
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${30 + Math.random() * 40}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 40, 0],
            y: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default NeuralOrb;
