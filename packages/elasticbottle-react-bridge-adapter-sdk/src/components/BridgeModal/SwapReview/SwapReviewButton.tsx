import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";

export function SwapReviewButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  const canReviewSwap =
    sourceChain !== "Select a chain" &&
    targetChain !== "Select a chain" &&
    !!sourceToken.address &&
    !!targetToken.address;
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
