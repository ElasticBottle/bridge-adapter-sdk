import { ChevronLeft, Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  clearChain,
  goBackOneStep,
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../providers/BridgeModalContext";
import { BridgeStepToTitle } from "../../types/BridgeModal";
import { Button } from "../ui/button";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useSolanaWalletMultiButton } from "./WalletSelection/useSolanaWalletMultiButton";

export function BridgeHeader({ title }: { title?: string }) {
  const currentBridgeStep = useBridgeModalStore.use.currentBridgeStep();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { buttonState, onDisconnect } = useSolanaWalletMultiButton();

  const disconnectSolana =
    (sourceChain === "Solana" || targetChain === "Solana") &&
    buttonState === "connected";

  let HeaderBody = (
    <DialogTitle
      className={cn({
        "flex items-center text-xl": true,
        "justify-between": !!title,
        "justify-end": !title,
      })}
    >
      <div className="bsa-pointer-events-none">{title}</div>
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
      <Button
        size={"icon"}
        variant={"secondary"}
        className="p-2"
        aria-label="swap settings"
        onClick={() => {
          setCurrentBridgeStep({
            step: "SWAP_SETTINGS",
          });
        }}
      >
        <Settings />
      </Button>
    </DialogTitle>
  );
  if (currentBridgeStep !== "MULTI_CHAIN_SELECTION") {
    HeaderBody = (
      <DialogTitle
        className={cn({
          "flex items-center text-xl": true,
          "justify-between": !!title,
          "justify-end": !title,
        })}
      >
        <Button
          size={"icon"}
          variant={"secondary"}
          className="p-2"
          aria-label="Go Back"
          onClick={() => {
            goBackOneStep();
          }}
        >
          <ChevronLeft />
        </Button>
        <div className="bsa-pointer-events-none -bsa-ml-10 bsa-flex bsa-w-full bsa-flex-grow bsa-justify-center">
          {BridgeStepToTitle[currentBridgeStep]}
        </div>
      </DialogTitle>
    );
  }

  return (
    <DialogHeader aria-description="Modal to swap assets between various blockchains">
      {HeaderBody}
    </DialogHeader>
  );
}
