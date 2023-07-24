import type { ChainDestType } from "@elasticbottle/core-bridge-adapter-sdk";
import { useEffect, useState } from "react";
import {
  TOKEN_AMOUNT_ERROR_INDICATOR,
  setTokenAmount,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import type { ChainSelectionType } from "../../../types/BridgeModal";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { ChainSelectButton } from "../SingleChainSelection/SingleChainSelectionButton";
import { TokenSelectionButton } from "../TokenSelection/TokenSelectionButton";

export function TokenAndChainWidget({
  chainName,
  chainDest,
}: {
  chainDest: ChainDestType;
  chainName: ChainSelectionType;
}) {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");
    try {
      setTokenAmount(value, chainDest);
    } catch (e) {
      setError("Please enter a valid number");
    }
  };

  useEffect(() => {
    if (
      tokenOfInterest.selectedAmountFormatted !== TOKEN_AMOUNT_ERROR_INDICATOR
    ) {
      setInputValue(tokenOfInterest.selectedAmountFormatted);
      setError("");
    }
  }, [tokenOfInterest.selectedAmountFormatted]);

  if (chainName === "Select a chain") {
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
      <div className="bsa-flex bsa-items-center bsa-justify-between bsa-space-x-3 bsa-px-2">
        <div>
          <Input
            placeholder="0.00"
            className="bsa-border-none bsa-text-xl focus-visible:bsa-ring-0"
            value={
              tokenOfInterest.selectedAmountFormatted ===
              TOKEN_AMOUNT_ERROR_INDICATOR
                ? inputValue
                : tokenOfInterest.selectedAmountFormatted
            }
            onChange={onInputChange}
          />
          {error && (
            <div className="bsa-text-xs bsa-text-destructive-foreground">
              {error}
            </div>
          )}
        </div>
        <Separator orientation="vertical" className="bsa-h-5" />
        <div className="bsa-min-w-max bsa-text-muted-foreground">0 balance</div>
      </div>
    </div>
  );
}
