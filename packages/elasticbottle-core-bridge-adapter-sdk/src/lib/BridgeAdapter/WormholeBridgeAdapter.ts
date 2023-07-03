import type { ChainSourceAndTarget } from "../../types/Chain";
import type { Token, TokenWithAmount } from "../../types/Token";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class WormholeBridgeAdapter extends AbstractBridgeAdapter {
  constructor(args: ChainSourceAndTarget) {
    super(args);
  }
  getSupportedTokens(): Promise<Token[]> {
    throw new Error("Method not implemented.");
  }
  getFeeDetails(): Promise<TokenWithAmount> {
    throw new Error("Method not implemented.");
  }
  lock(args: {
    token: Token;
    amountInBaseUnits: bigint;
    sourceAccount: string;
    targetAccount: string;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }
  receive(targetAccount: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
