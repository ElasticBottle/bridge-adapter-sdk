import {
  chainNameToViemChain,
  type Token,
} from "@elasticbottle/core-bridge-adapter-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, formatUnits, http, parseAbi } from "viem";
import { useWalletClient } from "wagmi";

export function useTokenBalance(token: Token) {
  const { data: walletClient } = useWalletClient();
  const { publicKey } = useWallet();
  const {
    data: tokenBalance,
    isInitialLoading: isTokenBalanceLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      // no token selected yet
      if (!token.address) {
        return "0";
      }

      if (token.chain === "Solana") {
        if (!publicKey) {
          // no wallet connected yet on solana
          return "0";
        }
        const connection = new Connection(
          clusterApiUrl("mainnet-beta"),
          "confirmed"
        );
        // Get the initial solana token balance
        const results = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: new PublicKey(token.address) }
        );
        for (const item of results.value) {
          const tokenInfo = item.account.data.parsed;
          console.log("tokenInfo", tokenInfo);
          const address = tokenInfo.mint;
          const amount = tokenInfo.tokenAmount.uiAmount;
          if (tokenInfo.mint === token.address) {
            return amount as string;
          }
        }
      } else {
        if (!walletClient?.transport || !walletClient?.account.address) {
          // no wallet connected yet on evm
          return "0";
        }
        if (!token.address.startsWith("0x")) {
          throw new Error(`Invalid token address ${token.address}`);
        }

        const publicClient = createPublicClient({
          transport: http(),
          chain: chainNameToViemChain(token.chain),
        });

        const data = await publicClient.readContract({
          address: token.address as `0x{string}`,
          abi: parseAbi([
            "function balanceOf(address owner) view returns (uint256)",
          ]),
          functionName: "balanceOf",
          args: [walletClient?.account.address],
        });
        return formatUnits(data, token.decimals);
      }
    },
    queryKey: ["getTokenBalance", token.chain, token.address],
  });

  return { tokenBalance, isTokenBalanceLoading, error };
}
