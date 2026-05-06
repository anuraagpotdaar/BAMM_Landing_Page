/* global React */
// Feature card video stand-ins, animated CSS/SVG loops that evoke the feature.
// Card 1: Music to Motion, waveform morphs into a moving figure.
// Card 2: Trajectory to Motion, a path traced through space, figure follows it.

const { useEffect, useRef, useState } = React;

function MusicToMotionLoop() {
  const reduced = window.useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let raf, last = performance.now();
    const tick = (now) => { setT((x) => x + (now - last) / 1000); last = now; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // waveform bars across the bottom; each bar amplitude = sine of (t + i*phase)
  const bars = 56;
  const beat = Math.abs(Math.sin(t * 3.2));
  // figure dance: arm sway + bob synced to beat
  const armL = Math.sin(t * 3.2) * 35;
  const armR = -Math.sin(t * 3.2) * 35;
  const hipL = Math.sin(t * 1.6) * 12;
  const hipR = -Math.sin(t * 1.6) * 12;
  const headBob = Math.abs(Math.sin(t * 3.2)) * 1.2;

  const cx = 30, cy = 56 - headBob;
  const j = (a, len, x0, y0) => {
    const r = (a * Math.PI) / 180;
    return [x0 + Math.sin(r) * len, y0 + Math.cos(r) * len];
  };
  const head = [cx, cy - 12];
  const pelvis = [cx, cy + 4];
  const lSh = [cx - 3, cy - 8], rSh = [cx + 3, cy - 8];
  const lEl = j(180 + armL, 5, lSh[0], lSh[1]);
  const rEl = j(180 + armR, 5, rSh[0], rSh[1]);
  const lHa = j(180 + armL * 0.7, 5, lEl[0], lEl[1]);
  const rHa = j(180 + armR * 0.7, 5, rEl[0], rEl[1]);
  const lHi = [cx - 2, cy + 4], rHi = [cx + 2, cy + 4];
  const lKn = j(0 + hipL, 5, lHi[0], lHi[1]);
  const rKn = j(0 + hipR, 5, rHi[0], rHi[1]);
  const lFo = j(0 + hipL * 0.5, 5, lKn[0], lKn[1]);
  const rFo = j(0 + hipR * 0.5, 5, rKn[0], rKn[1]);
  const bone = (a, b, k) => <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.92)" strokeWidth="0.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
      {/* faint ground */}
      <line x1="10" y1="80" x2="90" y2="80" stroke="rgba(255,255,255,0.10)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
      {/* figure */}
      <g>
        <ellipse cx={cx} cy="80.4" rx="4" ry="0.6" fill="rgba(0,0,0,0.5)" />
        <circle cx={head[0]} cy={head[1]} r="2" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        {bone([cx, cy - 8], pelvis, "spine")}
        {bone(lSh, rSh, "sh")} {bone(lHi, rHi, "hi")}
        {bone(lSh, lEl, "la1")} {bone(lEl, lHa, "la2")}
        {bone(rSh, rEl, "ra1")} {bone(rEl, rHa, "ra2")}
        {bone(lHi, lKn, "ll1")} {bone(lKn, lFo, "ll2")}
        {bone(rHi, rKn, "rl1")} {bone(rKn, rFo, "rl2")}
      </g>
      {/* connector, pulsing line linking waveform to figure */}
      <line x1="55" y1="50" x2={cx + 2} y2={cy} stroke="rgba(180,220,255,0.4)" strokeWidth="0.2" strokeDasharray="0.8 0.6" vectorEffect="non-scaling-stroke" />
      {/* waveform bars on the right side, vertical */}
      <g>
        {Array.from({ length: bars }).map((_, i) => {
          const x = 56 + i * 0.7;
          const amp = (Math.sin(t * 4 + i * 0.35) + Math.sin(t * 6 + i * 0.18)) * 0.5 + 0.5;
          const h = 4 + amp * 28 * (0.6 + beat * 0.4);
          return <rect key={i} x={x} y={50 - h / 2} width="0.4" height={h} fill="rgba(255,255,255,0.7)" />;
        })}
      </g>
      {/* timeline ticks */}
      <g fontFamily="ui-monospace, monospace" fontSize="2.6" fill="rgba(255,255,255,0.4)">
        <text x="56" y="92">00:03</text>
        <text x="84" y="92" textAnchor="end">00:08</text>
      </g>
    </svg>
  );
}

