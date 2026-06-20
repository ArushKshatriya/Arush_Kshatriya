import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ---------- geometry builders ---------- */

function buildCarPositions(): Float32Array {
  const geos: THREE.BufferGeometry[] = [];

  // body
  const body = new THREE.BoxGeometry(3.4, 0.7, 1.4, 6, 2, 3);
  body.translate(0, 0, 0);
  geos.push(new THREE.EdgesGeometry(body));

  // cabin
  const cabin = new THREE.BoxGeometry(1.6, 0.7, 1.2, 3, 2, 2);
  cabin.translate(-0.1, 0.7, 0);
  geos.push(new THREE.EdgesGeometry(cabin));

  // hood line
  const hood = new THREE.BoxGeometry(1.4, 0.05, 1.2, 2, 1, 2);
  hood.translate(1.0, 0.4, 0);
  geos.push(new THREE.EdgesGeometry(hood));

  // trunk line
  const trunk = new THREE.BoxGeometry(0.9, 0.05, 1.2, 2, 1, 2);
  trunk.translate(-1.3, 0.4, 0);
  geos.push(new THREE.EdgesGeometry(trunk));

  // 4 wheels
  const wheelPositions: [number, number, number][] = [
    [-1.1, -0.45, 0.72],
    [1.1, -0.45, 0.72],
    [-1.1, -0.45, -0.72],
    [1.1, -0.45, -0.72],
  ];
  for (const [x, y, z] of wheelPositions) {
    const w = new THREE.TorusGeometry(0.42, 0.05, 6, 24);
    w.translate(x, y, z);
    geos.push(new THREE.EdgesGeometry(w));

    const rim = new THREE.CircleGeometry(0.35, 10);
    rim.translate(x, y, z);
    geos.push(new THREE.EdgesGeometry(rim));
  }

  // headlights / underglow
  const beam = new THREE.BoxGeometry(0.1, 0.2, 1.0, 1, 1, 1);
  beam.translate(1.75, 0.1, 0);
  geos.push(new THREE.EdgesGeometry(beam));

  // merge positions
  let total = 0;
  for (const g of geos) total += (g.attributes.position.array as Float32Array).length;
  const out = new Float32Array(total);
  let offset = 0;
  for (const g of geos) {
    const arr = g.attributes.position.array as Float32Array;
    out.set(arr, offset);
    offset += arr.length;
    g.dispose();
  }
  return out;
}

function buildWirePositions(length: number): Float32Array {
  const arr = new Float32Array(length);
  const segCount = length / 6;
  let x = 0, y = 0, z = 0;
  let cableLen = 0;
  for (let s = 0; s < segCount; s++) {
    if (cableLen <= 0) {
      x = (Math.random() - 0.5) * 4.5;
      y = (Math.random() - 0.5) * 2.0;
      z = (Math.random() - 0.5) * 1.8;
      cableLen = 8 + Math.floor(Math.random() * 24);
    }
    const nx = x + (Math.random() - 0.5) * 0.55;
    const ny = y + (Math.random() - 0.5) * 0.55;
    const nz = z + (Math.random() - 0.5) * 0.55;
    const i = s * 6;
    arr[i] = x;
    arr[i + 1] = y;
    arr[i + 2] = z;
    arr[i + 3] = nx;
    arr[i + 4] = ny;
    arr[i + 5] = nz;
    x = nx;
    y = ny;
    z = nz;
    cableLen--;
  }
  return arr;
}

/* ---------- the morphing mesh ---------- */

function Morph({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const lineRef = useRef<THREE.LineSegments>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);

  const { car, wires, current } = useMemo(() => {
    const car = buildCarPositions();
    const wires = buildWirePositions(car.length);
    // CHANGED: Initialized with 'wires' positions instead of 'car' positions
    const current = new Float32Array(wires); 
    return { car, wires, current };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(current, 3));
    return g;
  }, [current]);

  const smoothP = useRef(0);

  useFrame(({ clock, pointer }, delta) => {
    smoothP.current += (progressRef.current - smoothP.current) * Math.min(1, delta * 5);
    const p = smoothP.current;
    const ease = p * p * (3 - 2 * p); // smoothstep

    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i++) {
      // CHANGED: Inverted the math flow. Now starts at wires (1 - ease) and moves to car (ease)
      pos[i] = wires[i] * (1 - ease) + car[i] * ease;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeBoundingSphere();

    const t = clock.getElapsedTime();
    if (lineRef.current) {
      lineRef.current.rotation.y = t * 0.15 + pointer.x * 0.6;
      lineRef.current.rotation.x = pointer.y * 0.3 + Math.sin(t * 0.4) * 0.05;
    }

    if (matRef.current) {
      // CHANGED: Swapped color interpolation values so it starts magenta (#c084fc) and becomes lime (#d4ff3a)
      const c = new THREE.Color().lerpColors(
        new THREE.Color("#c084fc"),
        new THREE.Color("#d4ff3a"),
        ease,
      );
      matRef.current.color.copy(c);
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geo}>
      <lineBasicMaterial ref={matRef} color="#c084fc" transparent opacity={0.95} linewidth={1} />
    </lineSegments>
  );
}

/* ---------- sticky section wrapper ---------- */

export function CarMorphSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      progressRef.current = p;
      setStage(p < 0.33 ? 0 : p < 0.75 ? 1 : 2);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // CHANGED: Swapped HUD step text definitions to logically read from Raw Wires -> Compiled Blueprint
  const labels = [
    {
      tag: "Phase 01",
      title: "Pure Wires",
      body: "Underneath every product is a tangle of state, data, and intent.",
    },
    {
      tag: "Phase 02",
      title: "Assembly",
      body: "Signals begin to align. Scattered nodes find their architecture and map to physical boundaries.",
    },
    {
      tag: "Phase 03",
      title: "Blueprint",
      body: "A clean wireframe forms. Structured, intentional, every edge seamlessly accounted for.",
    },
  ];

  return (
    <section ref={sectionRef} id="build" className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0.5, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <pointLight position={[3, 3, 3]} intensity={1.5} color="#d4ff3a" />
              <pointLight position={[-3, -2, -2]} intensity={1} color="#c084fc" />
              <Morph progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* HUD */}
        <div className="relative z-10 h-full w-full px-6 flex flex-col justify-between pointer-events-none">
          <div className="mx-auto max-w-7xl w-full pt-28 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">01·5</span>
            <span className="h-px flex-1 bg-border" />
            <span>The Build</span>
          </div>

          <div className="mx-auto max-w-7xl w-full grid md:grid-cols-3 gap-6 pb-16">
            {labels.map((l, i) => (
              <div
                key={l.tag}
                className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-500 ${
                  stage === i
                    ? "border-primary/60 bg-card/70 shadow-glow scale-[1.02]"
                    : "border-border/40 bg-card/30 opacity-50"
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                  {l.tag}
                </div>
                <div className="font-display text-xl tracking-tight mb-1">{l.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{l.body}</p>
              </div>
            ))}
          </div>

          {/* scroll progress bar */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 h-48 w-px bg-border">
            <div
              className="absolute top-0 left-0 w-px bg-primary shadow-glow transition-[height] duration-150"
              style={{ height: `${Math.round((stage + 1) * 33.33)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
