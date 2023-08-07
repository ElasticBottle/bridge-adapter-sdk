import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";

export function WalletSelectionButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  const canConnectWallet =
    sourceChain !== "Select a chain" &&
    targetChain !== "Select a chain" &&
    !!sourceToken.address &&
    !!targetToken.address;

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
      }}
    >
      Connect Wallet
    </Button>
  );
}
