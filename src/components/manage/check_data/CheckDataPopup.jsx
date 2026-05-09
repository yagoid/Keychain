import { TEXTS } from "../../../assets/locales/texts.js";
import "./CheckDataPopup.css";

export default function CheckDataPupup({ onClose, blockchainUserData }) {
  return (
    <>
      <div className="pb-overlay" onClick={onClose} />
      <aside className="pb-panel cd" role="dialog" aria-modal="true">
        <header className="pb-panel__head">
          <div>
            <span className="cd__coord">// CHAIN PROOF</span>
            <h2 className="pb-panel__title">{TEXTS.myBlockchainData.en}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pb-panel__close"
            aria-label="Close"
          >×</button>
        </header>
        <div className="pb-panel__body">
          <p className="cd__note">
            // Raw payload returned by the chain node for each anchored credential.
            Hash, nonce, IV and ciphertext are shown verbatim.
          </p>
          <div className="cd__list">
            {blockchainUserData.map((data, index) => (
              <div className="cd__item" key={index}>
                <div className="cd__item-head">
                  <span className="cd__item-num">
                    BLOCK {String(index).padStart(4, "0")}
                  </span>
                  <span className="cd__item-tag">// LIVE</span>
                </div>
                <pre className="cd__pre">{data}</pre>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
