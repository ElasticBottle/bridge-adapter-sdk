import type { Bridges } from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { Token, TokenWithAmount } from "../../types/Token";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class WormholeBridgeAdapter extends AbstractBridgeAdapter {
  constructor(args: Partial<ChainSourceAndTarget>) {
    super(args);
  }
  name(): Bridges {
    return "wormhole";
  }
  getSupportedChains(): Promise<ChainName[]> {
    return Promise.resolve([
      "Ethereum",
      "Solana",
      "Polygon",
      "Mumbai",
      "Goerli",
    ]);
  }
  getSupportedTokens(
    chains?: Partial<ChainSourceAndTarget> | undefined
  ): Promise<Token[]> {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: super.sourceChain,
      sdkTargetChain: super.targetChain,
    });
    throw new Error("Method not implemented.");
  }
  getFeeDetails(
    chains?: Partial<ChainSourceAndTarget> | undefined
  ): Promise<
    Omit<TokenWithAmount, "userAmountInBaseUnits" | "userAmountFormatted">
  > {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: this.sourceChain,
      sdkTargetChain: this.targetChain,
    });
    throw new Error("Method not implemented.");
  }
  lock(
    args: {
      token: Token;
      amountToSwapInBaseUnits: bigint;
      sourceAccount: string;
      targetAccount: string;
    } & Partial<ChainSourceAndTarget>
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  receive(targetAccount: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
