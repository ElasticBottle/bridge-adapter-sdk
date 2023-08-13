import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";
import { useCanGetQuoteInfo } from "./useCanGetQuoteInfo";
import { useQuoteInfo } from "./useQuoteInfo";

export function WalletSelectionButton() {
  const { isLoadingQuoteInfo, quoteInfo } = useQuoteInfo();
  const { canGetQuoteInfo } = useCanGetQuoteInfo();
  return (
    <Button
      size={"lg"}
      disabled={!canGetQuoteInfo}
      className="bsa-mt-10 bsa-w-full"
      variant={canGetQuoteInfo ? "outline" : "ghost"}
      onClick={() => {
        setCurrentBridgeStep({
          step: "SWAP_DETAILS",
        });
      }}
    >
      {canGetQuoteInfo ? "Choose route" : "Route Details"}
    </Button>
  );
}
