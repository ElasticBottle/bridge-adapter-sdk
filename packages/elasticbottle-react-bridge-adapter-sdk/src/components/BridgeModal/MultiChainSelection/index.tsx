import { Separator } from "@radix-ui/react-separator";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { SwapReviewButton } from "../SwapReview/SwapReviewButton";
import { WalletSelectionButton } from "../WalletSelection/WalletSelectionButton";
import { TokenAndChainWidget } from "./TokenAndChainWidget";

export function MultiChainSelection() {
  const { sourceAccount, targetAccount } = useBridgeModalStore.use.accounts();
  return (
    <>
      <div className="bsa-flex bsa-flex-col bsa-space-y-4">
        <div className="bsa-text-muted-foreground">Bridge From</div>
        <TokenAndChainWidget chainDest="source" />
        <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
          <Separator
            className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
            decorative={true}
          />
          To
          <Separator
            className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
            decorative={true}
          />
        </div>
        <TokenAndChainWidget chainDest="target" />
      </div>
      {sourceAccount && targetAccount ? (
        <SwapReviewButton />
      ) : (
        <WalletSelectionButton />
      )}
    </>
  );
}
