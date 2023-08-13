import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useQuoteInfo() {
  const sdk = useBridgeModalStore.use.sdk();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { data, isInitialLoading, error } = useQuery({
    queryFn: async () => {
      const routeInfo = await sdk.getQuoteInformation(sourceToken, targetToken);
      console.log("routeInfo", routeInfo);
      return routeInfo;
    },
    queryKey: ["bridgeInfo", sourceToken, targetToken],
    enabled:
      !!sourceToken.address &&
      !!targetToken.address &&
      sourceToken.selectedAmountInBaseUnits !== "0",
  });
  if (error) {
    throw error;
  }

  return { routeInfo: data, isLoadingRouteInfo: isInitialLoading };
}
