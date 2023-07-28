import { useAccount, useDisconnect } from "wagmi";
import { Button } from "../../ui/button";
import {
  clearChain,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { useSolanaWalletMultiButton } from "../WalletSelection/useSolanaWalletMultiButton";

export function MultiChainWalletButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { buttonState, onDisconnect } = useSolanaWalletMultiButton();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const disconnectSolana =
    (sourceChain === "Solana" || targetChain === "Solana") &&
    buttonState === "connected";
  const disconnectEvm =
    (sourceChain === "Ethereum" || targetChain === "Ethereum") && isConnected;
  // TODO: add dropdown list & disconnect individually / switch to Account Profile screen
  return (
    <>
      {disconnectSolana && (
        <Button
          variant="ghost"
          onClick={() => {
            // TODO: refactor to own callback
            if (onDisconnect) {
              if (sourceChain === "Solana") {
                clearChain("source");
                useBridgeModalStore.setState((state) => {
                  state.chain.sourceChain = "Select a chain";
                });
              }
              if (targetChain === "Solana") {
                clearChain("target");
                useBridgeModalStore.setState((state) => {
                  state.chain.targetChain = "Select a chain";
                });
              }
              onDisconnect();
            }
          }}
        >
          Disconnect
        </Button>
      )}
      {disconnectEvm && (
        <Button
          variant="ghost"
          onClick={() => {
            // TODO: refactor to own callback
            if (sourceChain === "Ethereum") {
              clearChain("source");
              useBridgeModalStore.setState((state) => {
                state.chain.sourceChain = "Select a chain";
              });
            }
            if (targetChain === "Ethereum") {
              clearChain("target");
              useBridgeModalStore.setState((state) => {
                state.chain.targetChain = "Select a chain";
              });
            }
            disconnect();
          }}
        >
          Disconnect EVM
        </Button>
      )}
    </>
  );
}
