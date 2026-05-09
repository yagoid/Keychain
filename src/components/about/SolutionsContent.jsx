import { useState } from "react";
import { TEXTS } from "./../../assets/locales/texts.js";
import "./SolutionsContent.css";

const SOLUTIONS = [
  {
    id: 'sec',
    n: '01',
    glyph: 'SAFE',
    sub: '// secure_password_manager',
    diag: 'vault',
    titleKey: 'solutionsParagraphTittle1',
    bodyKey: 'solutionsParagraph1',
  },
  {
    id: 'lvl',
    n: '02',
    glyph: 'TIER',
    sub: '// customizable_security',
    diag: 'tiers',
    titleKey: 'solutionsParagraphTittle2',
    bodyKey: 'solutionsParagraph2',
  },
  {
    id: 'eff',
    n: '03',
    glyph: 'FAST',
    sub: '// efficient_password_handling',
    diag: 'flow',
    titleKey: 'solutionsParagraphTittle3',
    bodyKey: 'solutionsParagraph3',
  },
];

function Diagram({ kind }) {
  if (kind === 'vault') {
    const slices = ['0xa1c4', '7e29', 'ff03', '8b91', '02de', 'cc44', '1f7a'];
    return (
      <div className="sol__diag">
        <div className="sol__diag-label">↳ secret · sliced &amp; sealed</div>
        <div className="sol__diag-vault">
          <span className="sol__diag-eq">"my_password" =</span>
          {slices.map((s, i) => (
            <span
              key={i}
              className="sol__diag-slice"
              style={{
                color: i === 2 ? 'var(--ember)' : 'var(--bone)',
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="sol__diag-label" style={{ marginTop: 22 }}>
          ↳ replicated across <span style={{ color: 'var(--plasma)' }}>2,481</span> nodes
        </div>
      </div>
    );
  }

  if (kind === 'tiers') {
    const tiers = [
      { name: 'L0 / hot',  detail: 'biometric · everyday', dot: 'var(--bone-mute)', bar: 0.32 },
      { name: 'L1 / warm', detail: 'passphrase · weekly',  dot: 'var(--plasma)',    bar: 0.6 },
      { name: 'L2 / cold', detail: 'hardware · vault',     dot: 'var(--ember)',     bar: 0.92 },
    ];
    return (
      <div className="sol__diag">
        <div className="sol__diag-label">↳ assign tier per credential</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          {tiers.map((t) => (
            <div key={t.name} className="sol__diag-tier">
              <span className="sol__diag-tier-name">
                <span
                  style={{
                    display: 'inline-block', width: 7, height: 7,
                    borderRadius: '50%', background: t.dot, marginRight: 8,
                  }}
                />
                {t.name}
              </span>
              <div className="sol__diag-bar">
                <div className="sol__diag-bar-fill" style={{ width: `${t.bar * 100}%`, background: t.dot }} />
              </div>
              <span className="sol__diag-tier-detail">{t.detail}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const steps = ['INPUT', 'ENCRYPT', 'SIGN', 'COMMIT', 'CONFIRM'];
  return (
    <div className="sol__diag">
      <div className="sol__diag-label">↳ commit cycle · 240ms avg</div>
      <div className="sol__diag-flow">
        {steps.map((s, i) => (
          <span key={s} className="sol__diag-flow-wrap">
            <span
              className="sol__diag-step"
              style={i === 2 ? { color: 'var(--ember)', background: 'rgba(74,219,132,0.08)', borderColor: 'var(--ash-soft)' } : {}}
            >
              {s}
            </span>
            {i < steps.length - 1 && <span className="sol__diag-arrow">→</span>}
          </span>
        ))}
      </div>
      <div className="sol__diag-label sol__diag-stats">
        <span>↳ <span style={{ color: 'var(--plasma)' }}>240ms</span> commit</span>
        <span>↳ <span style={{ color: 'var(--plasma)' }}>0</span> roundtrips</span>
        <span>↳ <span style={{ color: 'var(--ember)' }}>100%</span> client-side</span>
      </div>
    </div>
  );
}

export default function SolutionsContent() {
  const [active, setActive] = useState(0);
  const cur = SOLUTIONS[active];

  return (
    <div className="sol">
      <header className="sol__head">
        <div className="sol__head-meta">
          <span className="pb-tag">// 01 — solutions</span>
          <span className="sol__head-coord">// CHAIN_SPEC :: V0.014</span>
        </div>
        <h2 className="sol__heading">
          The first <span className="sol__heading-accent">blockchain-native</span> password manager.
        </h2>
        <p className="sol__lead">↳ {TEXTS.solutionsThirdTittle.en}</p>
      </header>

      <div className="sol__split">
        {/* index column */}
        <div className="sol__index">
          {SOLUTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`sol__tab ${active === i ? 'sol__tab--active' : ''}`}
            >
              <div className="sol__tab-num">
                {s.n} · {s.glyph}
              </div>
              <div className="sol__tab-title">
                {TEXTS[s.titleKey]?.en ?? s.titleKey}
              </div>
            </button>
          ))}
        </div>

        {/* divider */}
        <div className="sol__divider" aria-hidden="true" />

        {/* detail panel */}
        <div className="sol__detail">
          <div className="sol__detail-sub">{cur.sub}</div>
          <h3 className="sol__detail-title">
            {TEXTS[cur.titleKey]?.en ?? cur.titleKey}
          </h3>
          <p className="sol__detail-body">
            {TEXTS[cur.bodyKey]?.en ?? cur.bodyKey}
          </p>
          <Diagram kind={cur.diag} />
          <div className="sol__detail-foot">
            <span>SPEC.{String(active + 1).padStart(2, '0')}</span>
            <span style={{ color: 'var(--bone-dim)' }}>STATUS · OPERATIONAL</span>
            <span>·</span>
            <span style={{ color: 'var(--ember)' }}>● synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
