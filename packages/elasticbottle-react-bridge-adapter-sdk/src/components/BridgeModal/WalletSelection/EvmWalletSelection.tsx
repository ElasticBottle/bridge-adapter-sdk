import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";
import { withErrorBoundary } from "react-error-boundary";
import { useConnect, useDisconnect } from "wagmi";
import { chainNameToChainId } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { WalletIcon } from "../../ui/icons/WalletIcon";
import { EvmWalletProfile } from "./WalletProfile";

function EvmWalletConnectionListBase({
  chain,
  onSuccess,
}: {
  chain: ChainName;
  onSuccess?: () => void;
}) {
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    chainId: chainNameToChainId(chain),
    onSuccess,
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      <EvmWalletProfile />
      {connectors.map((connector) => {
        if (!connector.ready) {
          return null;
        }
        if (
          connector.id === "injected" &&
          connector.name.toLowerCase() === "metamask"
        ) {
          return null;
        }

        const isCurrentlyConnecting =
          isLoading && connector.id === pendingConnector?.id;
        return (
          <Button
            key={connector.id}
            size={"lg"}
            variant={"secondary"}
            className="bsa-flex bsa-w-full bsa-items-center bsa-justify-start bsa-space-x-3 bsa-py-5"
            isLoading={!connector.ready || isCurrentlyConnecting}
            loadingText={`Connecting ${connector.name}`}
            onClick={() => {
              disconnect(undefined, {
                onSuccess() {
                  connect({ connector });
                },
              });
            }}
          >
            <WalletIcon walletName={connector.name} className="bsa-mr-2" />{" "}
            {connector.name}
          </Button>
        );
      })}
    </div>
  );
}

export const EvmWalletConnectionList = withErrorBoundary(
  EvmWalletConnectionListBase,
  {
    fallback: (
      <>
        <div>Error initializing wallet connection list.</div>
        <div>
          Did you wrap the{" "}
          <pre className="bsa-inline-block">{"<BridgeModal/>"}</pre> component
          in a <pre className="bsa-inline-block">{"<EvmWalletProvider/>"}</pre>?
        </div>
      </>
    ),
    onError(errors) {
      console.error("Original Error", errors);
    },
  }
);
