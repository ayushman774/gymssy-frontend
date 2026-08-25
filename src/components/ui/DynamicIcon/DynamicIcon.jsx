// src/ui/DynamicIcon/DynamicIcon.jsx

/**
 * DynamicIcon
 *
 * Renders a Lucide icon by the string name sent from the backend.
 *
 * Props:
 *   name        {string}           Backend icon name  e.g. "Dumbbell"
 *   fallback    {ReactComponent}   Shown when name is missing / unknown
 *   size        {number}           Icon size in px (default 20)
 *   strokeWidth {number}           Lucide stroke width (default 1.75)
 *   className   {string}
 *   style       {object}
 *   ariaHidden  {boolean}          Default true — icons are decorative
 */

import { Grid } from "lucide-react";
import ICON_REGISTRY from "../../../utils/iconRegistry";

const DynamicIcon = ({
  name,
  fallback: Fallback = Grid,
  size = 20,
  strokeWidth = 1.75,
  className,
  style,
  ariaHidden = true,
}) => {
  /* Exact match first, then case-insensitive scan as safety net */
  const Icon =
    ICON_REGISTRY[name] ??
    ICON_REGISTRY[
      Object.keys(ICON_REGISTRY).find(
        (k) => k.toLowerCase() === name?.toLowerCase(),
      )
    ] ??
    Fallback;

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden={ariaHidden}
    />
  );
};

export default DynamicIcon;
