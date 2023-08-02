import { useState } from "react";
import {
  useBridgeModalStore,
  setRelayerFee,
} from "../../../providers/BridgeModalContext";
import { Toggle } from "../../ui/toggle";
import type { RelayerFeeType } from "../../../types/BridgeModal";
import { cn } from "../../../lib/utils";

export function RelayerFeeWidget() {
  const { active, targetFee, sourceFee }: RelayerFeeType =
    useBridgeModalStore.use.relayerFee();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const [toggleValue, setToggleValue] = useState(active);
  const [error, setError] = useState("");

  const onCheckedChange = (checked: boolean) => {
    setToggleValue(checked);
    setError("");
    try {
      setRelayerFee({ active: checked });
    } catch (e) {
      setError("Please enter a valid number");
    }
  };

  return (
    <div className="bsa-mt-5 bsa-space-y-3 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-flex bsa-items-center bsa-justify-between">
        <p>Relayer Fee</p>{" "}
        <div className="bsa-ml-4">
          <Toggle
            text={toggleValue ? "ON" : "OFF"}
            className={cn(
              "bsa-w-[74px]",
              "bsa-bg-background data-[state=checked]:bsa-bg-[#4F5E6B]"
            )}
            switchClassName={cn(
              "bsa-bg-[#2B2E3C] bsa-h-8 bsa-w-8 data-[state=checked]:bsa-translate-x-[39px]"
            )}
            textClassName={cn(
              "bsa-top-2 bsa-text-sm",
              toggleValue ? "bsa-left-2" : "bsa-right-2"
            )}
            checked={active}
            onCheckedChange={onCheckedChange}
          />
          {error && (
            <div className="bsa-text-xs bsa-text-destructive-foreground">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
