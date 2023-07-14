import { Separator } from "@radix-ui/react-separator";
import type {
  ChainDestType,
  ChainSelectionType,
} from "../../../types/BridgeModal";
import { Input } from "../../ui/input";
import { ChainSelectButton } from "../SingleChainSelection/SingleChainSelectionButton";
import { TokenSelectionButton } from "../TokenSelection/TokenSelectionButton";

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
        <TokenSelectionButton
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
