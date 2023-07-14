import type { ChainName } from "../types/Chain";

export function getSourceAndTargetChain({
  overrideSourceChain,
  overrideTargetChain,
  sdkSourceChain,
  sdkTargetChain,
}: {
  sdkSourceChain?: ChainName;
  sdkTargetChain?: ChainName;
  overrideSourceChain?: ChainName;
  overrideTargetChain?: ChainName;
}) {
  if (!sdkSourceChain || !overrideSourceChain) {
    throw new Error("Missing sourceChain");
  }
  if (!sdkTargetChain || !overrideTargetChain) {
    throw new Error("Missing targetChain");
  }
  const source = overrideSourceChain ?? sdkSourceChain;
  const target = overrideTargetChain ?? sdkTargetChain;
  return { source, target };
}
