import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { useCanGetQuoteInfo } from "./useCanGetQuoteInfo";

export function useQuoteInfo() {
  const sdk = useBridgeModalStore.use.sdk();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { canGetQuoteInfo } = useCanGetQuoteInfo();

  const { data, isInitialLoading, error } = useQuery({
    queryFn: async () => {
      const routeInfo = await sdk.getQuoteInformation(sourceToken, targetToken);
      console.log("routeInfo", routeInfo);
      return routeInfo;
    },
    queryKey: ["bridgeInfo", sourceToken, targetToken],
    enabled: canGetQuoteInfo,
  });
  if (error) {
    throw error;
  }

  return { quoteInfo: data, isLoadingQuoteInfo: isInitialLoading };
}
