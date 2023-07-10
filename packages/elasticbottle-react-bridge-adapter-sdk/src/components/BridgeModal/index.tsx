import React, { useEffect } from "react";
import {
  BridgeModalProvider,
  useBridgeModalContext,
} from "../../providers/BridgeModalContext";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { AccountSettings } from "./AccountSettings";
import { ChainSelection } from "./ChainSelection";
import { PendingTransaction } from "./PendingTransaction";
import { SwapDetails } from "./SwapDetails";
import { SwapReview } from "./SwapReview";
import { SwapSettings } from "./SwapSettings";
import { TokenSelection } from "./TokenSelection";
import { WalletSelection } from "./WalletSelection";

import "../../style/global.css";
import { BridgeHeader } from "./BridgeHeader";

type BridgeModalProps = {
  children: React.ReactNode;
  customization?: Partial<{ modalTitle: string; theme: "dark" | "light" }>;
};

function BridgeModalInternal({ children, customization }: BridgeModalProps) {
  const { currentBridgeStep } = useBridgeModalContext();
  useEffect(() => {
    if (customization?.theme === "dark") {
      document.body.classList.add("bsa-dark");
    } else {
      document.body.classList.remove("bsa-dark");
    }
  }, [customization?.theme]);

  let body = <ChainSelection />;
  switch (currentBridgeStep) {
    case "CHAIN_SELECTION": {
      body = <ChainSelection />;
      break;
    }
    case "ACCOUNT_SETTINGS": {
      body = <AccountSettings />;
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
      <DialogContent>
        <BridgeHeader title={customization?.modalTitle} />
        {body}
      </DialogContent>
    </Dialog>
  );
}

export function BridgeModal({ children, customization }: BridgeModalProps) {
  return (
    <BridgeModalProvider>
      <BridgeModalInternal customization={customization}>
        {children}
      </BridgeModalInternal>
    </BridgeModalProvider>
  );
}
