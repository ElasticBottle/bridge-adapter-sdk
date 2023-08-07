import type { ChainDestType } from "@elasticbottle/core-bridge-adapter-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import {
  TOKEN_AMOUNT_ERROR_INDICATOR,
  setTokenAmount,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Input } from "../../ui/input";
import { ChainAndTokenSelectButton } from "../ChainAndTokenSelect/ChainAndTokenSelectButton";
import { useTokenBalance } from "./useTokenBalance";

export function TokenAndChainWidget({
  chainDest,
}: {
  chainDest: ChainDestType;
}) {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;

  const { error: errorGettingTokenBalance, tokenBalance } =
    useTokenBalance(tokenOfInterest);
  if (errorGettingTokenBalance) {
    throw errorGettingTokenBalance;
  }
  const { data: walletClient } = useWalletClient();
  const { publicKey } = useWallet();

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

  return (
    <div className="bsa-space-x-3 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-flex bsa-justify-between">
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
            disabled={!publicKey || !walletClient}
          />
          {error && (
            <div className="bsa-text-xs bsa-text-destructive-foreground">
              {error}
            </div>
          )}
        </div>
        <div className="bsa-flex bsa-flex-col bsa-items-end bsa-space-y-2">
          <ChainAndTokenSelectButton
            chainDest={chainDest}
            className="bsa-px-2"
          />
          <div className="bsa-min-w-max bsa-text-muted-foreground">
            {tokenBalance ?? "0"} {tokenOfInterest.symbol || "Balance"}
          </div>
        </div>
      </div>
    </div>
  );
}
