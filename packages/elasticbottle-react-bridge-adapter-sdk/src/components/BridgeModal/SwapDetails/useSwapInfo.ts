import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { isSwapInfoEqual } from "../../../lib/utils";
import {
  setSwapInformation,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { useCanGetSwapInfo } from "./useCanGetSwapInfo";

export function useSwapInfo() {
  const sdk = useBridgeModalStore.use.sdk();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const currentSwapInformation = useBridgeModalStore.use.swapInformation?.();
  const { canGetSwapInfo } = useCanGetSwapInfo();

  const { data, isLoading, error } = useQuery({
    queryFn: async () => {
      const routeInfo = await sdk.getQuoteInformation(sourceToken, targetToken);
      console.log("routeInfo", routeInfo);
      return routeInfo;
    },
    queryKey: ["bridgeInfo", sourceToken, targetToken],
    enabled: canGetSwapInfo,
  });

  useEffect(() => {
    if (data && !currentSwapInformation) {
      setSwapInformation(data[0]);
    }
    if (data && currentSwapInformation) {
      const newSwapInfo = data[0];
      if (isSwapInfoEqual(newSwapInfo, currentSwapInformation)) {
        setSwapInformation(newSwapInfo);
      }
    }
  }, [currentSwapInformation, data]);

  if (error) {
    throw error;
  }

  return { swapInfo: data, isLoadingSwapInfo: isLoading };
}