import type { ChainName } from "./Chain";

export type Token = {
  logoUri: string;
  decimals: number;
  symbol: string;
  name: string;
  address: string;
  chainName: ChainName;
  userAmountInBaseUnits: string;
  userAmountFormatted: string;
};

export type TokenWithAmount = Token & {
  userAmountInBaseUnits: string;
  userAmountFormatted: string;
  selectedAmountInBaseUnits: string;
  selectedAmountFormatted: string;
};
