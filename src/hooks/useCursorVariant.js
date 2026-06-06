import { useContext, useCallback } from "react";
import { CursorContext } from "../context/CursorContext";

export const useCursorVariant = () => {
  const context = useContext(CursorContext);

  if (!context) {
    // ✅ Safe fallback — prevents crash if used outside provider
    return {
      variant:     "default",
      label:       "",
      isHidden:    false,
      setCursor:   () => {},
      resetCursor: () => {},
      hideCursor:  () => {},
      showCursor:  () => {},
    };
  }

  return {
    ...context,
    // ✅ Guarantee resetCursor always exists
    resetCursor: context.resetCursor ?? (() => context.setCursor("default")),
  };
};