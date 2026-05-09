import { useEffect, useRef, useMemo } from 'react';

/* NodeMesh — canvas mesh of moving nodes connected by thin lines */
function NodeMesh({ density = 0.6, accent = '#1cb0e6', intensity = 0.5 }) {
  const ref = useRef(null);
  const stateRef = useRef({ nodes: [], w: 0, h: 0, t: 0, raf: 0, mouse: { x: -9999, y: -9999 } });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current.w = w;
      stateRef.current.h = h;
      seed();
    }
    function seed() {
      const { w, h } = stateRef.current;
      const area = w * h;
      const target = Math.max(28, Math.floor((area / 22000) * density));
      const nodes = [];
      for (let i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 0.6,
          isAccent: Math.random() < 0.06,
        });
      }
      stateRef.current.nodes = nodes;
    }
    function frame() {
      const { w, h, nodes, mouse } = stateRef.current;
      stateRef.current.t += 1;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const f = (140 - Math.sqrt(d2)) / 140 * 0.5;
          n.x += (dx / Math.sqrt(d2 || 1)) * f;
          n.y += (dy / Math.sqrt(d2 || 1)) * f;
        }
      }

      const linkR = 130;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkR) {
            const op = (1 - d / linkR) * 0.32 * intensity;
            ctx.strokeStyle = `rgba(180,210,230,${op})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (n.isAccent) {
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(220,235,245,${0.55 * intensity + 0.18})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      stateRef.current.raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      stateRef.current.mouse.x = e.clientX - r.left;
      stateRef.current.mouse.y = e.clientY - r.top;
    }
    function onLeave() {
      stateRef.current.mouse.x = -9999;
      stateRef.current.mouse.y = -9999;
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [density, accent, intensity]);

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}

/* HashStream — vertical columns of hash chars scrolling down */
function HashStream({ intensity = 0.4 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cols = el.querySelectorAll('.hs-col');
    cols.forEach((col, i) => {
      col.style.animationDuration = `${28 + (i % 5) * 6}s`;
      col.style.animationDelay = `-${(i % 7) * 3}s`;
    });
  }, []);

  const columns = useMemo(() => {
    const COLS = 14;
    const out = [];
    for (let i = 0; i < COLS; i++) {
      const lines = [];
      for (let j = 0; j < 60; j++) {
        let h = '0x';
        const len = 6 + Math.floor(Math.random() * 6);
        for (let k = 0; k < len; k++) {
          h += '0123456789abcdef'[Math.floor(Math.random() * 16)];
        }
        lines.push(h);
      }
      out.push(lines);
    }
    return out;
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: intensity,
        maskImage:
          'linear-gradient(to bottom, transparent 0, #000 18%, #000 82%, transparent 100%), linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)',
        maskComposite: 'intersect',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0, #000 18%, #000 82%, transparent 100%), linear-gradient(to right, transparent 0, #000 12%, #000 88%, transparent 100%)',
        WebkitMaskComposite: 'source-in',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between' }}>
        {columns.map((lines, i) => (
          <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div
              className="hs-col"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                animation: 'hs-fall linear infinite',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                lineHeight: '20px',
                color: 'rgba(160,200,220,0.55)',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {lines.concat(lines).map((l, j) => (
                <div
                  key={j}
                  style={{
                    color:
                      j % 13 === 0 ? 'rgba(74,219,132,0.85)' :
                      j % 7 === 0  ? 'rgba(28,176,230,0.85)' :
                      undefined,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* WireGrid — subtle technical grid */
function WireGrid({ intensity = 0.5 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        opacity: intensity,
        maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 80%)',
      }}
    />
  );
}

/* Backdrop — composes layers based on variant */
export default function Backdrop({ variant = 'mesh', intensity = 0.55, accent = '#1cb0e6' }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      <WireGrid intensity={0.5 * intensity} />
      {variant === 'mesh' && (
        <NodeMesh density={0.7} accent={accent} intensity={Math.min(1, intensity + 0.15)} />
      )}
      {variant === 'hash' && (
        <HashStream intensity={Math.min(0.55, 0.2 + intensity * 0.5)} />
      )}
      {variant === 'both' && (
        <>
          <HashStream intensity={Math.min(0.35, 0.12 + intensity * 0.32)} />
          <NodeMesh density={0.55} accent={accent} intensity={Math.min(0.85, intensity)} />
        </>
      )}
    </div>
  );
}
