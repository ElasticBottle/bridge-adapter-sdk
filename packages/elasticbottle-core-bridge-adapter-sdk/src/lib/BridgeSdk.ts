import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import type { ChainName, ChainSourceAndTarget } from "../types/Chain";
import type { Token } from "../types/Token";
import { getBridgeAdapters } from "../utils/getBridgeAdapters";
import type { AbstractBridgeAdapter } from "./BridgeAdapter/AbstractBridgeAdapter";

export class BridgeAdapterSdk {
  sourceChain: ChainName | undefined;
  targetChain: ChainName | undefined;
  bridgeAdapterSetting: BridgeAdapterSetting | undefined;
  bridgeAdapters: AbstractBridgeAdapter[] = [];
  constructor({
    sourceChain,
    targetChain,
    bridgeAdapterSetting,
  }: Partial<ChainSourceAndTarget> & {
    bridgeAdapterSetting?: BridgeAdapterSetting;
  }) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
    this.bridgeAdapterSetting = bridgeAdapterSetting;
    if (this.sourceChain && this.targetChain) {
      this.bridgeAdapters = getBridgeAdapters(
        this.sourceChain,
        this.targetChain,
        this.bridgeAdapterSetting
      );
    }
  }

  setSourceChain(sourceChain: ChainName) {
    this.sourceChain = sourceChain;
  }
  setTargetChain(targetChain: ChainName) {
    this.targetChain = targetChain;
  }

  static async getSupportedChains(): Promise<ChainName[]> {
    return Promise.resolve([]);
  }

  async getSupportedTokens(
    args: typeof this.sourceChain extends ChainName ? number : string
  ): Promise<Token[]> {
    return Promise.resolve([]);
  }

  async bridge(args: {
    tokenToBridge: { tokenInfo: Token; amountInBaseUnits: string };
    sourceAccount: string;
    sourceAccountSubmitTransaction: (transaction: string) => Promise<void>;
    targetAccount: string;
    targetAccountSubmitTransaction: (transaction: string) => Promise<void>;
    onStateUpdate: (args: {
      progress: number;
      state: string;
    }) => void | Promise<void>;
    onError: (error: Error) => void | Promise<void>;
  }) {
    return Promise.resolve();
  }
}
