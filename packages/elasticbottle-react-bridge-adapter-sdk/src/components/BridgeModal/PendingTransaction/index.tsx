import type { BridgeStatus } from "@elasticbottle/core-bridge-adapter-sdk";
import { useCallback, useState } from "react";
import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import { Spinner } from "../../ui/spinner";
import { useSubmitAndTrackTransaction } from "./useSubmitAndTrackTransaction";

export function PendingTransaction() {
  const onError = useCallback((e: Error) => {
    console.error("Something went wrong during swap", e);
    setCurrentBridgeStep({
      step: "SWAP_REVIEW",
    });
  }, []);
  const [currentStatus, setCurrentStatus] = useState<BridgeStatus | undefined>(
    undefined
  );
  const onStatusUpdate = useCallback((args: BridgeStatus) => {
    setCurrentStatus(args);
  }, []);

  useSubmitAndTrackTransaction({
    onError,
    onStatusUpdate,
  });

  return (
    <div className="bsa-flex bsa-h-80 bsa-w-full bsa-flex-col bsa-items-center bsa-justify-center bsa-space-y-5">
      <Spinner variant={"default"} className="bsa-h-20 bsa-w-20" />
      <div>{currentStatus?.information}</div>
    </div>
  );
}