function TrajectoryToMotionLoop() {
  const reduced = window.useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let raf, last = performance.now();
    const tick = (now) => { setT((x) => x + (now - last) / 1000); last = now; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // a Lissajous-style path the figure walks
  const period = 8;
  const u = (t % period) / period; // 0..1 looping
  const pathPt = (s) => {
    const ang = s * Math.PI * 2;
    return [50 + Math.sin(ang) * 28, 60 + Math.cos(ang * 2) * 14];
  };
  const [fx, fy] = pathPt(reduced ? 0.25 : u);
  // facing direction (tangent)
  const [nx, ny] = pathPt((u + 0.005) % 1);
  const heading = Math.atan2(nx - fx, fy - ny) * 180 / Math.PI; // for yaw

  // dotted full path
  const samples = 80;
  const pathD = Array.from({ length: samples + 1 }).map((_, i) => {
    const [x, y] = pathPt(i / samples);
    return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  // walk cycle
  const phase = reduced ? 0 : t * 4;
  const armL = Math.sin(phase) * 22, armR = -armL;
  const legL = Math.sin(phase) * 18, legR = -legL;
  const cx = fx, cy = fy;
  const j = (a, len, x0, y0) => {
    const r = (a * Math.PI) / 180;
    return [x0 + Math.sin(r) * len, y0 + Math.cos(r) * len];
  };
  const head = [cx, cy - 9];
  const pelvis = [cx, cy + 1];
  const lSh = [cx - 2, cy - 6], rSh = [cx + 2, cy - 6];
  const lEl = j(180 + armL, 3.2, lSh[0], lSh[1]);
  const rEl = j(180 + armR, 3.2, rSh[0], rSh[1]);
  const lHa = j(180 + armL * 0.7, 3, lEl[0], lEl[1]);
  const rHa = j(180 + armR * 0.7, 3, rEl[0], rEl[1]);
  const lHi = [cx - 1.2, cy + 1], rHi = [cx + 1.2, cy + 1];
  const lKn = j(0 + legL, 3.5, lHi[0], lHi[1]);
  const rKn = j(0 + legR, 3.5, rHi[0], rHi[1]);
  const lFo = j(0 + legL * 0.5, 3, lKn[0], lKn[1]);
  const rFo = j(0 + legR * 0.5, 3, rKn[0], rKn[1]);
  const bone = (a, b, k) => <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.92)" strokeWidth="0.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;

  // progressed (filled) portion of the path
  const filled = Array.from({ length: Math.max(2, Math.floor(samples * u) + 1) }).map((_, i) => {
    const [x, y] = pathPt(i / samples);
    return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
      {/* grid floor */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1="10" y1={20 + i * 8} x2="90" y2={20 + i * 8} stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={10 + i * 8} y1="20" x2={10 + i * 8} y2="92" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
      ))}
      {/* ghost path */}
      <path d={pathD} stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" fill="none" strokeDasharray="0.8 1.2" vectorEffect="non-scaling-stroke" />
      {/* progressed path */}
      <path d={filled} stroke="rgba(180,220,255,0.85)" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
      {/* waypoints */}
      {[0, 0.25, 0.5, 0.75].map((s) => {
        const [x, y] = pathPt(s);
        return <circle key={s} cx={x} cy={y} r="0.7" fill="rgba(255,255,255,0.5)" />;
      })}
      {/* figure */}
      <ellipse cx={cx} cy={cy + 7} rx="2.6" ry="0.4" fill="rgba(0,0,0,0.5)" />
      <circle cx={head[0]} cy={head[1]} r="1.6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
      {bone([cx, cy - 6], pelvis, "spine")}
      {bone(lSh, rSh, "sh")} {bone(lHi, rHi, "hi")}
      {bone(lSh, lEl, "la1")} {bone(lEl, lHa, "la2")}
      {bone(rSh, rEl, "ra1")} {bone(rEl, rHa, "ra2")}
      {bone(lHi, lKn, "ll1")} {bone(lKn, lFo, "ll2")}
      {bone(rHi, rKn, "rl1")} {bone(rKn, rFo, "rl2")}
      {/* heading reticle */}
      <circle cx={fx} cy={fy} r="5" stroke="rgba(180,220,255,0.45)" strokeWidth="0.2" fill="none" strokeDasharray="0.6 0.9" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

window.MusicToMotionLoop = MusicToMotionLoop;
window.TrajectoryToMotionLoop = TrajectoryToMotionLoop;

// Text to Motion, a typing prompt that resolves into a walking figure.
function TextToMotionLoop() {
  const reduced = window.useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced) return;
    let raf, last = performance.now();
    const tick = (now) => { setT((x) => x + (now - last) / 1000); last = now; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const PROMPTS = ["person walking quickly", "dancing salsa", "throws a punch"];
  const period = 4.5; // per prompt
  const cycle = (t / period) % PROMPTS.length;
  const idx = Math.floor(cycle);
  const local = cycle - idx;
  const prompt = PROMPTS[idx];
  const reveal = Math.min(1, local * 1.6);
  const typed = prompt.slice(0, Math.floor(prompt.length * (reduced ? 1 : reveal)));
  const caret = (Math.floor(t * 2) % 2 === 0) ? "▍" : " ";

  // walk cycle, intensity ramps once prompt is fully typed
  const ready = reduced ? 1 : Math.max(0, Math.min(1, (local - 0.6) / 0.3));
  const phase = reduced ? 0 : t * (3 + idx * 0.6);
  const armL = Math.sin(phase) * 26 * ready, armR = -armL;
  const legL = Math.sin(phase) * 22 * ready, legR = -legL;

  // shift figure right when "walking quickly", static when others
  const driftX = idx === 0 ? (Math.sin(t * 0.6) * 14) : 0;
  const cx = 70 + driftX, cy = 60;
  const j = (a, len, x0, y0) => { const r = (a * Math.PI) / 180; return [x0 + Math.sin(r) * len, y0 + Math.cos(r) * len]; };
  const head = [cx, cy - 11];
  const pelvis = [cx, cy + 2];
  const lSh = [cx - 2.4, cy - 7], rSh = [cx + 2.4, cy - 7];
  const lEl = j(180 + armL, 4, lSh[0], lSh[1]);
  const rEl = j(180 + armR, 4, rSh[0], rSh[1]);
  const lHa = j(180 + armL * 0.7, 4, lEl[0], lEl[1]);
  const rHa = j(180 + armR * 0.7, 4, rEl[0], rEl[1]);
  const lHi = [cx - 1.5, cy + 2], rHi = [cx + 1.5, cy + 2];
  const lKn = j(0 + legL, 4.2, lHi[0], lHi[1]);
  const rKn = j(0 + legR, 4.2, rHi[0], rHi[1]);
  const lFo = j(0 + legL * 0.5, 4, lKn[0], lKn[1]);
  const rFo = j(0 + legR * 0.5, 4, rKn[0], rKn[1]);
  const bone = (a, b, k) => <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.92)" strokeWidth="0.45" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
      {/* prompt input chip */}
      <rect x="6" y="14" width="58" height="14" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.2" />
      <text x="9.5" y="23" fontFamily="ui-monospace, monospace" fontSize="3.4" fill="rgba(255,255,255,0.9)">
        {typed}{caret}
      </text>
      <text x="9.5" y="37" fontFamily="ui-monospace, monospace" fontSize="2.6" fill="rgba(180,220,255,0.7)" letterSpacing="0.2">
        bamm 2.0 · text → motion
      </text>
      {/* connector arrow */}
      <path d="M64 21 C 70 21, 70 50, 76 50" stroke="rgba(180,220,255,0.45)" strokeWidth="0.3" fill="none" strokeDasharray="0.8 0.8" vectorEffect="non-scaling-stroke" />
      {/* ground */}
      <line x1="50" y1="68" x2="92" y2="68" stroke="rgba(255,255,255,0.10)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
      {/* figure */}
      <ellipse cx={cx} cy="68.4" rx="3" ry="0.5" fill="rgba(0,0,0,0.5)" />
      <circle cx={head[0]} cy={head[1]} r="1.8" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
      {bone([cx, cy - 7], pelvis, "spine")}
      {bone(lSh, rSh, "sh")} {bone(lHi, rHi, "hi")}
      {bone(lSh, lEl, "la1")} {bone(lEl, lHa, "la2")}
      {bone(rSh, rEl, "ra1")} {bone(rEl, rHa, "ra2")}
      {bone(lHi, lKn, "ll1")} {bone(lKn, lFo, "ll2")}
      {bone(rHi, rKn, "rl1")} {bone(rKn, rFo, "rl2")}
      {/* timeline */}
      <text x="6" y="92" fontFamily="ui-monospace, monospace" fontSize="2.6" fill="rgba(255,255,255,0.4)">
        {`${(local * 4).toFixed(1)}s · 30 fps`}
      </text>
    </svg>
  );
}

window.TextToMotionLoop = TextToMotionLoop;
