import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";

export type BridgeStep =
  | "MULTI_CHAIN_SELECTION"
  | "SINGLE_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  | "TOKEN_SELECTION"
  | "SWAP_SETTINGS"
  | "SWAP_DETAILS"
  | "SWAP_REVIEW"
  | "PENDING_TRANSACTION";

export const BridgeStepToTitle: Record<BridgeStep, string> = {
  MULTI_CHAIN_SELECTION: "Select a chain",
  SINGLE_CHAIN_SELECTION: "Select a chain",
  WALLET_SELECTION: "Select a wallet",
  TOKEN_SELECTION: "Select a token",
  SWAP_SETTINGS: "Swap settings",
  SWAP_DETAILS: "Swap details",
  SWAP_REVIEW: "Review swap",
  PENDING_TRANSACTION: "Pending transaction",
};

export type ChainDestType = "source" | "target";

export type SetCurrentBridgeStepType<T extends BridgeStep> = T extends
  | "SINGLE_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  ? {
      step: T;
      params: BridgeStepParams<T>;
    }
  : {
      step: T;
    };

export type BridgeStepParams<T extends BridgeStep> =
  T extends "SINGLE_CHAIN_SELECTION"
    ? { chainDest: ChainDestType }
    : T extends "WALLET_SELECTION"
    ? { chain: ChainName; onSuccess?: () => void }
    : undefined;

export type ChainSelectionType = ChainName | "Select a chain";
