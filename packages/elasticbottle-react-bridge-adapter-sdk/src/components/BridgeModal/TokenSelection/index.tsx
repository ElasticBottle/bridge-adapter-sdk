// import { useQuery } from "@tanstack/react-query";
import type { Token } from "@elasticbottle/core-bridge-adapter-sdk";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_TOKEN_WITH_AMOUNT } from "../../../constants/Token";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { AddressLine } from "../../ui/AddressLine";
import { Input } from "../../ui/input";

export function TokenSelection() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();

  const [tokenSearch, setTokenSearch] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  // const { data: tokens, isInitialLoading } = useQuery({
  //   queryFn: async () => {
  //     if (
  //       sourceChain === "No chain selected" ||
  //       targetChain === "No chain selected"
  //     ) {
  //       throw new Error("Invalid Source or Target chain");
  //     }
  //     const sdk = new BridgeAdapterSdk({
  //       sourceChain,
  //       targetChain,
  //     });
  //     return await sdk.getSupportedTokens();
  //   },
  //   queryKey: ["getTokens", sourceChain, targetChain],
  // });
  const isInitialLoading = false;
  const tokens = useMemo(() => [DEFAULT_TOKEN_WITH_AMOUNT], []);

  useEffect(() => {
    if (tokenSearch) {
      setFilteredTokens(
        tokens.filter((token) => {
          const searchTerm = tokenSearch.toLowerCase();
          return (
            token.name.toLowerCase().includes(searchTerm) ||
            token.address.toLowerCase().includes(searchTerm) ||
            token.symbol.toLowerCase().includes(searchTerm)
          );
        })
      );
    } else {
      setFilteredTokens([...tokens]);
    }
  }, [tokenSearch, tokens]);

  let TokenList = (
    <div className="bsa-w-full bsa-text-center bsa-text-muted-foreground">
      No Tokens found
    </div>
  );
  if (isInitialLoading) {
    TokenList = (
      <>
        {Array(5).map((_, idx) => {
          return (
            // TODO: replace with a proper loader
            <div key={idx} className="bsa-h-8 bsa-w-full bsa-animate-pulse" />
          );
        })}
      </>
    );
  }
  if (filteredTokens.length > 0) {
    TokenList = (
      <>
        {filteredTokens.map((token) => {
          return (
            <div
              key={token.address}
              className="bsa-flex bsa-items-center bsa-justify-between"
            >
              <div className="bsa-flex bsa-items-center bsa-space-x-2">
                <img
                  className="bsa-h-6 bsa-w-6 bsa-rounded-full"
                  src={token.logoUri}
                  alt={token.name}
                />
                <div>
                  <div className="bsa-text-lg">{token.name}</div>
                  <AddressLine
                    address={token.address}
                    isName={false}
                    className="bsa-text-sm bsa-text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-7">
      <Input
        placeholder="Search Token"
        type="text"
        value={tokenSearch}
        onChange={(e) => {
          setTokenSearch(e.target.value);
        }}
      />
      <div className="bsa-flex bsa-max-h-96 bsa-flex-col bsa-space-y-5 bsa-overflow-auto">
        {TokenList}
      </div>
    </div>
  );
}
