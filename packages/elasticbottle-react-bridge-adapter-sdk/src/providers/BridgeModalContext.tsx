import React, { createContext, useContext, useState } from "react";
import type { BridgeStep } from "../types/BridgeModal";

const BridgeModalContext = createContext<{
  currentBridgeStep: BridgeStep;
  setCurrentBridgeStep: React.Dispatch<React.SetStateAction<BridgeStep>>;
}>({
  currentBridgeStep: "CHAIN_SELECTION",
  setCurrentBridgeStep: () => ({}),
});
export function BridgeModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentBridgeStep, setCurrentBridgeStep] =
    useState<BridgeStep>("CHAIN_SELECTION");

  return (
    <BridgeModalContext.Provider
      value={{
        currentBridgeStep,
        setCurrentBridgeStep,
      }}
    >
      {children}
    </BridgeModalContext.Provider>
  );
}

export const useBridgeModalContext = () => {
  return useContext(BridgeModalContext);
};
