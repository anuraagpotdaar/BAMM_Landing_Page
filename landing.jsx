/* global React */

const { useState, useEffect } = React;

// Mixamo first, built-in retargeting target.
const TOOLS = [
  { name: "Mixamo",      glyph: "◐" },
  { name: "Blender",     glyph: "◉" },
  { name: "Unity",       glyph: "▲" },
  { name: "Unreal",      glyph: "◆" },
];

function ToolWordmark({ name, glyph }) {
  return (
    <div className="tool" aria-label={name}>
      <span className="tool-glyph" aria-hidden>{glyph}</span>
      <span>{name}</span>
    </div>
  );
}

function ToolStripScrolling() {
  // duplicate for seamless marquee
  const items = [...TOOLS, ...TOOLS];
  return (
    <div className="tools-strip">
      <div className="tools-track">
        {items.map((t, i) => <ToolWordmark key={i} {...t} />)}
      </div>
    </div>
  );
}

function ToolStripGrid() {
  return (
    <div className="tools-grid tools-grid-4">
      {TOOLS.map((t, i) => <ToolWordmark key={i} {...t} />)}
    </div>
  );
}

function FeatureCard({ tag, num, title, desc, hover, children }) {
  return (
    <article className="fcard" data-hover={hover}>
      <div className="fcard-media">
        {children}
      </div>
      <div className="fcard-body">
        <div className="fcard-tag">
          <span className="num">{num}</span>
          <span>{tag}</span>
        </div>
        <h3 className="fcard-title">{title}</h3>
        <p className="fcard-desc">{desc}</p>
        <div className="fcard-foot">
          <span>Watch demo</span>
          <span className="arrow">→</span>
        </div>
      </div>
    </article>
  );
}

function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-row">
        <div className="brand">
          <div className="brand-mark">B</div>
          <span>BAMM</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#tools">Integrations</a>
          <a href="#examples">Examples</a>
          <a href="#login" style={{ color: "var(--fg-3)" }}>Sign in</a>
          <a href="#try" className="nav-cta">Start creating <span className="arrow">→</span></a>
        </div>
      </div>
    </nav>
  );
}

function PillRow() {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
      {["AI-powered motion generation", "Multi-format export", "Real-time 3D preview"].map((t) => (
        <span key={t} className="hero-eyebrow" style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}>{t}</span>
      ))}
    </div>
  );
}

function Hero({ variant = "A" }) {
  if (variant === "B") {
    return (
      <section className="hero">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <span className="hero-eyebrow"><span className="dot" /> body avatar motion model</span>
            <h1 className="hero-title">
              3D animation<br />
              from <span className="accent">text</span><br />
              and <span className="accent">audio.</span>
            </h1>
            <p className="hero-sub">
              Transform natural language and audio into realistic 3D character animation. Generate,
              customize, and export professional motion data, without the technical barriers.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#try">Start creating <span className="arrow">→</span></a>
              <a className="btn btn-ghost" href="#login">Sign in</a>
            </div>
            <PillRow />
          </div>
          <window.HeroCanvas />
        </div>
      </section>
    );
  }
  // A, canvas-dominant
  return (
    <section className="hero">
      <div className="container">
        <span className="hero-eyebrow"><span className="dot" /> body avatar motion model</span>
        <h1 className="hero-title">
          Create 3D animations<br />
          from <span className="accent">text</span> &amp; <span className="accent">audio.</span>
        </h1>
        <p className="hero-sub">
          Transform natural language and audio into realistic 3D character animation.
          Generate, customize, and export professional motion data, without the technical barriers.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#try">Start creating <span className="arrow">→</span></a>
          <a className="btn btn-ghost" href="#login">Sign in</a>
        </div>
        <PillRow />
        <window.HeroCanvas />
      </div>
    </section>
  );
}

function Tools({ rhythm = "scroll" }) {
  return (
    <section className="tools" id="tools">
      <div className="container">
        <div className="section-eyebrow">// integrations</div>
        <h2 className="section-title">Drops into the tools you already use.</h2>
        {rhythm === "scroll" ? <ToolStripScrolling /> : <ToolStripGrid />}
      </div>
    </section>
  );
}

function Features({ hover = "default" }) {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features-head">
          <div>
            <div className="section-eyebrow">// capabilities</div>
            <h2 className="section-title">Direct motion the way you think about it.</h2>
          </div>
          <p className="features-sub">
            Two of the inputs BAMM understands. Each generates fully retargetable animation
            you can take straight into your DCC of choice.
          </p>
        </div>
        <div className="feature-grid feature-grid-3">
          <FeatureCard
            num="01"
            tag="text · BAMM 2.0"
            title="Text to Motion"
            desc="Describe the action in plain language. BAMM generates the animation."
            hover={hover}
          >
            <window.TextToMotionLoop />
          </FeatureCard>
          <FeatureCard
            num="02"
            tag="audio · DanceMosaic"
            title="Music to Motion"
            desc="Drop in an 8–12 second audio clip. The character dances to it, on the beat."
            hover={hover}
          >
            <window.MusicToMotionLoop />
          </FeatureCard>
          <FeatureCard
            num="03"
            tag="trajectory · MaskControl"
            title="Trajectory to Motion"
            desc="Draw a path on the canvas. Motion follows it, with an optional prompt to shape the action."
            hover={hover}
          >
            <window.TrajectoryToMotionLoop />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="container foot-row">
        <div className="brand">
          <div className="brand-mark">B</div>
          <span>BAMM</span>
        </div>
        <div className="foot-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#docs">Docs</a>
          <a href="#github">GitHub</a>
          <a href="#contact">Contact</a>
        </div>
        <div>© 2026 BAMM Research</div>
      </div>
    </footer>
  );
}

// ----- Page -----
function BammLanding({
  variant = "A",
  rhythm = "scroll",
  hover = "default",
  accent = "cyan",
  density = "default",
  reduced = false,
}) {
  return (
    <div
      className="bamm-root"
      data-accent={accent}
      data-density={density}
      data-reduced={reduced ? "true" : "false"}
    >
      <Nav />
      <Hero variant={variant} />
      <Tools rhythm={rhythm} />
      <Features hover={hover} />
      <Footer />
    </div>
  );
}

window.BammLanding = BammLanding;
