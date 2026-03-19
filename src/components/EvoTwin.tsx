import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import * as THREE from "three";

interface EvoTwinProps {
  level?: number;
  size?: number;
  className?: string;
  mood?: "happy" | "curious" | "sleepy" | "excited" | "idle";
}

/* ─── Cute Eyes Overlay ─── */
const EvoEyes = ({ size, mood = "idle" }: { size: number; mood: string }) => {
  const [blinkState, setBlinkState] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [expression, setExpression] = useState(mood);
  const containerRef = useRef<HTMLDivElement>(null);

  // Blink cycle
  useEffect(() => {
    const blink = () => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    };
    const interval = setInterval(() => {
      blink();
      // Occasionally double-blink
      if (Math.random() > 0.7) {
        setTimeout(blink, 300);
      }
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Pupil follows mouse
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width * 2);
    const dy = (e.clientY - cy) / (rect.height * 2);
    const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
    setPupilOffset({ x: clamp(dx, 0.35), y: clamp(dy, 0.35) });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Cycle through expressions
  useEffect(() => {
    if (mood !== "idle") {
      setExpression(mood);
      return;
    }
    const moods: Array<typeof mood> = ["happy", "curious", "idle", "excited"];
    const interval = setInterval(() => {
      setExpression(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [mood]);

  const scale = size / 200; // normalize to base 200px
  const eyeSize = 14 * scale;
  const pupilSize = 7 * scale;
  const eyeGap = 18 * scale;
  const eyeY = -2 * scale;

  // Expression shapes
  const getEyeStyle = (isLeft: boolean) => {
    const base: React.CSSProperties = {
      width: eyeSize,
      height: blinkState ? 2 * scale : eyeSize,
      borderRadius: blinkState ? `${eyeSize}px` : "50%",
      background: "radial-gradient(circle at 40% 35%, #ffffff, #e0e8ff)",
      transition: "all 0.12s ease",
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 0 ${8 * scale}px rgba(0, 230, 220, 0.4), inset 0 ${1 * scale}px ${3 * scale}px rgba(255,255,255,0.3)`,
    };

    if (expression === "happy") {
      base.height = blinkState ? 2 * scale : eyeSize * 0.65;
      base.borderRadius = blinkState ? `${eyeSize}px` : `${eyeSize}px ${eyeSize}px 50% 50%`;
    } else if (expression === "curious") {
      if (isLeft) {
        base.height = blinkState ? 2 * scale : eyeSize * 1.15;
      }
    } else if (expression === "sleepy") {
      base.height = blinkState ? 2 * scale : eyeSize * 0.45;
      base.borderRadius = `${eyeSize}px`;
    } else if (expression === "excited") {
      base.width = eyeSize * 1.2;
      base.height = blinkState ? 2 * scale : eyeSize * 1.2;
      base.boxShadow = `0 0 ${12 * scale}px rgba(160, 80, 255, 0.6), inset 0 ${1 * scale}px ${3 * scale}px rgba(255,255,255,0.3)`;
    }

    return base;
  };

  const getPupilStyle = (): React.CSSProperties => {
    const pSize = expression === "excited" ? pupilSize * 1.3 : expression === "sleepy" ? pupilSize * 0.7 : pupilSize;
    return {
      width: pSize,
      height: pSize,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #1a1a2e, #000)",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(calc(-50% + ${pupilOffset.x * eyeSize * 0.6}px), calc(-50% + ${pupilOffset.y * eyeSize * 0.6}px))`,
      transition: "all 0.15s ease-out",
      boxShadow: `0 0 ${4 * scale}px rgba(0,0,0,0.5)`,
    };
  };

  const getHighlightStyle = (): React.CSSProperties => ({
    width: 3 * scale,
    height: 3 * scale,
    borderRadius: "50%",
    background: "#fff",
    position: "absolute",
    top: `calc(50% - ${3 * scale}px + ${pupilOffset.y * eyeSize * 0.3}px)`,
    left: `calc(50% + ${1 * scale}px + ${pupilOffset.x * eyeSize * 0.3}px)`,
    opacity: 0.9,
    filter: `blur(${0.5 * scale}px)`,
  });

  // Cute mouth
  const getMouth = () => {
    const mouthW = 8 * scale;
    const base: React.CSSProperties = {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      top: eyeY + eyeSize + 5 * scale,
      transition: "all 0.3s ease",
    };

    if (expression === "happy" || expression === "excited") {
      return (
        <div style={{
          ...base,
          width: mouthW,
          height: mouthW * 0.5,
          borderBottom: `${2 * scale}px solid rgba(255,255,255,0.6)`,
          borderRadius: `0 0 ${mouthW}px ${mouthW}px`,
        }} />
      );
    }
    if (expression === "curious") {
      return (
        <div style={{
          ...base,
          width: 4 * scale,
          height: 5 * scale,
          border: `${1.5 * scale}px solid rgba(255,255,255,0.5)`,
          borderRadius: "50%",
        }} />
      );
    }
    if (expression === "sleepy") {
      return (
        <div style={{
          ...base,
          width: mouthW * 0.6,
          height: 0,
          borderBottom: `${1.5 * scale}px solid rgba(255,255,255,0.4)`,
          borderRadius: `${mouthW}px`,
        }} />
      );
    }
    // idle - small smile
    return (
      <div style={{
        ...base,
        width: mouthW * 0.7,
        height: mouthW * 0.3,
        borderBottom: `${1.5 * scale}px solid rgba(255,255,255,0.45)`,
        borderRadius: `0 0 ${mouthW}px ${mouthW}px`,
      }} />
    );
  };

  // Blush cheeks for happy/excited
  const showBlush = expression === "happy" || expression === "excited";

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
      style={{ zIndex: 10 }}
    >
      <div style={{ position: "relative", marginTop: eyeY }}>
        {/* Left eye */}
        <div style={{ display: "inline-block", marginRight: eyeGap, ...getEyeStyle(true) }}>
          {!blinkState && (
            <>
              <div style={getPupilStyle()} />
              <div style={getHighlightStyle() as any} />
            </>
          )}
        </div>
        {/* Right eye */}
        <div style={{ display: "inline-block", ...getEyeStyle(false) }}>
          {!blinkState && (
            <>
              <div style={getPupilStyle()} />
              <div style={getHighlightStyle() as any} />
            </>
          )}
        </div>

        {/* Blush */}
        {showBlush && (
          <>
            <div style={{
              position: "absolute",
              width: 8 * scale,
              height: 5 * scale,
              borderRadius: "50%",
              background: "rgba(255, 120, 150, 0.3)",
              filter: `blur(${3 * scale}px)`,
              left: -4 * scale,
              top: eyeSize * 0.6,
              transition: "opacity 0.5s",
            }} />
            <div style={{
              position: "absolute",
              width: 8 * scale,
              height: 5 * scale,
              borderRadius: "50%",
              background: "rgba(255, 120, 150, 0.3)",
              filter: `blur(${3 * scale}px)`,
              right: -4 * scale,
              top: eyeSize * 0.6,
              transition: "opacity 0.5s",
            }} />
          </>
        )}

        {/* Mouth */}
        {getMouth()}
      </div>
    </div>
  );
};

/* ─── 3D Core (unchanged logic) ─── */
const TwinCore = ({ level }: { level: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const normalizedLevel = Math.min(level, 99) / 99;
  const distort = 0.2 + normalizedLevel * 0.5;
  const speed = 1.5 + normalizedLevel * 3;
  const complexity = Math.floor(3 + normalizedLevel * 12);
  const particleCount = Math.floor(30 + normalizedLevel * 170);
  const coreScale = 0.8 + normalizedLevel * 0.4;

  const cyanHue = useMemo(() => new THREE.Color("#00E6DC"), []);
  const violetHue = useMemo(() => new THREE.Color("#A050FF"), []);
  const amberHue = useMemo(() => new THREE.Color("#FFB432"), []);
  const coreColor = useMemo(() => {
    if (normalizedLevel < 0.33) return cyanHue.clone().lerp(violetHue, normalizedLevel * 3);
    if (normalizedLevel < 0.66) return violetHue.clone().lerp(amberHue, (normalizedLevel - 0.33) * 3);
    return amberHue.clone().lerp(new THREE.Color("#FF4060"), (normalizedLevel - 0.66) * 3);
  }, [normalizedLevel, cyanHue, violetHue, amberHue]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      meshRef.current.rotation.y = t * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.3;
      ring2Ref.current.rotation.y = Math.cos(t * 0.4) * 0.5;
    }
  });

  const geometryDetail = normalizedLevel < 0.5 ? 1 : 2;

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#00E6DC" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#A050FF" />
      <pointLight position={[0, -3, -2]} intensity={0.3} color="#FFB432" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={meshRef} scale={coreScale}>
          <icosahedronGeometry args={[1, geometryDetail]} />
          <MeshDistortMaterial
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={0.4 + normalizedLevel * 0.6}
            roughness={0.15}
            metalness={0.85}
            distort={distort}
            speed={speed}
            transparent
            opacity={0.92}
          />
        </mesh>
      </Float>

      {normalizedLevel > 0.1 && (
        <mesh ref={ringRef}>
          <torusGeometry args={[1.3 + normalizedLevel * 0.3, 0.015, 16, complexity * 3]} />
          <meshStandardMaterial color="#00E6DC" emissive="#00E6DC" emissiveIntensity={0.8} transparent opacity={0.5 + normalizedLevel * 0.3} />
        </mesh>
      )}

      {normalizedLevel > 0.35 && (
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.6 + normalizedLevel * 0.2, 0.012, 16, complexity * 2]} />
          <meshStandardMaterial color="#A050FF" emissive="#A050FF" emissiveIntensity={0.6} transparent opacity={0.3 + normalizedLevel * 0.4} />
        </mesh>
      )}

      <Sparkles count={particleCount} scale={3.5} size={1.5 + normalizedLevel * 2} speed={0.4 + normalizedLevel * 0.8} color={coreColor} opacity={0.6} />

      {normalizedLevel > 0.5 && (
        <Sparkles count={Math.floor(particleCount * 0.4)} scale={4} size={0.8} speed={1.2} color="#FFB432" opacity={0.4} />
      )}
    </>
  );
};

const EvoTwin = ({ level = 7, size = 200, className = "", mood = "idle" }: EvoTwinProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30"
        style={{
          background: `radial-gradient(circle, hsl(var(--primary) / 0.4), hsl(var(--secondary) / 0.2), transparent)`,
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <TwinCore level={level} />
      </Canvas>
      <EvoEyes size={size} mood={mood} />
    </div>
  );
};

export default EvoTwin;
