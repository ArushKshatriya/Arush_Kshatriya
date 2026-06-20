import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Scene3D, SceneOrb, SceneHelix, SceneSignal } from "@/components/Scene3D";
import { CarMorphSection } from "@/components/CarMorph";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arush Kshatriya — Full-Stack Developer" },
      {
        name: "description",
        content:
          "Arush Kshatriya — Full-Stack Web & App developer building delightful, high-performance, real-time digital ecosystems.",
      },
      { property: "og:title", content: "Arush Kshatriya — Full-Stack Developer" },
      {
        property: "og:description",
        content:
          "Production-ready apps with robust architecture, obsessive performance, and an eye for detail.",
      },
    ],
  }),
  component: Index,
});

const SKILLS = [
  {
    title: "Core Development",
    blurb: "Seamless cross-platform applications and interactive web interfaces.",
    items: ["Next.js", "React Native", "TypeScript", "JavaScript"],
  },
  {
    title: "Frameworks & Tools",
    blurb: "Production-grade environments optimized for speed and scale.",
    items: ["Tailwind CSS", "Vite", "Node.js", "Git"],
  },
  {
    title: "Architecture & Systems",
    blurb: "Secure full-stack structures with state and live updates.",
    items: ["REST APIs", "Real-Time Dashboards", "State Management", "Database Design"],
  },
  {
    title: "UI/UX & Interface",
    blurb: "Visually balanced, accessible flows with strict spacing rhythm.",
    items: ["8pt Grid Systems", "Responsive Layouts", "Component Design", "Wireframing"],
  },
  {
    title: "Algorithms & Core Computing",
    blurb: "Algorithmic efficiency for state hierarchies and processing.",
    items: [
      "Linear & Non-Linear Structures",
      "Time & Space Complexity",
      "Optimization Patterns",
      "State Hierarchies",
    ],
  },
];

const TIMELINE = [
  {
    date: "March 2026",
    role: "Participant",
    title: "React Native & Automation Workshop",
    body: "Built a multi-channel AI automation system using n8n and Google Gemini to autonomously orchestrate customer support across platforms.",
  },
  {
    date: "April 2026",
    role: "Hackathon Participant",
    title: "Colohacks 2026",
    body: "Shipped a project end-to-end within the hackathon window, collaborating with a small team under tight time constraints.",
  },
];

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m ? <>{children}</> : null;
}

