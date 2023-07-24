import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { PendingTransactionButton } from "../PendingTransaction/PendingTransactionButton";

export function SwapReview() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  return (
    <div className="bsa-h-full bsa-flex-col bsa-justify-between">
      <Card>
        <CardHeader className="bsa-text-sm">Review Details</CardHeader>
        <CardContent>
          <div className="bsa-space-y-6">
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">Paying Token</div>
              <div>
                {sourceToken.selectedAmountFormatted} {sourceToken.symbol} (
                {sourceToken.chain})
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">Receiving Token</div>
              <div>
                {targetToken.selectedAmountFormatted} {targetToken.symbol} (
                {targetToken.chain})
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">Price Impact</div>
              <div>0.00%</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <PendingTransactionButton />
    </div>
  );
}
