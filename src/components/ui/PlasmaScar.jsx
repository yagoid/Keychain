import React from "react";

/**
 * PlasmaScar — animated cyan slash divider.
 * The "underglow" on Toothless's snout, used as section divider /
 * focus indicator / loading bar.
 *
 * Props:
 *   tone   "plasma" | "ember"
 *   static  bool — disable the slide-in animation (instant full bar)
 */
export default function PlasmaScar({
  tone = "plasma",
  static: isStatic = false,
  className = "",
  style,
}) {
  const cls = [
    "pb-scar",
    tone === "ember" ? "pb-scar--ember" : "",
    isStatic ? "pb-scar--static" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span role="presentation" className={cls} style={style} />;
}
