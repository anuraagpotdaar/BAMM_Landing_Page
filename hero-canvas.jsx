/* global React */
// Hero canvas, stand-in for ThreeCanvas. SVG wireframe figure on a perspective grid,
// slow rotation to imply a live 3D viewport. Reads-as-a-real-viewport without faking it.

const { useEffect, useRef, useState } = React;

function HeroCanvas() {
  const [t, setT] = useState(0);
  const raf = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000; last = now;
      setT((x) => x + dt);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  // gentle yaw
  const yaw = Math.sin(t * 0.4) * 12; // degrees
  const bob = Math.sin(t * 1.2) * 1.5;

  return (
    <div className="hero-canvas">
      <div className="canvas-chrome">
        <span className="live"><span className="dot" /> live preview · smpl + mixamo</span>
        <span className="canvas-stats">
          <span>32 fps</span>
          <span>1.2k tris</span>
          <span>retarget · ok</span>
        </span>
      </div>
      <div className="hero-canvas-frame">
        <PerspectiveGrid t={t} reduced={reduced} />
        <Figure yaw={yaw} bob={bob} t={t} reduced={reduced} />
        <CornerTicks />
      </div>
    </div>
  );
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    // honor data-reduced override at the root, plus the OS query
    const update = () => {
      const root = document.querySelector(".bamm-root");
      const overridden = root && root.dataset.reduced === "true";
      const prefers = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setR(overridden || prefers);
    };
    update();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", update);
    const obs = new MutationObserver(update);
    const root = document.querySelector(".bamm-root");
    if (root) obs.observe(root, { attributes: true, attributeFilter: ["data-reduced"] });
    return () => { mq.removeEventListener?.("change", update); obs.disconnect(); };
  }, []);
  return r;
}

function PerspectiveGrid() {
  // a horizon-anchored perspective grid using SVG paths, drawn once
  const lines = [];
  const rows = 14;
  for (let i = 0; i <= rows; i++) {
    const z = i / rows;
    const y = 60 + z * 38; // 60 → 98 (% from top)
    const op = 0.05 + z * 0.18;
    lines.push(<line key={"h" + i} x1="0" y1={y + "%"} x2="100" y2={y + "%"} stroke={`rgba(255,255,255,${op})`} strokeWidth="0.1" vectorEffect="non-scaling-stroke" />);
  }
  const cols = 18;
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * 100;
    // converging toward (50, 60)
    lines.push(
      <line key={"v" + i} x1={x} y1="60%" x2={50 + (x - 50) * 2.4} y2="100%" stroke="rgba(255,255,255,0.10)" strokeWidth="0.1" vectorEffect="non-scaling-stroke" />
    );
  }
  return (
    <svg className="hc-grid" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
      {lines}
    </svg>
  );
}

function CornerTicks() {
  const tick = { stroke: "rgba(255,255,255,0.35)", strokeWidth: 1, fill: "none" };
  return (
    <svg style={{ position: "absolute", inset: 14, pointerEvents: "none" }} aria-hidden>
      <g>
        <path d="M0 14 L0 0 L14 0" {...tick} />
        <path d="M100% 14 L100% 0 L-14 0" transform="translate(0,0)" {...tick} />
      </g>
      {/* Use four explicit corners */}
      <g stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none">
        <path d="M0,18 L0,0 L18,0" />
        <g transform="translate(100% 0)"><path d="M0,18 L0,0 L-18,0" /></g>
        <g transform="translate(0 100%)"><path d="M0,-18 L0,0 L18,0" /></g>
        <g transform="translate(100% 100%)"><path d="M0,-18 L0,0 L-18,0" /></g>
      </g>
    </svg>
  );
}

