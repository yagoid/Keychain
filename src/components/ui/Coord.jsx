import React from "react";

/**
 * Coord — corner-pinned mono coordinate label.
 * Renders things like "// VAULT :: 0xA1 :: BLOCK 0014".
 *
 * Variants:
 *   tone="default" | "alive" | "plasma"
 *   pinned=true → absolute top-left corner (parent must be position: relative)
 */
export default function Coord({
  parts = [],
  tone = "default",
  pinned = false,
  className = "",
  children,
}) {
  const toneClass =
    tone === "alive" ? " pb-coord--alive" :
    tone === "plasma" ? " pb-coord--plasma" : "";
  const pinnedClass = pinned ? " pb-coord--pinned" : "";

  const text =
    children ??
    parts
      .filter(Boolean)
      .map((p, i) => (i === 0 ? `// ${p}` : p))
      .join(" :: ");

  return (
    <span className={`pb-coord${toneClass}${pinnedClass} ${className}`.trim()}>
      {text}
    </span>
  );
}
