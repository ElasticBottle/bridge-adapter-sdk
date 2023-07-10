import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
