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
    chains?: Partial<ChainSourceAndTarget>,
    tokens?: { sourceToken: Token; targetToken: Token }
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
        return bridgeAdapter.getSupportedTokens(
          interestedTokenList,
          {
            sourceChain: source,
            targetChain: target,
          },
          tokens
        );
      })
    );

    const supportedTokens = tokenResponses
      .map((tokenResponse) => {
        if (tokenResponse.status === "fulfilled") {
          return tokenResponse.value;
        } else {
          console.warn(
            "Failed to get tokens from bridge",
            tokenResponse.reason
          );
        }
      })
      .filter((tokenResponse) => !!tokenResponse)
      .flat() as Token[];

    return this.deduplicateTokens(supportedTokens);
  }

  private deduplicateTokens(tokens: Token[]): Token[] {
    const deduplicatedTokens = tokens.reduce((prev, curr) => {
      if (prev.has(curr.address)) {
        const prevToken = prev.get(curr.address);
        if (!prevToken) throw new Error("prevToken is undefined");
        prev.set(curr.address, {
          ...prevToken,
          bridgeNames: [...prevToken.bridgeNames, ...curr.bridgeNames],
        });
      } else {
        prev.set(curr.address, curr);
      }
      return prev;
    }, new Map<string, Token>());

    return Array.from(deduplicatedTokens.values());
  }

  async getQuoteInformation(sourceToken: Token, targetToken: Token) {
    const routeInfos = await Promise.allSettled(
      this.bridgeAdapters.map(async (bridgeAdapter) => {
        return bridgeAdapter.getQuoteDetails(sourceToken, targetToken);
      })
    );
    const routes = routeInfos
      .map((routeInfo) => {
        if (routeInfo.status === "fulfilled") {
          return routeInfo.value;
        } else {
          console.warn(
            "Error fetching route info for one of the bridge",
            routeInfo.reason
          );
        }
      })
      .filter((routeInfo) => !!routeInfo);
    return routes;
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
