import { BridgeAdapterSdk } from "@elasticbottle/core-bridge-adapter-sdk";
import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "../../providers/BridgeModalContext";
import { AddressLine } from "../ui/AddressLine";
import { Input } from "../ui/input";

export function TokenSelection() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { data: tokens, isInitialLoading } = useQuery({
    queryFn: async () => {
      if (
        sourceChain === "No chain selected" ||
        targetChain === "No chain selected"
      ) {
        throw new Error("Invalid Source or Target chain");
      }
      const sdk = new BridgeAdapterSdk({
        sourceChain,
        targetChain,
      });
      return await sdk.getSupportedTokens();
    },
    queryKey: ["getTokens", sourceChain, targetChain],
  });
  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-7">
      <Input placeholder="Search Token" type="text" />
      <div className="bsa-flex bsa-flex-col">
        {isInitialLoading
          ? Array(5).map((_, idx) => {
              return (
                // TODO: replace with a proper loader
                <div
                  key={idx}
                  className="bsa-h-8 bsa-w-full bsa-animate-pulse"
                />
              );
            })
          : tokens?.map((token) => {
              return (
                <div
                  key={token.address}
                  className="bsa-flex bsa-items-center bsa-justify-between"
                >
                  <div className="bsa-flex bsa-items-center">
                    <img
                      className="bsa-h-6 bsa-w-6 bsa-rounded-full"
                      src={token.logoUri}
                      alt={token.name}
                    />
                    <div>
                      <div>{token.name}</div>
                      <AddressLine
                        address={token.address}
                        isName={false}
                        className="bsa-text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
