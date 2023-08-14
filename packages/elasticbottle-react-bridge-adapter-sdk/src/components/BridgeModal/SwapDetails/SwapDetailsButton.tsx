import { ChevronRight } from "lucide-react";
import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";
import { useCanGetSwapInfo } from "./useCanGetSwapInfo";
import { useSwapInfo } from "./useSwapInfo";

export function SwapDetailButton() {
  const { isLoadingSwapInfo, swapInfo } = useSwapInfo();
  console.log("isLoadingSwapInfo, swapInfo", isLoadingSwapInfo, swapInfo);
  const { canGetSwapInfo } = useCanGetSwapInfo();
  console.log("canGetSwapInfo", canGetSwapInfo);
  let ButtonBody: string | JSX.Element = "No Swap Route Chosen";
  if (canGetSwapInfo && isLoadingSwapInfo) {
    ButtonBody = "Fetching Swap Route Details";
  } else if (canGetSwapInfo && !isLoadingSwapInfo && swapInfo) {
    ButtonBody = (
      <>
        <div>View Swap Route Details</div>
        <ChevronRight />
      </>
    );
  }
  return (
    <Button
      size={"lg"}
      disabled={!canGetSwapInfo}
      isLoading={isLoadingSwapInfo}
      className="bsa-mt-10 bsa-w-full bsa-justify-between"
      variant={canGetSwapInfo ? "outline" : "ghost"}
      onClick={() => {
        setCurrentBridgeStep({
          step: "SWAP_DETAILS",
        });
      }}
    >
      {ButtonBody}
    </Button>
  );
}
