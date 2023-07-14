import { Separator } from "@radix-ui/react-separator";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { SwapReviewButton } from "../SwapReview/SwapReviewButton";
import { TokenAndChainWidget } from "./TokenAndChainWidget";

export function MultiChainSelection() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  return (
    <>
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
      <SwapReviewButton />
    </>
  );
}
