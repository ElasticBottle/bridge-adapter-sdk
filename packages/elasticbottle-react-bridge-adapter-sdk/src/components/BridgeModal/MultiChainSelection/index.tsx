import { Separator } from "@radix-ui/react-separator";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import type {
  ChainDestType,
  ChainSelectionType,
} from "../../../types/BridgeModal";
import { Input } from "../../ui/input";
import { ChainSelectButton } from "./ChainSelectButton";
import { TokenSelectButton } from "./TokenSelectButton";

export function TokenAndChainWidget({
  chainName,
  chainDest,
}: {
  chainDest: ChainDestType;
  chainName: ChainSelectionType;
}) {
  if (chainName === "No chain selected") {
    return <ChainSelectButton chainDest={chainDest} chainName={chainName} />;
  }

  return (
    <div className="bsa-space-y-3 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-flex bsa-justify-between">
        <TokenSelectButton
          chainDest={chainDest}
          className="bsa-w-min bsa-px-2"
        />
        <ChainSelectButton
          chainDest={chainDest}
          chainName={chainName}
          className="bsa-w-min bsa-px-2"
        />
      </div>
      <div className="bsa-flex bsa-items-center bsa-justify-between bsa-space-x-3">
        <Input
          placeholder="0.00"
          className="bsa-border-none bsa-text-xl focus-visible:bsa-ring-0"
        />
        <Separator
          orientation="vertical"
          className="bsa-h-5 bsa-w-[1px] bsa-bg-muted-foreground"
        />
        <div className="bsa-min-w-max bsa-text-muted-foreground">0 balance</div>
      </div>
    </div>
  );
}

export function MultiChainSelection() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      <div className="bsa-text-muted-foreground">Bridge From</div>
      <TokenAndChainWidget chainName={sourceChain} chainDest="source" />
      <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
        <Separator
          className="bsa-h-[1px] bsa-w-1/3 bsa-bg-muted-foreground"
          decorative={true}
        />
        To
        <Separator
          className="bsa-h-[1px] bsa-w-1/3 bsa-bg-muted-foreground"
          decorative={true}
        />
      </div>
      <TokenAndChainWidget chainName={targetChain} chainDest="target" />
    </div>
  );
}
