import type { AbstractBridgeAdapter } from "../lib/BridgeAdapter/AbstractBridgeAdapter";
import { WormholeBridgeAdapter } from "../lib/BridgeAdapter/WormholeBridgeAdapter";
import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import type { ChainName } from "../types/Chain";

export function getBridgeAdapters(
  sourceChain: ChainName,
  targetChain: ChainName,
  bridgeAdapterSetting?: BridgeAdapterSetting
) {
  const allowedBridgeAdapters: { [bridge: string]: AbstractBridgeAdapter } = {
    wormhole: new WormholeBridgeAdapter({ sourceChain, targetChain }),
  };
  if (!bridgeAdapterSetting) {
    return Object.values(allowedBridgeAdapters);
  }

  if ("allow" in bridgeAdapterSetting) {
    const result = [];
    for (const bridgeAdapter of bridgeAdapterSetting.allow) {
      result.push(allowedBridgeAdapters[bridgeAdapter]);
    }
    return result.filter((x) => !!x);
  } else if ("deny" in bridgeAdapterSetting) {
    for (const bridgeAdapter of bridgeAdapterSetting.deny) {
      delete allowedBridgeAdapters[bridgeAdapter];
    }
    return Object.values(allowedBridgeAdapters);
  }
  throw new Error("Invalid bridge adapter setting");
}
