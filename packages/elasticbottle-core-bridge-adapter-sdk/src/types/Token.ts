import type { ChainName } from "./Chain";

export type Token = {
  logoUri: string;
  decimals: number;
  symbol: string;
  name: string;
  address: string;
  chainName: ChainName;
};

export type TokenWithAmount = Token & {
  amountInBaseUnits: string;
};
