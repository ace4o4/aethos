import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface EvoTwinProps {
  level?: number;
  size?: number;
  className?: string;
}

const TwinCore = ({ level }: { level: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Level drives complexity
  const normalizedLevel = Math.min(level, 99) / 99;
  const distort = 0.2 + normalizedLevel * 0.5;
  const speed = 1.5 + normalizedLevel * 3;
  const complexity = Math.floor(3 + normalizedLevel * 12);
  const particleCount = Math.floor(30 + normalizedLevel * 170);
  const coreScale = 0.8 + normalizedLevel * 0.4;

  // Color shifts with level
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
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      meshRef.current.rotation.y = t * 0.15;
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

  // Geometry morphs: low level = icosahedron, mid = dodecahedron, high = sphere-like
  const geometryDetail = normalizedLevel < 0.5 ? 1 : 2;

  return (
    <>
      {/* Ambient + point lights */}
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#00E6DC" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#A050FF" />
      <pointLight position={[0, -3, -2]} intensity={0.3} color="#FFB432" />

      {/* Core morphing shape */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
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

      {/* Orbital ring 1 */}
      {normalizedLevel > 0.1 && (
        <mesh ref={ringRef}>
          <torusGeometry args={[1.3 + normalizedLevel * 0.3, 0.015, 16, complexity * 3]} />
          <meshStandardMaterial
            color="#00E6DC"
            emissive="#00E6DC"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5 + normalizedLevel * 0.3}
          />
        </mesh>
      )}

      {/* Orbital ring 2 - appears at higher levels */}
      {normalizedLevel > 0.35 && (
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.6 + normalizedLevel * 0.2, 0.012, 16, complexity * 2]} />
          <meshStandardMaterial
            color="#A050FF"
            emissive="#A050FF"
            emissiveIntensity={0.6}
            transparent
            opacity={0.3 + normalizedLevel * 0.4}
          />
        </mesh>
      )}

      {/* Particles surrounding the twin */}
      <Sparkles
        count={particleCount}
        scale={3.5}
        size={1.5 + normalizedLevel * 2}
        speed={0.4 + normalizedLevel * 0.8}
        color={coreColor}
        opacity={0.6}
      />

      {/* Secondary particle layer for high levels */}
      {normalizedLevel > 0.5 && (
        <Sparkles
          count={Math.floor(particleCount * 0.4)}
          scale={4}
          size={0.8}
          speed={1.2}
          color="#FFB432"
          opacity={0.4}
        />
      )}
    </>
  );
};

const EvoTwin = ({ level = 7, size = 200, className = "" }: EvoTwinProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Glow backdrop */}
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
    </div>
  );
};

export default EvoTwin;
