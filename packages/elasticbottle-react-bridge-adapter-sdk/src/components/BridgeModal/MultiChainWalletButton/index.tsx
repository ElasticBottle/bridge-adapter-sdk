import { useAccount, useDisconnect } from "wagmi";
import { Button, buttonVariants } from "../../ui/button";
import {
  clearChain,
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { EvmWalletProfile } from "../ProfileDisplays/EvmWalletProfile";
import { SolanaWalletProfile } from "../ProfileDisplays/SolanaWalletProfile";
import { cn } from "../../../lib/utils";
import { useMultiChainWalletInfo } from "./useMultiChainWalletInfo";

export function MultiChainWalletButton() {
  const { solanaWalletConnected, evmWalletConnected, disconnectChain } =
    useMultiChainWalletInfo();
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