function Index() {
  const [scroll, setScroll] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    let raf = 0;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground noise">
      {/* Fixed 3D background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 bg-glow" />
        <div className="absolute inset-0 opacity-70">
          <ClientOnly>
            <Scene3D />
          </ClientOnly>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
      </div>

      <Nav />

      {/* Cursor glow */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-0 size-[500px] rounded-full hidden md:block"
        style={{
          background: "radial-gradient(circle, oklch(0.92 0.21 122 / 0.18) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      <main className="relative">
        <Hero scroll={scroll} />
        <Section index="01" label="Checkpoint" id="skills">
          <Skills />
        </Section>
        <CarMorphSection />
        <Section index="02" label="Checkpoint" id="projects">
          <Projects />
        </Section>
        <Section index="03" label="Checkpoint" id="timeline">
          <Timeline />
        </Section>
        <Section index="04" label="Finish Line" id="contact">
          <Contact />
        </Section>
        <Footer />
      </main>
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm">
          <span className="size-2 rounded-full bg-primary shadow-glow animate-pulse" />
          <span className="tracking-tight">
            arush<span className="text-primary">.</span>dev
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <a href="#skills" className="hover:text-foreground transition">
            01 Skills
          </a>
          <a href="#projects" className="hover:text-foreground transition">
            02 Work
          </a>
          <a href="#timeline" className="hover:text-foreground transition">
            03 Journey
          </a>
          <a href="#contact" className="hover:text-foreground transition">
            04 Contact
          </a>
        </nav>
        <a
          href="#contact"
          className="font-mono text-xs uppercase tracking-[0.18em] px-4 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition shadow-glow"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

function Hero({ scroll }: { scroll: number }) {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center px-6 pt-24">
      <div className="mx-auto max-w-7xl w-full">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-primary mb-8">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Available for new opportunities
          <span className="ml-auto text-muted-foreground">00 / About Me</span>
        </div>

        <h1 className="font-display font-medium text-[clamp(2.8rem,9vw,9rem)] leading-[0.95] tracking-[-0.04em] mb-8">
          Hi, I'm <span className="text-gradient italic">Arush</span>
          <br />
          <span className="text-muted-foreground/80">Kshatriya</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-end">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            A{" "}
            <span className="text-foreground font-medium">Full-Stack Web &amp; App developer</span>{" "}
            building delightful, high-performance systems. I turn complex product requirements into
            elegant, real-time digital ecosystems — from intelligent web apps like{" "}
            <em className="text-primary not-italic">NURA</em> to high-performance mobile systems.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition"
            >
              View Projects
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground flex flex-col items-center gap-2"
          style={{ opacity: Math.max(0, 1 - scroll / 300) }}
        >
          <span>Scroll to explore</span>
          <span className="block h-10 w-px bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Section({
  index,
  label,
  id,
  children,
}: {
  index: string;
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-12">
          <span className="text-primary">{index}</span>
          <span className="h-px flex-1 bg-border" />
          <span>{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <div>
      <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] mb-16">
        Technical <span className="text-gradient">Skills</span>
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border shadow-elevated">
        {SKILLS.map((s, i) => (
          <div
            key={s.title}
            className="group bg-card p-8 hover:bg-card/60 transition relative overflow-hidden"
          >
            <div className="font-mono text-xs text-primary mb-4">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-display text-2xl mb-2 tracking-tight">{s.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{s.blurb}</p>
            <div className="flex flex-wrap gap-2">
              {s.items.map((it) => (
                <span
                  key={it}
                  className="font-mono text-xs px-3 py-1 rounded-full border border-border bg-background/40 text-foreground/80 group-hover:border-primary/40 transition"
                >
                  {it}
                </span>
              ))}
            </div>
            <div className="absolute -bottom-20 -right-20 size-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div>
      <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] mb-16">
        Featured <span className="text-gradient">Projects</span>
      </h2>

      <article className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 rounded-3xl border border-border bg-card/60 backdrop-blur-md p-8 md:p-12 shadow-elevated overflow-hidden">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="font-mono text-xs tracking-[0.2em] text-primary mb-6">
            NEXT.JS · TYPESCRIPT · FULL-STACK
          </div>
          <h3 className="font-display text-4xl md:text-5xl tracking-[-0.03em] mb-6">
            Nura — Sustainable Diet Planner &amp; Ecosystem
          </h3>
          <ul className="space-y-4 text-muted-foreground">
            {[
              "Personalized meal plans optimized for nutrition and carbon footprint calculations.",
              "Smart, responsive dashboard tracking real-time daily sustainability scores.",
              "Dynamic data layer managing dietary targets and seasonal ingredient suggestions.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 mt-8">
            {/* Live Demo Redirect */}
            <a
              href="https://nura-app-final.vercel.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.02] transition shadow-glow"
            >
              Live Demo →
            </a>
            {/* GitHub Repository Redirect */}
            <a
              href="https://github.com/ArushKshatriya/nura-app_final.git" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border border-border text-sm hover:border-primary hover:text-primary transition"
            >
              Repository
            </a>
          </div>
        </div>

        <div className="relative h-[340px] lg:h-auto rounded-2xl border border-border bg-background/40 overflow-hidden">
          <ClientOnly>
            <SceneOrb />
          </ClientOnly>
          <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            ▲ Nura — Full-Stack Web App
          </div>
        </div>
      </article>
    </div>
  );
}

function Timeline() {
  return (
    <div>
      <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] mb-16">Timeline</h2>
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
        <div className="relative h-[460px] rounded-3xl border border-border bg-card/40 backdrop-blur overflow-hidden order-2 lg:order-1">
          <ClientOnly>
            <SceneHelix />
          </ClientOnly>
          <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            my timeline
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
            03 · journey.helix
          </div>
        </div>
        <ol className="relative border-l border-border ml-3 space-y-12 order-1 lg:order-2">
          {TIMELINE.map((t) => (
            <li key={t.title} className="pl-8 relative">
              <span className="absolute -left-[7px] top-2 size-3 rounded-full bg-primary shadow-glow" />
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-2">
                {t.date} · {t.role}
              </div>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-3">{t.title}</h3>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset(); // Clear all fields on success
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative rounded-3xl border border-border bg-card/40 backdrop-blur overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-80">
          <ClientOnly>
            <SceneSignal />
          </ClientOnly>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent pointer-events-none" />
        <div className="relative p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
            work together
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] mb-6 max-w-3xl">
            Let's build something <span className="text-gradient italic">great.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Open to roles, collaborations, and ambitious projects. Drop a message — I reply within
            48 hours.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-8 flex flex-col gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Resume
            </div>
            <p className="text-muted-foreground text-sm">One page, recruiter-friendly PDF.</p>
          </div>

          <a
            href="/Arush_Kshatriya_Resume.pdf"
            download="Arush_Kshatriya_Resume.pdf"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-glow transition hover:scale-[1.01]"
          >
            ↓ Download Resume
          </a>

          <div className="mt-auto pt-6 border-t border-border space-y-2 font-mono text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Location</span>
              <span className="text-foreground">Mumbai, India</span>
            </div>
            <div className="flex justify-between">
              <span>Response</span>
              <span className="text-foreground">&lt; 48h</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="text-primary">● Available</span>
            </div>
          </div>
        </div>

        {/* Operational Form Layer linked directly to Web3Forms */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card/60 backdrop-blur p-8 space-y-5"
        >
          {/* Web3Forms Access Key Input */}
          <input type="hidden" name="access_key" value="9896d6f7-6b3a-46fc-869d-ee029f6de648" />

          {/* Optional: Anti-Spam Honeypot Field (Hidden from real users) */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

          <Field label="Name" name="name" required placeholder="Your name" />
          <Field label="Email" name="email" type="email" required placeholder="you@company.com" />
          <Field
            label="Message"
            name="message"
            textarea
            required
            placeholder="Tell me about the role or project..."
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-3 rounded-full bg-foreground text-background font-medium hover:bg-primary hover:text-primary-foreground transition disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Sending..." : "Send message →"}
          </button>

          {/* Success / Error UI Messages */}
          {formStatus === "success" && (
            <p className="font-mono text-xs text-primary mt-2">
              ● Message sent successfully! Speak soon.
            </p>
          )}
          {formStatus === "error" && (
            <p className="font-mono text-xs text-destructive mt-2">
              ▲ Something went wrong. Please try again directly via email.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  textarea,
  required,
}: {
  label: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className="w-full bg-input/40 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition"
        />
      )}
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <div>© 2026 Arush Kshatriya — Built with Next.js, Tailwind &amp; Care.</div>
        <div className="flex items-center gap-10 text-2xl font-medium">
          <a
            href="https://github.com/ArushKshatriya"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/arush-kshatriya"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
