import type { Bridges } from "./Bridges";
import type { ChainName } from "./Chain";

export type Token = {
  logoUri: string;
  name: string;
  symbol: string;
  address: string;
  chain: ChainName;
  decimals: number;
  bridgeName: Bridges;
};

export type BridgeToken = {
  logoUri: string;
  name: string;
  symbol: string;
  sourceAddress: string;
  sourceChain: ChainName;
  sourceDecimals: number;
  targetAddress: string;
  targetChain: ChainName;
  targetDecimals: number;
};

type TokenUserBalance = {
  userAmountInBaseUnits: string;
  userAmountFormatted: string;
};

type TokenUserAmount = {
  selectedAmountInBaseUnits: string;
  selectedAmountFormatted: string;
};

export type TokenWithAmount = Token & TokenUserAmount;
export type TokenWithUserBalance = Token & TokenUserBalance;
