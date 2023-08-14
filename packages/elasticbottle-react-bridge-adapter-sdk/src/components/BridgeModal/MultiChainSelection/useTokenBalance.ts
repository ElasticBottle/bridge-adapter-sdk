import {
  chainNameToViemChain,
  formatTokenBalance,
  type Token,
} from "@elasticbottle/core-bridge-adapter-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, formatUnits, http, parseAbi } from "viem";
import { useWalletClient } from "wagmi";

export function useTokenBalance(token: Token) {
  console.log("token", token);
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
          "https://solana-mainnet.g.alchemy.com/v2/Pt4N65LbFsR5ofrJXw8626s5qtMDMp6j",
          "confirmed"
        );
        // Get the initial solana token balance
        const results = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: new PublicKey(token.address) }
        );
        console.log("results", results);

        for (const item of results.value) {
          // const tokenInfo = item.account.data.parsed;
          // console.log("tokenInfo", tokenInfo);
          // const address = tokenInfo.mint;
          // const amount = tokenInfo.tokenAmount.uiAmount;
          // if (tokenInfo.mint === token.address) {
          //   return amount as string;
          // }
        }
        // No associated token account found
        return "0";
      } else {
        if (!walletClient?.transport || !walletClient?.account.address) {
          // no wallet connected yet on evm
          return "0";
        }
        if (!token.address.startsWith("0x")) {
          throw new Error(`Invalid token address ${token.address}`);
        }
        -0;
        const publicClient = createPublicClient({
          transport: http(),
          chain: chainNameToViemChain(token.chain),
        });

        const byteCode = await publicClient.getBytecode({
          address: token.address as `0x{string}`,
        });
        if (byteCode) {
          const userBalannce = await publicClient.readContract({
            address: token.address as `0x{string}`,
            abi: parseAbi([
              "function balanceOf(address owner) view returns (uint256)",
            ]),
            functionName: "balanceOf",
            args: [walletClient?.account.address],
          });
          console.log("userBalannce token", userBalannce);
          return formatTokenBalance(formatUnits(userBalannce, token.decimals));
        } else {
          const userBalannce = await publicClient.getBalance({
            address: walletClient?.account.address,
          });
          console.log("userBalannce coin", userBalannce);
          return formatTokenBalance(formatUnits(userBalannce, token.decimals));
        }
      }
    },
    queryKey: [
      "getTokenBalance",
      token.address,
      token.chain,
      walletClient?.account.address,
    ],
  });

  return { tokenBalance, isTokenBalanceLoading, error };
}
