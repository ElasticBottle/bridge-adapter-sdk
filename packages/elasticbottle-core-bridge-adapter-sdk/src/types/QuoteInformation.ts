import type {
  FeeToken,
  TokenWithAmount,
  TokenWithExpectedOutput,
} from "./Token";

export type QuoteInformation = {
  sourceToken: TokenWithAmount;
  targetToken: TokenWithExpectedOutput;
  bridgeName: string;
  tradeDetails: {
    fee: FeeToken[];
    priceImpact: number;
    estimatedTimeMinutes: number;
    routeInformation: {
      fromTokenSymbol: string;
      toTokenSymbol: string;
    }[];
  };
};
