import React, { useEffect } from "react";
import { useBridgeModalStore } from "../../providers/BridgeModalContext";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { MultiChainSelection } from "./MultiChainSelection";
import { PendingTransaction } from "./PendingTransaction";
import { SwapDetails } from "./SwapDetails";
import { SwapReview } from "./SwapReview";
import { SwapSettings } from "./SwapSettings";
import { TokenSelection } from "./TokenSelection";
import { WalletSelection } from "./WalletSelection";

import "../../style/global.css";
import { BridgeHeader } from "./BridgeHeader";
import { SingleChainSelection } from "./SingleChainSelection";

type BridgeModalProps = {
  children: React.ReactNode;
  customization?: Partial<{ modalTitle: string; theme: "dark" | "light" }>;
};

export function BridgeModal({ children, customization }: BridgeModalProps) {
  const currentBridgeStep = useBridgeModalStore.use.currentBridgeStep();

  useEffect(() => {
    if (customization?.theme === "dark") {
      document.body.classList.add("bsa-dark");
    } else {
      document.body.classList.remove("bsa-dark");
    }
  }, [customization?.theme]);

  let body: JSX.Element;
  switch (currentBridgeStep) {
    case "MULTI_CHAIN_SELECTION": {
      body = <MultiChainSelection />;
      break;
    }
    case "SINGLE_CHAIN_SELECTION": {
      body = <SingleChainSelection />;
      break;
    }

    case "PENDING_TRANSACTION": {
      body = <PendingTransaction />;
      break;
    }
    case "SWAP_DETAILS": {
      body = <SwapDetails />;
      break;
    }
    case "SWAP_REVIEW": {
      body = <SwapReview />;
      break;
    }
    case "SWAP_SETTINGS": {
      body = <SwapSettings />;
      break;
    }
    case "TOKEN_SELECTION": {
      body = <TokenSelection />;
      break;
    }
    case "WALLET_SELECTION": {
      body = <WalletSelection />;
      break;
    }
    default:
      throw new Error(`BAD STATE: Unknown bridge step`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="bsa-h-[600px] bsa-max-w-md bsa-border-border bsa-bg-background bsa-text-foreground"
        style={{
          fontFeatureSettings: '"rlig" 1, "calt" 1',
        }}
      >
        <BridgeHeader title={customization?.modalTitle} />
        <div className="bsa-my-4">{body}</div>
      </DialogContent>
    </Dialog>
  );
}
