import React from "react";
import "./BlockChain.css";

/**
 * BlockChain — vertical chain connector between two stacked blocks.
 * Renders a thin vertical rule with a small hex midpoint that pulses plasma.
 *
 * Use BETWEEN sibling blocks in a vertical stack:
 *   <PasswordCard />
 *   <BlockChain />
 *   <PasswordCard />
 */
export default function BlockChain({
  alive = false,
  height = 64,
  className = "",
}) {
  return (
    <div
      className={`pb-chain ${alive ? "pb-chain--alive" : ""} ${className}`.trim()}
      style={{ height }}
      aria-hidden="true"
    >
      <span className="pb-chain__line" />
      <span className="pb-chain__hex pb-clip-hex" />
      <span className="pb-chain__line" />
    </div>
  );
}