// Stick figure rigged with simple joints; a walking gait + arm sway.
function Figure({ yaw, bob, t, reduced }) {
  // joint angles
  const phase = reduced ? 0 : t * 2.6;
  const leftLeg = Math.sin(phase) * 22;
  const rightLeg = Math.sin(phase + Math.PI) * 22;
  const leftArm = Math.sin(phase + Math.PI) * 28;
  const rightArm = Math.sin(phase) * 28;
  const torso = Math.sin(phase * 2) * 1.2;

  // figure stays anchored to the grid horizon (60% y)
  const cx = 50, cy = 78 + bob * 0.05;
  const j = (a, len, x0, y0) => {
    const rad = (a * Math.PI) / 180;
    return [x0 + Math.sin(rad) * len, y0 + Math.cos(rad) * len];
  };

  // skeleton
  const head = [cx, cy - 18];
  const neck = [cx, cy - 14];
  const pelvis = [cx, cy - 4];
  // arms, shoulder at neck
  const lShoulder = [cx - 3, cy - 13];
  const rShoulder = [cx + 3, cy - 13];
  const [lElbow] = [j(180 + leftArm, 5, lShoulder[0], lShoulder[1])];
  const [rElbow] = [j(180 - rightArm, 5, rShoulder[0], rShoulder[1])];
  const [lHand] = [j(180 + leftArm * 0.8, 5, lElbow[0], lElbow[1])];
  const [rHand] = [j(180 - rightArm * 0.8, 5, rElbow[0], rElbow[1])];
  // legs, hip at pelvis
  const lHip = [cx - 2, cy - 4];
  const rHip = [cx + 2, cy - 4];
  const [lKnee] = [j(0 + leftLeg, 7, lHip[0], lHip[1])];
  const [rKnee] = [j(0 + rightLeg, 7, rHip[0], rHip[1])];
  const [lFoot] = [j(0 + leftLeg * 0.4, 7, lKnee[0], lKnee[1])];
  const [rFoot] = [j(0 + rightLeg * 0.4, 7, rKnee[0], rKnee[1])];

  const bone = (a, b, key) => (
    <line key={key} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
      stroke="rgba(255,255,255,0.85)" strokeWidth="0.6" strokeLinecap="round"
      vectorEffect="non-scaling-stroke" />
  );
  const joint = (p, key, r = 0.7) => (
    <circle key={key} cx={p[0]} cy={p[1]} r={r} fill="rgba(255,255,255,0.95)" />
  );

  return (
    <div style={{
      position: "absolute", inset: 0,
      transform: `perspective(900px) rotateY(${yaw}deg)`,
      transformOrigin: "50% 78%",
      transition: reduced ? "none" : undefined,
    }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-label="3D figure preview">
        {/* shadow */}
        <ellipse cx={cx} cy={cy + 1.5} rx="6" ry="0.8" fill="rgba(0,0,0,0.55)" />
        {/* spine + head */}
        {bone(neck, pelvis, "spine")}
        <circle cx={head[0]} cy={head[1]} r="2.4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        {/* shoulders + hips */}
        {bone(lShoulder, rShoulder, "sh")}
        {bone(lHip, rHip, "hi")}
        {/* arms */}
        {bone(lShoulder, lElbow, "la1")}
        {bone(lElbow, lHand, "la2")}
        {bone(rShoulder, rElbow, "ra1")}
        {bone(rElbow, rHand, "ra2")}
        {/* legs */}
        {bone(lHip, lKnee, "ll1")}
        {bone(lKnee, lFoot, "ll2")}
        {bone(rHip, rKnee, "rl1")}
        {bone(rKnee, rFoot, "rl2")}
        {/* joint dots */}
        {[neck, pelvis, lShoulder, rShoulder, lElbow, rElbow, lHand, rHand, lHip, rHip, lKnee, rKnee, lFoot, rFoot].map((p, i) => joint(p, "j" + i))}
        {/* targeting reticle */}
        <g stroke="rgba(180,220,255,0.55)" strokeWidth="0.25" fill="none" vectorEffect="non-scaling-stroke">
          <circle cx={cx} cy={cy - 9} r="14" strokeDasharray="0.8 1.2" />
        </g>
      </svg>
    </div>
  );
}

window.HeroCanvas = HeroCanvas;
window.useReducedMotion = useReducedMotion;
