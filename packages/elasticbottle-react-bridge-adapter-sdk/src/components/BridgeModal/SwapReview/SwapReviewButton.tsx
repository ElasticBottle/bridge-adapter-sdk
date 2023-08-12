import {
  TOKEN_AMOUNT_ERROR_INDICATOR,
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";
import { useIsWalletConnected } from "../WalletSelection/useIsWalletConnected";

export function SwapReviewButton() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { isWalletConnected } = useIsWalletConnected();

  const canReviewSwap =
    isWalletConnected &&
    !!sourceToken.address &&
    !!targetToken.address &&
    sourceToken.selectedAmountFormatted !== TOKEN_AMOUNT_ERROR_INDICATOR &&
    sourceToken.selectedAmountFormatted !== "" &&
    targetToken.selectedAmountFormatted !== TOKEN_AMOUNT_ERROR_INDICATOR &&
    targetToken.selectedAmountFormatted !== "";
  return (
    <Button
      size={"lg"}
      disabled={!canReviewSwap}
      className="bsa-mt-10 bsa-w-full"
      variant={canReviewSwap ? "default" : "outline"}
      onClick={() => {
        setCurrentBridgeStep({
          step: "SWAP_REVIEW",
        });
      }}
    >
      Review Swap
    </Button>
  );
}
