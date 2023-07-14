import { useCallback } from "react";
import { withErrorBoundary } from "react-error-boundary";
import { Button } from "../../ui/button";
import { useSolanaWalletMultiButton } from "./useSolanaWalletMultiButton";

function SolanaWalletConnectionListBase() {
  const {
    buttonState,
    onConnect,
    onDisconnect,
    onSelectWallet,
    wallets,
    walletName,
  } = useSolanaWalletMultiButton();
  let label;
  console.log("walletName", walletName);
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
  console.log("buttonState", buttonState);
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
  return (
    <>
      <Button
        disabled={
          buttonState === "connecting" || buttonState === "disconnecting"
        }
        onClick={onDisconnect}
      >
        {label}
      </Button>
      {wallets.length ? (
        <>
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={() => {
                onSelectWallet(wallet.adapter.name);
              }}
            >
              {wallet.adapter.name}
            </button>
          ))}
        </>
      ) : null}
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
