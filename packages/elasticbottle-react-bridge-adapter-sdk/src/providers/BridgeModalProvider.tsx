import type { BridgeAdapterSdkArgs } from "@elasticbottle/core-bridge-adapter-sdk";
import { useEffect } from "react";
import { setBridgeAdapterSdkSettings } from "./BridgeModalContext";

export function BridgeModalProvider({
  children,
  bridgeAdapterSetting,
  sourceChain,
  targetChain,
}: {
  children: React.ReactNode;
} & BridgeAdapterSdkArgs) {
  const bridgeAdapterSettingString = bridgeAdapterSetting
    ? JSON.stringify(bridgeAdapterSetting)
    : "";

  useEffect(() => {
    setBridgeAdapterSdkSettings({
      bridgeAdapterSetting: bridgeAdapterSettingString
        ? (JSON.parse(
            bridgeAdapterSettingString
          ) as BridgeAdapterSdkArgs["bridgeAdapterSetting"])
        : undefined,
      sourceChain,
      targetChain,
    });
  }, [bridgeAdapterSettingString, sourceChain, targetChain]);

  return <>{children}</>;
}
