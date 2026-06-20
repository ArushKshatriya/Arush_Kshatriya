import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Knot() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock, pointer, camera }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.12 + pointer.y * 0.6;
    ref.current.rotation.y = t * 0.2 + pointer.x * 0.9;
    // subtle parallax: camera drifts opposite the cursor
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} scale={1.6}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshDistortMaterial
          color="#d4ff3a"
          emissive="#d4ff3a"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.85}
          distort={0.35}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 600 }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);
  useFrame(({ clock, pointer }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.04 + pointer.x * 0.3;
    ref.current.rotation.x = pointer.y * 0.2;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#d4ff3a" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, -2, -2]} intensity={2} color="#c084fc" />
        <Knot />
        <Particles />
        <Stars radius={50} depth={30} count={2000} factor={3} fade speed={0.5} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

function Orb() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    ref.current.rotation.x = clock.getElapsedTime() * 0.15;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 2]} />
      <meshStandardMaterial
        color="#1a1a22"
        wireframe
        emissive="#d4ff3a"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

export function SceneOrb() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[2, 2, 2]} intensity={2} color="#d4ff3a" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Orb />
        </Float>
      </Suspense>
    </Canvas>
  );
}

/* ---------- DNA-style helix for the Timeline section ---------- */

function Helix() {
  const group = useRef<THREE.Group>(null!);
  const { positions, indices } = useMemo(() => {
    const turns = 6;
    const perTurn = 36;
    const total = turns * perTurn;
    const r = 0.9;
    const height = 8;
    const pos = new Float32Array(total * 2 * 3);
    for (let i = 0; i < total; i++) {
      const t = i / total;
      const a = t * turns * Math.PI * 2;
      const y = (t - 0.5) * height;
      pos[i * 6 + 0] = Math.cos(a) * r;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = Math.sin(a) * r;
      pos[i * 6 + 3] = Math.cos(a + Math.PI) * r;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = Math.sin(a + Math.PI) * r;
    }
    // rung indices every 3rd step
    const idx: number[] = [];
    for (let i = 0; i < total; i += 3) {
      idx.push(i * 2, i * 2 + 1);
    }
    // strand indices
    for (let i = 0; i < total - 1; i++) {
      idx.push(i * 2, (i + 1) * 2);
      idx.push(i * 2 + 1, (i + 1) * 2 + 1);
    }
    return { positions: pos, indices: new Uint16Array(idx) };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.25 + pointer.x * 0.5;
      group.current.rotation.x = pointer.y * 0.2;
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="index" args={[indices, 1]} />
        </bufferGeometry>
        <lineBasicMaterial color="#d4ff3a" transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

export function SceneHelix() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 3]} intensity={1.8} color="#c084fc" />
        <Helix />
      </Suspense>
    </Canvas>
  );
}

/* ---------- Signal grid wave for the Contact section ---------- */

function SignalGrid() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const { positions, base } = useMemo(() => {
    const size = 40;
    const spacing = 0.22;
    const arr = new Float32Array(size * size * 3);
    const b = new Float32Array(size * size * 3);
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const px = (x - size / 2) * spacing;
        const pz = (z - size / 2) * spacing;
        arr[i] = px; arr[i + 1] = 0; arr[i + 2] = pz;
        b[i] = px; b[i + 1] = 0; b[i + 2] = pz;
        i += 3;
      }
    }
    return { positions: arr, base: b };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const px = pointer.x * 4;
    const pz = -pointer.y * 4;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i];
      const z = base[i + 2];
      const d = Math.hypot(x - px, z - pz);
      pos[i + 1] =
        Math.sin(d * 1.4 - t * 2.2) * 0.35 +
        Math.sin((x + z) * 0.6 + t * 0.8) * 0.12;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    if (ref.current) {
      ref.current.rotation.y = t * 0.05;
    }
  });

  return (
    <points ref={ref} rotation={[-Math.PI / 3, 0, 0]} position={[0, -0.5, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.045}
        color="#d4ff3a"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export function SceneSignal() {
  return (
    <Canvas camera={{ position: [0, 1.4, 4.5], fov: 55 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 3, 2]} intensity={1.5} color="#d4ff3a" />
        <pointLight position={[-2, 1, -2]} intensity={1} color="#c084fc" />
        <SignalGrid />
      </Suspense>
    </Canvas>
  );
}