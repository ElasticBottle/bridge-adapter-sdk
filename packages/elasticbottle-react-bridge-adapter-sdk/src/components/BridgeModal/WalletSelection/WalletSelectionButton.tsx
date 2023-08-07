import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";
import { useCanConnectWallet } from "./useCanConnectWallet";

export function WalletSelectionButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const canConnectWallet = useCanConnectWallet();

  return (
    <Button
      size={"lg"}
      disabled={!canConnectWallet}
      className="bsa-mt-10 bsa-w-full"
      variant={canConnectWallet ? "default" : "outline"}
      onClick={() => {
        if (
          sourceChain === "Select a chain" ||
          targetChain === "Select a chain"
        ) {
          return;
        }
        if (
          (sourceChain === "Solana" && targetChain === "Solana") ||
          (sourceChain !== "Solana" && targetChain !== "Solana")
        ) {
          // Both EVM or both Solana
          setCurrentBridgeStep({
            step: "WALLET_SELECTION",
            params: {
              chain: targetChain,
              chainDest: "target",
              onSuccess() {
                setCurrentBridgeStep({
                  step: "MULTI_CHAIN_SELECTION",
                });
              },
            },
          });
        } else {
          setCurrentBridgeStep({
            step: "WALLET_SELECTION",
            params: {
              chain: sourceChain,
              chainDest: "source",
              onSuccess() {
                setCurrentBridgeStep({
                  step: "WALLET_SELECTION",
                  params: {
                    chain: targetChain,
                    chainDest: "target",
                    onSuccess() {
                      setCurrentBridgeStep({
                        step: "MULTI_CHAIN_SELECTION",
                      });
                    },
                  },
                });
              },
            },
          });
        }
      }}
    >
      {canConnectWallet ? "Connect Wallet" : "Select tokens"}
    </Button>
  );
}
