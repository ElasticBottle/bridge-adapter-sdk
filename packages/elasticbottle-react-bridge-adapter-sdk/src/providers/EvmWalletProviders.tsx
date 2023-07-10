import { useMemo } from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
  mainnet,
  type Chain,
  type ChainProviderFn,
} from "wagmi";
import { goerli } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

export function EvmWalletProvider({
  children,
  settings: { walletConnectProjectId, alchemyApiKey, infuraApiKey },
}: {
  settings: {
    walletConnectProjectId?: string;
    alchemyApiKey?: string;
    infuraApiKey?: string;
  };
  children: React.ReactNode;
}) {
  const config = useMemo(() => {
    const { chains, publicClient, webSocketPublicClient } =
      configureChains<Chain>(
        [mainnet, goerli],
        [
          publicProvider(),
          !!infuraApiKey && infuraProvider({ apiKey: infuraApiKey }),
          !!alchemyApiKey && alchemyProvider({ apiKey: alchemyApiKey }),
        ].filter(Boolean) as ChainProviderFn<Chain>[]
      );

    const connectors: (InjectedConnector | WalletConnectConnector)[] = [
      new InjectedConnector({ chains }),
      !!walletConnectProjectId &&
        new WalletConnectConnector({
          chains,
          options: {
            projectId: walletConnectProjectId,
          },
        }),
    ].filter(Boolean) as (InjectedConnector | WalletConnectConnector)[];

    const config = createConfig({
      autoConnect: true,
      publicClient,
      webSocketPublicClient,
      connectors,
      logger: {
        warn: (message) => {
          process.env.NODE_ENV === "development" && console.warn(message);
        },
      },
    });
    return config;
  }, [alchemyApiKey, infuraApiKey, walletConnectProjectId]);

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
