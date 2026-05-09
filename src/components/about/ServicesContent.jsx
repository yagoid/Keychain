import { useState, useEffect, useMemo } from "react";
import { TEXTS } from "./../../assets/locales/texts.js";
import "./ServicesContent.css";

/* Animated chain visualization — 5 blocks, tip block keeps producing fresh hashes */
function ChainViz() {
  const [tip, setTip] = useState(14092);
  useEffect(() => {
    const id = setInterval(() => setTip((n) => n + 1), 4200);
    return () => clearInterval(id);
  }, []);

  const blocks = useMemo(() => {
    return [0, 1, 2, 3, 4].map(() => {
      const r = () => Math.floor(Math.random() * 16).toString(16);
      const h = '0x' + Array.from({ length: 4 }, r).join('').toUpperCase();
      return { hash: h };
    });
  }, [tip]);

  return (
    <div className="srv__chain">
      <div className="srv__chain-head">
        <span className="srv__chain-label">// CHAIN · LEDGER</span>
        <span className="srv__chain-live">
          <span className="srv__chain-dot" />
          LIVE
        </span>
      </div>

      <div className="srv__chain-blocks">
        {blocks.map((b, i) => {
          const isTip = i === blocks.length - 1;
          const blockNum = tip - (blocks.length - 1 - i);
          return (
            <div key={i} className="srv__chain-unit">
              <div className={`srv__block ${isTip ? 'srv__block--tip' : ''}`}>
                <div className={`srv__block-num ${isTip ? 'srv__block-num--tip' : ''}`}>
                  BLOCK {String(blockNum).padStart(5, '0')}
                </div>
                <div className="srv__block-hash">{b.hash}</div>
                {isTip && <span className="srv__block-tip-tag">TIP</span>}
              </div>
              {i < blocks.length - 1 && (
                <div className="srv__block-connector">
                  <span
                    className="srv__block-connector-dot"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="srv__chain-foot">
        <span>// HEIGHT {tip.toLocaleString()}</span>
        <span className="srv__chain-foot-live">↑ +1 block</span>
      </div>
    </div>
  );
}

const Spec = ({ idx, title, text, last }) => (
  <div className={`srv__spec ${last ? 'srv__spec--last' : ''}`}>
    <div className="srv__spec-meta">
      <div className="srv__spec-num">
        {String(idx).padStart(2, '0')}
        <span className="srv__spec-bar" />
      </div>
      <div className="srv__spec-tag">// SPEC.{String(idx).padStart(2, '0')}</div>
    </div>
    <div className="srv__spec-body">
      <h4 className="srv__spec-title">{title}</h4>
      <p className="srv__spec-text">{text}</p>
    </div>
  </div>
);

export default function ServicesContent() {
  return (
    <div className="srv">
      <header className="srv__head">
        <div className="srv__head-meta">
          <span className="pb-tag">// 02 — services</span>
          <span className="srv__head-coord">// CHAIN_SPEC :: V0.014</span>
        </div>
        <h2 className="srv__heading">
          Welcome to the era of <span className="srv__heading-accent">blockchain</span>.
        </h2>
        <p className="srv__lead">↳ {TEXTS.servicesSecondTittle.en}</p>
      </header>

      <div className="srv__grid">
        <ChainViz />

        <div className="srv__list">
          <Spec idx={1} title={TEXTS.servicesParagraphTittle1.en} text={TEXTS.servicesParagraph1.en} />
          <Spec idx={2} title={TEXTS.servicesParagraphTittle2.en} text={TEXTS.servicesParagraph2.en} />
          <Spec idx={3} title={TEXTS.servicesParagraphTittle3.en} text={TEXTS.servicesParagraph3.en} />
          <Spec idx={4} title={TEXTS.servicesParagraphTittle4.en} text={TEXTS.servicesParagraph4.en} last />
        </div>
      </div>
    </div>
  );
}
