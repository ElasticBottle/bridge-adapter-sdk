import { useAccount, useDisconnect } from "wagmi";
import { Button, buttonVariants } from "../../ui/button";
import {
  clearChain,
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { useSolanaWalletMultiButton } from "../WalletSelection/useSolanaWalletMultiButton";
import { EMPTY_BRIDGE_STEP_TITLE } from "../../../types/BridgeModal";
import { useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { EvmWalletProfile } from "../ProfileDisplays/EvmWalletProfile";
import { SolanaWalletProfile } from "../ProfileDisplays/SolanaWalletProfile";
import { cn } from "../../../lib/utils";

export function MultiChainWalletButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { buttonState, onDisconnect } = useSolanaWalletMultiButton();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const solanaWalletConnected =
    (sourceChain === "Solana" || targetChain === "Solana") &&
    buttonState === "connected";
  const evmWalletConnected =
    (sourceChain === "Ethereum" || targetChain === "Ethereum") && isConnected;

  const disconnectChain = useCallback(
    (whichChain: "Solana" | "Ethereum") => {
      if (sourceChain === whichChain) {
        clearChain("source");
        useBridgeModalStore.setState((state) => {
          state.chain.sourceChain = EMPTY_BRIDGE_STEP_TITLE;
        });
      }
      if (targetChain === whichChain) {
        clearChain("target");
        useBridgeModalStore.setState((state) => {
          state.chain.targetChain = EMPTY_BRIDGE_STEP_TITLE;
        });
      }
      if (whichChain === "Solana" && onDisconnect) {
        onDisconnect();
      }
      if (whichChain === "Ethereum") {
        console.log(whichChain);
        disconnect();
      }
    },
    [disconnect, onDisconnect, sourceChain, targetChain]
  );
  // TODO: add switch to Account Profile screen
  return (
    <>
      {solanaWalletConnected || evmWalletConnected ? (
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" aria-label="Show chains">
              View Chains
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bsa-z-50 bsa-flex bsa-flex-col bsa-gap-y-2 bsa-bg-background bsa-py-2">
            {solanaWalletConnected && (
              <SolanaWalletProfile
                onDisconnect={() => disconnectChain("Solana")}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-md bsa-bg-transparent bsa-px-5 bsa-py-3"
                )}
              />
            )}
            {evmWalletConnected && (
              <EvmWalletProfile
                onDisconnect={() => disconnectChain("Ethereum")}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-md bsa-bg-transparent bsa-px-5 bsa-py-3"
                )}
              />
            )}
            <Button
              variant={"ghost"}
              onClick={() => {
                setCurrentBridgeStep({
                  step: "PROFILE_DETAILS",
                });
              }}
            >
              Account Profile
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <></>
      )}
    </>
  );
}
