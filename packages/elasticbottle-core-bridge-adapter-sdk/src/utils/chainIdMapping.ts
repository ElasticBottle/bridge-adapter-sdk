import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  mainnet,
  optimism,
  polygon,
} from "viem/chains";
import type { ChainName } from "../types/Chain";

export function chainIdToChainName(chainId: number): ChainName | undefined {
  switch (chainId) {
    case mainnet.id: {
      return "Ethereum";
    }
    case fantom.id: {
      // return 'Fantom'
      break;
    }
    case arbitrum.id: {
      return "Arbitrum";
    }
    case avalanche.id: {
      return "Avalanche";
    }
    case optimism.id: {
      return "Optimism";
    }
    case bsc.id: {
      return "BSC";
    }
    case polygon.id: {
      return "Polygon";
    }
  }
}

export function chainNameToViemChain(chainName: ChainName) {
  switch (chainName) {
    case "Ethereum": {
      return mainnet;
    }
    case "Arbitrum": {
      return arbitrum;
    }
    case "Optimism": {
      return optimism;
    }
    case "Avalanche": {
      return avalanche;
    }
    case "BSC": {
      return bsc;
    }
    case "Polygon": {
      return polygon;
    }
    case "Solana": {
      throw new Error("Viem does not support Solana");
    }
    default: {
      throw new Error("Invalid chain name");
    }
  }
}

export const SOLANA_FAKE_CHAIN_ID = -1;
export function chainNameToChainId(chainName: ChainName) {
  if (chainName === "Solana") {
    return SOLANA_FAKE_CHAIN_ID;
  }
  const chain = chainNameToViemChain(chainName);
  return chain.id;
}
