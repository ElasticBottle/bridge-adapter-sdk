import type { TokenWithAmount, TokenWithExpectedOutput } from "./Token";

export type QuoteInformation = {
  sourceToken: TokenWithAmount;
  targetToken: TokenWithExpectedOutput;
  bridgeName: string;
  tradeDetails: {
    fee: TokenWithAmount;
    priceImpact: number;
    estimatedTimeMinutes: number;
    routeInformation: { from: string; to: string; protocol: string }[];
  };
};
