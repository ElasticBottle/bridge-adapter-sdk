import type {
  ChainName,
  ChainSourceAndTarget,
} from "@elasticbottle/core-bridge-adapter-sdk";
import React, { createContext, useContext, useState } from "react";
import type { BridgeStep } from "../types/BridgeModal";

const BridgeModalContext = createContext<
  {
    currentBridgeStep: BridgeStep;
    setCurrentBridgeStep: React.Dispatch<React.SetStateAction<BridgeStep>>;
    setSourceChain: React.Dispatch<React.SetStateAction<ChainName>>;
    setTargetChain: React.Dispatch<React.SetStateAction<ChainName>>;
  } & ChainSourceAndTarget
>({
  currentBridgeStep: "MULTI_CHAIN_SELECTION",
  setCurrentBridgeStep: () => ({}),
  sourceChain: "Ethereum",
  setSourceChain: () => ({}),
  targetChain: "Solana",
  setTargetChain: () => ({}),
});
export function BridgeModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentBridgeStep, setCurrentBridgeStep] = useState<BridgeStep>(
    "MULTI_CHAIN_SELECTION"
  );
  const [sourceChain, setSourceChain] = useState<ChainName>("Ethereum");
  const [targetChain, setTargetChain] = useState<ChainName>("Solana");

  return (
    <BridgeModalContext.Provider
      value={{
        currentBridgeStep,
        setCurrentBridgeStep,
        targetChain,
        setTargetChain,
        setSourceChain,
        sourceChain,
      }}
    >
      {children}
    </BridgeModalContext.Provider>
  );
}

export const useBridgeModalContext = () => {
  return useContext(BridgeModalContext);
};
