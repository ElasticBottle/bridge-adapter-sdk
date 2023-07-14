import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";

export function SwapReviewButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  const canReviewSwap =
    sourceChain !== "No chain selected" &&
    targetChain !== "No chain selected" &&
    !!sourceToken.address &&
    !!targetToken.address;
  return (
    <Button
      size={"lg"}
      disabled={!canReviewSwap}
      className="bsa-mt-10 bsa-w-full"
      variant={"secondary"}
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
