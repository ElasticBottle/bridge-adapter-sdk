import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { Token, TokenWithAmount } from "../../types/Token";

export abstract class AbstractBridgeAdapter {
  sourceChain: ChainName;
  targetChain: ChainName;
  constructor({ sourceChain, targetChain }: ChainSourceAndTarget) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
  }

  abstract getSupportedTokens(): Promise<Token[]>;

  abstract getFeeDetails(): Promise<TokenWithAmount>;

  abstract lock(args: {
    token: Token;
    amountInBaseUnits: bigint;
    sourceAccount: string;
    targetAccount: string;
    // onProgressUpdate: (progress: number, detail: BridgeDetails) => void; //optional
  }): Promise<void>;

  abstract receive(targetAccount: string): Promise<void>;
}
