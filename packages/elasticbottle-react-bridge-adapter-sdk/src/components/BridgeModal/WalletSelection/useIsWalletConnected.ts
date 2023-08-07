import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useIsWalletConnected() {
  const { isConnected: isEvmWalletConnected } = useAccount();
  const { connected: isSolanaWalletConnected } = useWallet();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  if (sourceToken.chain === "Solana" && targetToken.chain === "Solana") {
    return isSolanaWalletConnected;
  } else if (sourceToken.chain !== "Solana" && targetToken.chain !== "Solana") {
    return isEvmWalletConnected;
  }
  return isEvmWalletConnected && isSolanaWalletConnected;
}
