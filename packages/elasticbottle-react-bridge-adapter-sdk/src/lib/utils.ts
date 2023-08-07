import type { ChainDestType } from "@elasticbottle/core-bridge-adapter-sdk";
import { PublicKey } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { type useConnect } from "wagmi";
import type { BridgeStep, BridgeStepParams } from "../types/BridgeModal";

const customTwMerge = extendTailwindMerge({
  prefix: "bsa-",
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function getEvmAvailableWallets(
  wallets: ReturnType<typeof useConnect>["connectors"]
) {
  const walletNames = wallets.reduce((prev, curr) => {
    prev.add(curr.name.toLocaleLowerCase());
    return prev;
  }, new Set<string>());
  return walletNames.size;
}

export function parseForErrorString(e: unknown) {
  if (e instanceof Error) {
    console.log("e.message", e.message);
    if (
      e.message.includes("User rejected the request") ||
      e.message.includes("user did not approve")
    ) {
      return "";
    } else if (
      e.message.includes("already pending ") ||
      e.message.includes("already handling a request ") ||
      e.message.includes("Already processing eth_requestAccounts")
    ) {
      return "Please check your wallet for confirmation";
    }
  }
  return `Unknown error occurred. ${JSON.stringify(e)}`;
}

export function hasChainDest(
  params: BridgeStepParams<BridgeStep>
): params is { chainDest: ChainDestType } {
  if (!params) {
    return false;
  }
  return "chainDest" in params;
}

export function formatPublicKey(publicKey: PublicKey | null) {
  if (publicKey) {
    const base58 = publicKey.toBase58();
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }
  return "";
}

export function formatEvmAddress(address?: string | PublicKey) {
  if (address instanceof PublicKey) {
    const base58 = address.toBase58();
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }
  if (typeof address === "string") {
    return address.slice(0, 6) + ".." + address.slice(-4);
  }
  return "";
}
