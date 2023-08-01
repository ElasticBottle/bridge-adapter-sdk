import type {
  ChainDestType,
  ChainName,
} from "@elasticbottle/core-bridge-adapter-sdk";

export const EMPTY_BRIDGE_STEP_TITLE = "Select a chain";

export type BridgeStep =
  | "MULTI_CHAIN_SELECTION"
  | "SINGLE_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  | "TOKEN_SELECTION"
  | "SWAP_SETTINGS"
  | "SWAP_DETAILS"
  | "SWAP_REVIEW"
  | "PENDING_TRANSACTION"
  | "PROFILE_DETAILS";

export const BridgeStepToTitle: Record<BridgeStep, string> = {
  MULTI_CHAIN_SELECTION: EMPTY_BRIDGE_STEP_TITLE,
  SINGLE_CHAIN_SELECTION: EMPTY_BRIDGE_STEP_TITLE,
  WALLET_SELECTION: "Select a wallet",
  TOKEN_SELECTION: "Select a token",
  SWAP_SETTINGS: "Swap settings",
  SWAP_DETAILS: "Swap details",
  SWAP_REVIEW: "Review swap",
  PENDING_TRANSACTION: "Pending transaction",
  PROFILE_DETAILS: "Account",
};

export type SetCurrentBridgeStepType<T extends BridgeStep> = T extends
  | "SINGLE_CHAIN_SELECTION"
  | "WALLET_SELECTION"
  | "TOKEN_SELECTION"
  ? {
      step: T;
      params: BridgeStepParams<T>;
    }
  : {
      step: T;
    };

export type BridgeStepParams<T extends BridgeStep> = T extends "TOKEN_SELECTION"
  ? { chainDest: ChainDestType }
  : T extends "SINGLE_CHAIN_SELECTION"
  ? { chainDest: ChainDestType; autoConnectToChain?: ChainName }
  : T extends "WALLET_SELECTION"
  ? { chain: ChainName; chainDest?: ChainDestType; onSuccess?: () => void }
  : undefined;

export type ChainSelectionType = ChainName | "Select a chain";
