import { Ethereum, Polygon, Solana } from "@thirdweb-dev/chain-icons";
import type { VariantProps } from "class-variance-authority";
import { Ban } from "lucide-react";
import type { SVGProps } from "react";
import React from "react";
import { cn } from "../../../lib/utils";
import type { ChainSelectionType } from "../../../types/BridgeModal";
import { iconVariants } from "./icon";

export interface ChainIconProps
  extends SVGProps<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  chainName: ChainSelectionType;
}

const ChainIcon = React.forwardRef<SVGSVGElement, ChainIconProps>(
  ({ chainName, className, size, ...props }, ref) => {
    switch (chainName) {
      case "Goerli":
      case "Ethereum":
        return (
          <Ethereum
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Solana":
        return (
          <Solana
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Mumbai":
      case "Polygon":
        return (
          <Polygon
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "No chain selected":
        return (
          <Ban
            className={cn(iconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
    }
  }
);

ChainIcon.displayName = "ChainIcon";
export { ChainIcon };
