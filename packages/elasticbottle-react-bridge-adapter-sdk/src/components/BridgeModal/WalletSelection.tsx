import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";
import { withErrorBoundary } from "react-error-boundary";
import { useConnect } from "wagmi";
import { useBridgeModalStore } from "../../providers/BridgeModalContext";
import type { BridgeStep, BridgeStepParams } from "../../types/BridgeModal";
import { Button } from "../ui/button";

function hasChain(
  params: BridgeStepParams<BridgeStep>
): params is { chain: ChainName } {
  if (!params) {
    return false;
  }
  return "chain" in params;
}

export function WalletSelection() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChain(params)) {
    throw new Error("Missing chain in params");
  }
  const { chain } = params;
  if (chain === "Solana") {
    return <div>solana</div>;
  } else {
    return <EvmWalletConnectionList />;
  }
}

function EvmWalletConnectionListBase() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      {connectors.map((connector) => {
        if (!connector.ready) {
          return null;
        }
        const isCurrentlyConnecting =
          isLoading && connector.id === pendingConnector?.id;
        return (
          <Button
            key={connector.id}
            variant={"secondary"}
            className="bsa-flex bsa-w-full bsa-items-center bsa-justify-center bsa-space-x-3"
            disabled={!connector.ready || isCurrentlyConnecting}
            onClick={() => connect({ connector })}
          >
            {connector.name}
          </Button>
        );
      })}

      {error && <div>{error.message}</div>}
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
