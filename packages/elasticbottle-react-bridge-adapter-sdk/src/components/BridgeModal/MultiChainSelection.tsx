import { ChevronRight } from "lucide-react";
import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../providers/BridgeModalContext";
import type {
  ChainDestType,
  ChainSelectionType,
} from "../../types/BridgeModal";
import { ChainIcon } from "../ui/ChainIcon";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

function ChainSelectButton({
  chainName,
  chainDest,
}: {
  chainName: ChainSelectionType;
  chainDest: ChainDestType;
}) {
  return (
    <Button
      variant={"secondary"}
      className="space-x-2 bsa-w-full bsa-items-center"
      onClick={() => {
        setCurrentBridgeStep({
          step: "SINGLE_CHAIN_SELECTION",
          params: {
            chainDest,
          },
        });
      }}
    >
      <div className="bse-items-center bsa-flex bsa-flex-grow  bsa-space-x-2">
        <ChainIcon chainName={chainName} size={"sm"} />
        <div>{chainName}</div>
      </div>
      <ChevronRight />
    </Button>
  );
}

export function MultiChainSelection() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-2">
      <div className="bsa-text-muted-foreground">Bridge From</div>
      <ChainSelectButton chainName={sourceChain} chainDest="source" />
      <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
        <Separator className="bsa-w-1/3" />
        To
        <Separator className="bsa-w-1/3" />
      </div>
      <ChainSelectButton chainName={targetChain} chainDest="target" />
    </div>
  );
}
