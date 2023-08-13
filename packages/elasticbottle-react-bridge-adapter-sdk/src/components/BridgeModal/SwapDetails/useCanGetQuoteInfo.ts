import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useCanGetQuoteInfo() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  return {
    canGetQuoteInfo:
      !!sourceToken.address &&
      !!targetToken.address &&
      sourceToken.selectedAmountInBaseUnits !== "0",
  };
}
