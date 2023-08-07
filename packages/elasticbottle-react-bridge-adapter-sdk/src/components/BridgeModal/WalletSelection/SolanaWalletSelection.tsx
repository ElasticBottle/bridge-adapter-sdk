import { useCallback, useEffect } from "react";
import { withErrorBoundary } from "react-error-boundary";
import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import type { BridgeStepParams } from "../../../types/BridgeModal";
import { Button } from "../../ui/button";
import { WalletAdapterIcon } from "../../ui/icons/WalletAdapterIcon";
import { useSolanaWalletMultiButton } from "./useSolanaWalletMultiButton";

function SolanaWalletConnectionListBase() {
  const { buttonState, onConnect, onDisconnect, onSelectWallet, wallets } =
    useSolanaWalletMultiButton();
  const { chain, chainDest } =
    useBridgeModalStore.use.currentBridgeStepParams() as BridgeStepParams<"WALLET_SELECTION">;
  let label;
  switch (buttonState) {
    case "connected":
      label = "Disconnect";
      break;
    case "connecting":
      label = "Connecting";
      break;
    case "disconnecting":
      label = "Disconnecting";
      break;
    case "has-wallet":
      label = "Connect";
      break;
    case "no-wallet":
      label = "Select Wallet";
      break;
  }

  const handleClick = useCallback(() => {
    console.log("buttonState", buttonState);
    switch (buttonState) {
      case "connected":
        return onDisconnect;
      case "connecting":
      case "disconnecting":
        break;
      case "has-wallet":
        return onConnect;
      case "no-wallet":
        return onSelectWallet;
    }
  }, [buttonState, onDisconnect, onConnect, onSelectWallet]);

  useEffect(() => {
    switch (buttonState) {
      case "connected":
        {
          console.log("connected");
          if (chainDest) {
            const chainParam =
              chainDest === "source" ? "sourceChain" : "targetChain";
            useBridgeModalStore.setState((state) => {
              state.chain[chainParam] = chain;
            });
          }
          setCurrentBridgeStep({
            step: "MULTI_CHAIN_SELECTION",
          });
        }
        break;
      case "connecting":
      case "disconnecting":
        console.log(buttonState);
        break;
      case "has-wallet":
        console.log("test");
        onConnect && onConnect();
        break;
    }
  }, [buttonState, chain, chainDest, onConnect]);

  return (
    <>
      {wallets.length ? (
        <ul>
          {wallets.map((wallet) => (
            <li key={wallet.adapter.name} className="bsa-mb-2">
              <Button
                onClick={() => {
                  onSelectWallet(wallet.adapter.name);
                }}
                variant="outline"
                className="bsa-flex bsa-w-full bsa-items-center bsa-justify-between bsa-rounded-xl bsa-py-6"
              >
                {wallet.adapter.name}
                <WalletAdapterIcon
                  wallet={wallet}
                  className="bsa-max-h-[2.5rem] bsa-px-2 bsa-py-[0.3125rem]"
                />
              </Button>
            </li>
          ))}
          <li>
            <Button
              disabled={
                buttonState === "connecting" || buttonState === "disconnecting"
              }
              onClick={handleClick}
            >
              {label}
            </Button>
          </li>
        </ul>
      ) : (
        <Button
          disabled={
            buttonState === "connecting" || buttonState === "disconnecting"
          }
          onClick={onDisconnect}
        >
          {label}
        </Button>
      )}
    </>
  );
}

// TODO: Figure out a way to detect this
export const SolanaWalletConnectionList = withErrorBoundary(
  SolanaWalletConnectionListBase,
  {
    fallback: (
      <>
        <div>Error initializing wallet connection list.</div>
        <div>
          Did you wrap the{" "}
          <pre className="bsa-inline-block">{"<BridgeModal/>"}</pre> component
          in a{" "}
          <pre className="bsa-inline-block">{"<SolanaWalletProvider/>"}</pre>?
        </div>
      </>
    ),
    onError(errors) {
      console.error("Original Error", errors);
    },
  }
);
