import React, { useState, useEffect } from "react";
import { TEXTS } from "../assets/locales/texts.js";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import copyIcon from "./../assets/images/copy_icon.svg";
import "./PasswordGenerator.css";

const CHARSETS = {
  lower:   "abcdefghijklmnopqrstuvwxyz",
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits:  "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}<>?/",
};

const generate = (length, opts) => {
  let pool = "";
  if (opts.lower)   pool += CHARSETS.lower;
  if (opts.upper)   pool += CHARSETS.upper;
  if (opts.digits)  pool += CHARSETS.digits;
  if (opts.symbols) pool += CHARSETS.symbols;
  if (!pool) return "";

  const arr = new Uint32Array(length);
  // Use crypto-grade randomness when available
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < length; i++) arr[i] = Math.floor(Math.random() * 0xffffffff);
  }
  let out = "";
  for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length];
  return out;
};

const strengthOf = (pwd) => {
  if (!pwd) return { label: "—", level: 0 };
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 18) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["WEAK", "WEAK", "FAIR", "STRONG", "FORTRESS", "FORTRESS"];
  return { label: labels[score], level: score };
};

export default function PasswordGeneratorPage() {
  const { userLoggedIn } = useAuth();
  const [nameActiveSection] = useState("Generator");
  const homeSections = TEXTS.homeSections.en;

  const [length, setLength] = useState(18);
  const [opts, setOpts] = useState({
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [passwordGenerated, setPasswordGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [forging, setForging] = useState(false);

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    setForging(true);
    setCopied(false);
    setTimeout(() => {
      setPasswordGenerated(generate(length, opts));
      setForging(false);
    }, 220);
  };

  const handleCopy = () => {
    if (!passwordGenerated) return;
    navigator.clipboard
      .writeText(passwordGenerated)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch((err) => console.error("Error al copiar al portapapeles:", err));
  };

  const setOpt = (k) => (e) => setOpts((s) => ({ ...s, [k]: e.target.checked }));
  const strength = strengthOf(passwordGenerated);
  const enabledCount = Object.values(opts).filter(Boolean).length;

  return (
    <div className="forge">
      {!userLoggedIn && <Navigate to={"../"} replace={true} />}
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />

      <aside className="forge__locator" aria-label="Sections">
        {homeSections.map((section, index) => (
          <LocatorBar
            key={index}
            section={section}
            nameActiveSection={nameActiveSection}
            index={index}
            lastIndex={index == homeSections.length - 1}
            transmitter={TEXTS.home.en}
          />
        ))}
      </aside>

      <main className="forge__main">
        <header className="forge__head">
          <div className="forge__head-meta">
            <span className="pb-tag">// FORGE :: 0xRNG</span>
            <span className="forge__head-coord">// CSPRNG · CryptoSubtle</span>
          </div>
          <h1 className="forge__title">
            <span className="forge__title-thin">Generate</span>
            <span className="forge__title-bold">PASSWORDS</span>
          </h1>
          <p className="forge__sub">{TEXTS.generatePassword.en}.</p>
        </header>

        <section className="forge__panel pb-stagger">
          {/* OUTPUT BLOCK */}
          <div className="forge__output">
            <div className="forge__output-head">
              <span className="pm__block-label">// OUTPUT</span>
              <span className={`forge__strength forge__strength--${strength.level}`}>
                ⌬ {strength.label}
              </span>
            </div>
            <div className={`forge__output-body ${forging ? "forge__output-body--forging" : ""}`}>
              <pre className="forge__output-text" aria-live="polite">
                {forging ? "▒▒▒▒▒▒▒▒▒▒▒▒" : passwordGenerated || "—"}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className={`forge__copy ${copied ? "forge__copy--ok" : ""}`}
                aria-label="Copy"
                disabled={!passwordGenerated}
              >
                {copied ? (
                  <span>✓ COPIED</span>
                ) : (
                  <>
                    <img src={copyIcon} alt="" className="forge__copy-icon" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
            {/* sparks layer */}
            <div className="forge__sparks" aria-hidden="true">
              {forging && Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="forge__spark"
                  style={{
                    "--sx": `${(Math.random() - 0.5) * 80}px`,
                    "--sy": `${-Math.random() * 60 - 10}px`,
                    "--delay": `${i * 25}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="forge__controls">
            <div className="forge__control">
              <div className="forge__control-row">
                <span className="pm__block-label">// LENGTH</span>
                <span className="forge__control-val">{length}</span>
              </div>
              <input
                type="range"
                className="pb-range"
                min="8"
                max="48"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
              />
              <div className="forge__control-scale">
                <span>08</span><span>24</span><span>48</span>
              </div>
            </div>

            <div className="forge__control">
              <span className="pm__block-label">// CHARSET</span>
              <div className="forge__charset">
                {[
                  ["lower",   "a–z"],
                  ["upper",   "A–Z"],
                  ["digits",  "0–9"],
                  ["symbols", "!@#"],
                ].map(([k, label]) => (
                  <label key={k} className="pb-switch forge__switch">
                    <input
                      type="checkbox"
                      checked={opts[k]}
                      onChange={setOpt(k)}
                      disabled={enabledCount === 1 && opts[k]}
                    />
                    <span className="pb-switch__track">
                      <span className="pb-switch__thumb" />
                    </span>
                    <span className="pb-switch__label">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="main-btn main-btn--plasma forge__forge-btn"
              onClick={handleGenerate}
              disabled={forging || enabledCount === 0}
            >
              <span className="main-btn__text">
                {forging ? "FORGING…" : "FORGE NEW"}
              </span>
              <span className="main-btn__arrow">⌬</span>
            </button>
          </div>
        </section>

        {/* anvil — decorative */}
        <div className="forge__anvil" aria-hidden="true">
          <span className="forge__anvil-coord">// ANVIL</span>
          <svg viewBox="0 0 200 60" width="100%">
            <line x1="0" y1="30" x2="200" y2="30" stroke="#2A2D35" strokeWidth="1" />
            {[20, 60, 100, 140, 180].map((x, i) => (
              <g key={i}>
                <rect x={x - 6} y="22" width="12" height="16" fill="none" stroke={i === 2 ? "#1cb0e6" : "#0f1820"} strokeWidth="1" />
                {i === 2 && <circle cx={x} cy="30" r="2" fill="#4adb84" />}
              </g>
            ))}
          </svg>
        </div>
      </main>
    </div>
  );
}
