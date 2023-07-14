import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import type { ChainName, ChainSourceAndTarget } from "../types/Chain";
import type { Token } from "../types/Token";
import { getBridgeAdapters } from "../utils/getBridgeAdapters";
import { getSourceAndTargetChain } from "../utils/getSourceAndTargetChain";
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
    this.bridgeAdapters = getBridgeAdapters({
      sourceChain: this.sourceChain,
      targetChain: this.targetChain,
      bridgeAdapterSetting: this.bridgeAdapterSetting,
    });
  }

  setSourceChain(sourceChain: ChainName) {
    this.sourceChain = sourceChain;
  }
  setTargetChain(targetChain: ChainName) {
    this.targetChain = targetChain;
  }

  async getSupportedChains(): Promise<ChainName[]> {
    const chainResponses = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getSupportedChains();
      })
    );

    const chains = chainResponses
      .map((chainResponse) => {
        if (chainResponse.status === "fulfilled") {
          return chainResponse.value;
        } else {
          console.error(
            "Failed to get tokens from bridge",
            chainResponse.reason
          );
        }
      })
      .filter((tokenResponse) => !!tokenResponse)
      .flat() as ChainName[];

    return this.deduplicateChains(chains);
  }
  private deduplicateChains(chains: ChainName[]): ChainName[] {
    const chainSet = new Set<ChainName>();
    chains.map((chain) => {
      chainSet.add(chain);
    });
    return Array.from(chainSet);
  }

  async getSupportedTokens(
    chains?: Partial<ChainSourceAndTarget>
  ): Promise<Token[]> {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: this.sourceChain,
      sdkTargetChain: this.targetChain,
    });

    const tokenResponses = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getSupportedTokens({
          sourceChain: source,
          targetChain: target,
        });
      })
    );

    const tokens = tokenResponses
      .map((tokenResponse) => {
        if (tokenResponse.status === "fulfilled") {
          return tokenResponse.value;
        } else {
          console.error(
            "Failed to get tokens from bridge",
            tokenResponse.reason
          );
        }
      })
      .filter((tokenResponse) => !!tokenResponse)
      .flat() as Token[];

    return this.deduplicateTokens(tokens);
  }

  private deduplicateTokens(tokens: Token[]): Token[] {
    const deduplicatedTokens = tokens.reduce((prev, curr) => {
      prev.set(curr.address, curr);
      return prev;
    }, new Map<string, Token>());
    console.log(
      "Array.from(deduplicatedTokens.values());",
      Array.from(deduplicatedTokens.values())
    );
    return Array.from(deduplicatedTokens.values());
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
