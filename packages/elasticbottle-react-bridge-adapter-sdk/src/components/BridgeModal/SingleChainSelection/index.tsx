import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";
import { SupportedChainNames } from "@elasticbottle/core-bridge-adapter-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { hasChainDest, parseForErrorString } from "../../../lib/utils";
import {
  setChain,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import type { ChainSelectionType } from "../../../types/BridgeModal";
import { Button } from "../../ui/button";
import { ChainIcon } from "../../ui/icons/ChainIcon";
import { Separator } from "../../ui/separator";

export function SingleChainSelection() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  const { connectors: availableEvmWallets, connectAsync: connectEvmWallet } =
    useConnect();
  const { isConnected: isEvmWalletConnected } = useAccount();
  const {
    connected: isSolanaWalletConnected,
    wallets: availableSolanaWallets,
  } = useWallet();
  const [error, setError] = useState("");
  const [connectingToChain, setConnectingToChain] = useState<
    ChainSelectionType | undefined
  >(undefined);

  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;

  const onChooseChain = (chainName: ChainName) => {
    return () => {
      setConnectingToChain(chainName);
      setChain({
        availableEvmWallets,
        availableSolanaWallets,
        chainDestination: chainDest,
        connectEvmWallet,
        isEvmWalletConnected,
        isSolanaWalletConnected,
        newChain: chainName,
      })
        .catch((e) => {
          const parsedErrorString = parseForErrorString(e);
          setError(parsedErrorString);
        })
        .finally(() => {
          setConnectingToChain(undefined);
        });
    };
  };

  useEffect(() => {
    if ("autoConnectToChain" in params && params.autoConnectToChain) {
      console.log("params.autoConnectToChain", params.autoConnectToChain);
      onChooseChain(params.autoConnectToChain)();
    }
  }, []);

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-3">
      {SupportedChainNames.map((chainName) => {
        return (
          <React.Fragment key={chainName}>
            <Button
              variant={"ghost"}
              disabled={!!connectingToChain}
              isLoading={connectingToChain === chainName}
              loadingText={`Connecting to ${chainName}`}
              size={"lg"}
              className="bsa-flex bsa-w-full bsa-items-center bsa-justify-start bsa-space-x-3 bsa-py-5"
              onClick={onChooseChain(chainName)}
            >
              <ChainIcon chainName={chainName} size={"md"} />
              <div className="text-lg">{chainName}</div>
            </Button>
            <Separator className="bsa-w-full bsa-bg-muted" decorative={true} />
          </React.Fragment>
        );
      })}
      {error && (
        <div className="bsa-text-sm bsa-text-muted-foreground">{error}</div>
      )}
    </div>
  );
}
