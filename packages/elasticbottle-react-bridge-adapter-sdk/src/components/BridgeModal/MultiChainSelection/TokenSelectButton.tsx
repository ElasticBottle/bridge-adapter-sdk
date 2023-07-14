import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import type {
  ChainDestType,
  ChainSelectionType,
} from "../../../types/BridgeModal";
import { Button } from "../../ui/button";
import { ChainIcon } from "../../ui/icons/ChainIcon";

export function TokenSelectButton({
  chainName,
  chainDest,
  className,
}: {
  chainName: ChainSelectionType;
  chainDest: ChainDestType;
  className?: string;
}) {
  return (
    <Button
      variant={"secondary"}
      size={"lg"}
      className={cn("space-x-2 bsa-w-full", className)}
      onClick={() => {
        setCurrentBridgeStep({
          step: "TOKEN_SELECTION",
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
