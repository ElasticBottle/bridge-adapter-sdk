import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export interface SolanaWalletProviderProps
  extends Omit<WalletProviderProps, "wallets"> {
  wallets?: WalletProviderProps["wallets"] | [];
}

export function SolanaWalletProvider({
  children,
  wallets = [],
  autoConnect = true,
}: SolanaWalletProviderProps) {
  const walletProviderWallets = useMemo(() => [...wallets], [wallets]);

  return (
    <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
      <WalletProvider wallets={walletProviderWallets} autoConnect={autoConnect}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
