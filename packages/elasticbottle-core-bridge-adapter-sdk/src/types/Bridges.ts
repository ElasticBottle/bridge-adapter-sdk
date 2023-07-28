import type {
  PublicKey,
  Transaction as SolanaTransaction,
} from "@solana/web3.js";
import type { WalletClient } from "viem";

export type Bridges =
  | "wormhole"
  | "allBridge core"
  | "allBridge classic"
  | "deBridge";

export type SolanaAccount = {
  signTransaction: (
    transaction: SolanaTransaction
  ) => Promise<SolanaTransaction>;
  publicKey: PublicKey;
};
export type EvmAccount = WalletClient;

export type SolanaOrEvmAccount = SolanaAccount | EvmAccount;

export type BridgeStatus = {
  name: string;
  status: "PENDING" | "IN_PROGRESS" | "SKIPPED" | "COMPLETED" | "FAILED";
  information: string;
};
