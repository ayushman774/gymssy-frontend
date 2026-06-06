import { createContext, useState, useCallback } from "react";

export const CursorContext = createContext(null);

export const CursorProvider = ({ children }) => {
  const [variant, setVariant] = useState("default");
  const [label, setLabel] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  const setCursor = useCallback((newVariant, newLabel = "") => {
    setVariant(newVariant);
    setLabel(newLabel);
  }, []);

  // ✅ ADD THIS
  const resetCursor = useCallback(() => {
    setVariant("default");
    setLabel("");
    setIsHidden(false);
  }, []);

  const hideCursor = useCallback(() => setIsHidden(true), []);
  const showCursor = useCallback(() => setIsHidden(false), []);

  return (
    <CursorContext.Provider
      value={{
        variant,
        label,
        isHidden,
        setCursor,
        resetCursor, // ✅ exported
        hideCursor,
        showCursor,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
