import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";
import { ChevronRight } from "lucide-react";
import { useBridgeModalContext } from "../../providers/BridgeModalContext";
import { ChainIcon } from "../ui/ChainIcon";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

function ChainSelectButton({ chainName }: { chainName: ChainName }) {
  return (
    <Button
      variant={"secondary"}
      className="space-x-2 bsa-w-full bsa-items-center"
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
  const { sourceChain, targetChain } = useBridgeModalContext();
  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-2">
      <div className="bsa-text-muted-foreground">Bridge From</div>
      <ChainSelectButton chainName={sourceChain} />
      <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
        <Separator className="bsa-w-1/3" />
        To
        <Separator className="bsa-w-1/3" />
      </div>
      <ChainSelectButton chainName={targetChain} />
    </div>
  );
}
