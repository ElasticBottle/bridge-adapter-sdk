import { UserCircle2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKeyLine } from "../../ui/PublicKeyLine";
import { cn } from "../../../lib/utils";
import { SolanaWalletDetail } from "../ProfileDetails/SolanaWalletDetail";
import React, { useCallback, useEffect, useState } from "react";
import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import { ChainIcon } from "../../ui/icons/ChainIcon";
import { ViewAndCopyWallet } from "./ViewAndCopyWallet";
import { SOLANA_BASE_SOLSCAN_URL } from "../../../constants/BaseExplorers";

export function SolanaWalletDetailedProfile({
  className,
}: {
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { connected, disconnect, publicKey } = useWallet();
  const [walletSwitch, setWalletSwitch] = useState(false);

  const switchWallet = useCallback(async () => {
    try {
      await disconnect();
    } finally {
      setWalletSwitch(true);
    }
  }, [disconnect]);

  useEffect(() => {
    if (walletSwitch && !connected) {
      setCurrentBridgeStep({
        step: "WALLET_SELECTION",
        params: {
          chain: "Solana",
        },
      });
    }
  }, [connected, walletSwitch]);

  if (!connected) {
    return (
      <div
        className={cn(
          "bsa-flex bsa-items-center bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
          className
        )}
      >
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }
  return (
    <div className={cn("bsa-flex bsa-flex-col bsa-px-5 bsa-py-3", className)}>
      <SolanaWalletDetail switchWallet={switchWallet} />
      <div className="bsa-text bsa-flex bsa-w-full bsa-items-center bsa-py-5">
        <ChainIcon chainName={"Solana"} size="2xl" />
        <PublicKeyLine
          publicKey={publicKey}
          isName={!publicKey}
          showCopyButton={false}
          textClassName="bsa-text-2xl bsa-font-bold bsa-ml-4"
        />
      </div>
      <ViewAndCopyWallet
        address={publicKey?.toBase58()}
        baseExplorerUrl={SOLANA_BASE_SOLSCAN_URL}
      />
    </div>
  );
}
