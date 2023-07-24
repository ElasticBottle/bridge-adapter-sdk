import type { Bridges } from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { Token, TokenWithAmount } from "../../types/Token";

export abstract class AbstractBridgeAdapter {
  sourceChain: ChainName | undefined;
  targetChain: ChainName | undefined;
  constructor({ sourceChain, targetChain }: Partial<ChainSourceAndTarget>) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
  }
  abstract name(): Bridges;

  abstract getSupportedChains(): Promise<ChainName[]>;

  abstract getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>
  ): Promise<Token[]>;

  abstract getFeeDetails(
    chains?: Partial<ChainSourceAndTarget>
  ): Promise<
    Omit<TokenWithAmount, "userAmountInBaseUnits" | "userAmountFormatted">
  >;

  abstract lock(
    args: {
      token: Token;
      amountToSwapInBaseUnits: bigint;
      sourceAccount: string;
      targetAccount: string;
      // onProgressUpdate: (progress: number, detail: BridgeDetails) => void; //optional
    } & Partial<ChainSourceAndTarget>
  ): Promise<void>;

  abstract receive(targetAccount: string): Promise<void>;
}
