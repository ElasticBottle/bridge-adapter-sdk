import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useRouteInfos() {
  const sdk = useBridgeModalStore.use.sdk();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { data, isInitialLoading, error } = useQuery({
    queryFn: async () => {
      const routeInfo = await sdk.getRouteInformation(sourceToken, targetToken);
      console.log("routeInfo", routeInfo);
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

  return { routeInfos: data, isLoadingRouteInfos: isInitialLoading };
}
