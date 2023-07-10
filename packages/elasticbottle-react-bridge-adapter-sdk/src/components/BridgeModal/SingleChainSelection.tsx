import { SupportedChainNames } from "@elasticbottle/core-bridge-adapter-sdk";
import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../providers/BridgeModalContext";
import { ChainIcon } from "../ui/ChainIcon";
import { Button } from "../ui/button";

export function SingleChainSelection() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();

  if (!("chainDest" in (params ?? {}))) {
    throw new Error("Missing chainDest in params");
  }

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      {SupportedChainNames.map((chainName) => {
        return (
          <Button
            key={chainName}
            variant={"secondary"}
            size={"lg"}
            className="bsa-flex bsa-w-full  bsa-items-center bsa-justify-center bsa-space-x-3 bsa-px-20"
            onClick={() => {
              setCurrentBridgeStep({
                step: "WALLET_SELECTION",
                params: {
                  chain: chainName,
                },
              });
            }}
          >
            <ChainIcon chainName={chainName} size={"default"} />
            <div className="text-xl">{chainName}</div>
          </Button>
        );
      })}
    </div>
  );
}
