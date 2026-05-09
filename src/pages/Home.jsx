import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./../contexts/authContext";
import { TEXTS } from "../assets/locales/texts.js";
import Navbar from "../components/navbar/Navbar";
import LocatorBar from "../components/locator_bar/LocatorBar.jsx";
import "./Home.css";

export default function HomePage() {
  const { userLoggedIn, currentUser } = useAuth();

  const [nameActiveSection] = useState(TEXTS.home.en);
  const [now, setNow] = useState(new Date());
  const homeSections = TEXTS.homeSections.en;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const tsLine = now
    .toISOString()
    .replace("T", " · ")
    .slice(0, 19);

  const userLabel =
    currentUser?.displayName ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "operator");

  return (
    <div className="bridge">
      {!userLoggedIn && <Navigate to={"../"} replace={true} />}
      <Navbar
        sections={homeSections}
        nameActiveSection={nameActiveSection}
        transmitter={TEXTS.home.en}
      />

      <aside className="bridge__locator" aria-label="Sections">
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

      <main className="bridge__main">
        {/* hero strip */}
        <header className="bridge__hero">
          <div className="bridge__hero-meta">
            <span className="bridge__coord">// BRIDGE :: 0xA1 :: ONLINE</span>
            <span className="bridge__pulse" aria-hidden="true" />
            <span className="bridge__time">{tsLine} UTC</span>
          </div>
          <h1 className="bridge__welcome">
            <span className="bridge__welcome-thin">{TEXTS.welcome.en.toUpperCase()},</span>
            <span className="bridge__welcome-name">{userLabel.toUpperCase()}</span>
          </h1>
          <p className="bridge__hero-sub">{TEXTS.homeText.en}</p>
        </header>

        {/* asymmetric grid: VAULT (large) | FORGE (med) | CHAIN (small) */}
        <section className="bridge__grid pb-stagger">
          <Link to="/manage" className="bridge__card bridge__card--vault">
            <span className="bridge__card-coord">// 01 — VAULT</span>
            <h2 className="bridge__card-title">My Passwords</h2>
            <p className="bridge__card-text">
              Open the encrypted ledger. Read, edit, and anchor new credentials
              to the chain.
            </p>
            <div className="bridge__card-foot">
              <span className="bridge__card-cta">ENTER VAULT</span>
              <span className="bridge__card-arrow" aria-hidden="true">→</span>
            </div>
            <div className="bridge__vault-art" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="bridge__vault-block"
                  style={{ "--i": i }}
                />
              ))}
            </div>
          </Link>

          <Link to="/generator" className="bridge__card bridge__card--forge">
            <span className="bridge__card-coord">// 02 — FORGE</span>
            <h2 className="bridge__card-title">Generator</h2>
            <p className="bridge__card-text">
              Forge cryptographically random passwords with custom charset and
              length.
            </p>
            <div className="bridge__card-foot">
              <span className="bridge__card-cta">FORGE NEW</span>
              <span className="bridge__card-arrow" aria-hidden="true">→</span>
            </div>
            <pre className="bridge__forge-sample" aria-hidden="true">{`v#7n@2L?qK$fY8`}</pre>
          </Link>

          <div className="bridge__card bridge__card--status" aria-live="polite">
            <span className="bridge__card-coord pb-coord--alive">// 03 — CHAIN</span>
            <h2 className="bridge__card-title">Chain Status</h2>
            <ul className="bridge__status-list">
              <li>
                <span>HEIGHT</span>
                <span className="pb-mono">0x0{Math.floor((now.getTime() / 1000) % 9999).toString(16)}</span>
              </li>
              <li>
                <span>CONSENSUS</span>
                <span className="pb-mono">PoW</span>
              </li>
              <li>
                <span>CIPHER</span>
                <span className="pb-mono">AES-256</span>
              </li>
              <li>
                <span>STATUS</span>
                <span className="bridge__status-live">// LIVE</span>
              </li>
            </ul>
          </div>
        </section>

        {/* activity strip */}
        <section className="bridge__activity">
          <div className="bridge__activity-head">
            <span className="pb-tag">// ACTIVITY · LAST 24H</span>
            <span className="bridge__activity-cap">// REPLICATING</span>
          </div>
          <ul className="bridge__activity-list">
            <li>
              <span className="bridge__activity-time">23:44:12</span>
              <span className="bridge__activity-tag">ANCHOR</span>
              <span>new credential block <span className="pb-mono">0x4A2F</span> mined</span>
            </li>
            <li>
              <span className="bridge__activity-time">22:11:09</span>
              <span className="bridge__activity-tag bridge__activity-tag--ember">UNLOCK</span>
              <span>vault opened with private key <span className="pb-mono">****d8e2</span></span>
            </li>
            <li>
              <span className="bridge__activity-time">19:02:51</span>
              <span className="bridge__activity-tag">FORGE</span>
              <span>random password generated · <span className="pb-mono">22 chars</span></span>
            </li>
            <li>
              <span className="bridge__activity-time">07:58:04</span>
              <span className="bridge__activity-tag">SYNC</span>
              <span>ledger synced to height <span className="pb-mono">0x09c8</span></span>
            </li>
          </ul>
        </section>

        {/* fact strip */}
        <section className="bridge__fact">
          <span className="bridge__fact-num">{TEXTS.approximatelyNumber.en}</span>
          <div className="bridge__fact-body">
            <span className="bridge__fact-label">// {TEXTS.approximately.en.replace(",", "")}</span>
            <p className="bridge__fact-text">{TEXTS.approximatelyText.en}.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
