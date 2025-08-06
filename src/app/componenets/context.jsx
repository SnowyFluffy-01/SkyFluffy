'use client'

import { createContext, useContext, useRef, useState } from "react"
const ToolTipContext = createContext();

export default function ToolTipProvider({children}) {
    const eventRef = useRef(null);
    const deactivatedRef = useRef(false);
    const [showCentered, setShowCentered] = useState();
    const value = {
        eventRef,
        deactivatedRef,
        showCentered,
        setShowCentered
 }
    return (
        <ToolTipContext.Provider value = {value}>
            {children}
        </ToolTipContext.Provider>
    )
}

export function useTooltip() {
  const context = useContext(ToolTipContext);
  return context;
}