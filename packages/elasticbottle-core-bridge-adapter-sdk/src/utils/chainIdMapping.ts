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

export const SOLANA_FAKE_CHAIN_ID = -1;
export function chainNameToChainId(chainName: ChainName) {
  switch (chainName) {
    case "Ethereum": {
      return mainnet.id;
    }
    case "Arbitrum": {
      return arbitrum.id;
    }
    case "Optimism": {
      return optimism.id;
    }
    case "Avalanche": {
      return avalanche.id;
    }
    case "BSC": {
      return bsc.id;
    }
    case "Polygon": {
      return polygon.id;
    }
    case "Solana": {
      return SOLANA_FAKE_CHAIN_ID;
    }
    default: {
      throw new Error("Invalid chain name");
    }
  }
}
