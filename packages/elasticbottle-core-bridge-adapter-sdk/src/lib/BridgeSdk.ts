import type { BridgeAdapterSetting } from "../types/BridgeAdapterSetting";
import type { BridgeStatus, SolanaOrEvmAccount } from "../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../types/Chain";
import type { ChainDestType } from "../types/ChainDest";
import type { Token, TokenWithAmount } from "../types/Token";
import { getBridgeAdapters } from "../utils/getBridgeAdapters";
import { getSourceAndTargetChain } from "../utils/getSourceAndTargetChain";
import type { AbstractBridgeAdapter } from "./BridgeAdapter/AbstractBridgeAdapter";

export type BridgeAdapterSdkArgs = Partial<ChainSourceAndTarget> & {
  bridgeAdapterSetting?: BridgeAdapterSetting;
};

export class BridgeAdapterSdk {
  sourceChain: ChainName | undefined;
  targetChain: ChainName | undefined;
  bridgeAdapterSetting: BridgeAdapterSetting | undefined;
  bridgeAdapters: AbstractBridgeAdapter[] = [];
  constructor(args?: BridgeAdapterSdkArgs) {
    if (args) {
      const { sourceChain, targetChain, bridgeAdapterSetting } = args;
      this.sourceChain = sourceChain;
      this.targetChain = targetChain;
      this.bridgeAdapterSetting = bridgeAdapterSetting;
      this.bridgeAdapters = getBridgeAdapters({
        sourceChain: this.sourceChain,
        targetChain: this.targetChain,
        bridgeAdapterSetting: this.bridgeAdapterSetting,
      });
    }
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
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>
  ): Promise<Token[]> {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: this.sourceChain,
      sdkTargetChain: this.targetChain,
      chainChecks: {
        needEitherChain: true,
      },
    });

    const tokenResponses = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getSupportedTokens(interestedTokenList, {
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

    return Array.from(deduplicatedTokens.values());
  }

  async getRouteInformation(sourceToken: Token, targetToken: Token) {
    // Empty for now
  }

  async bridge(args: {
    tokenToBridge: { tokenInfo: TokenWithAmount };
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus[]) => void;
    onError: (error: Error) => void | Promise<void>;
  }) {
    return Promise.resolve(args);
  }
}
