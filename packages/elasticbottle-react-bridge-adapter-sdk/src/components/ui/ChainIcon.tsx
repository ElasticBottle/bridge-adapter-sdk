import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";
import { Ethereum, Polygon, Solana } from "@thirdweb-dev/chain-icons";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { SVGProps } from "react";
import React from "react";
import { cn } from "../../lib/utils";

const chainIconVariants = cva("", {
  variants: {
    size: {
      default: "bsa-h-6 bsa-w-6",
      sm: "bsa-h-5 bsa-w-5",
      lg: "bsa-h-7 bsa-w-7",
      xl: "bsa-h-8 bsa-w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
export interface ChainIconProps
  extends SVGProps<SVGSVGElement>,
    VariantProps<typeof chainIconVariants> {
  chainName: ChainName;
}

const ChainIcon = React.forwardRef<SVGSVGElement, ChainIconProps>(
  ({ chainName, className, size, ...props }, ref) => {
    switch (chainName) {
      case "Goerli":
      case "Ethereum":
        return (
          <Ethereum
            className={cn(chainIconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Solana":
        return (
          <Solana
            className={cn(chainIconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
      case "Mumbai":
      case "Polygon":
        return (
          <Polygon
            className={cn(chainIconVariants({ size, className }))}
            ref={ref}
            {...props}
          />
        );
    }
  }
);

ChainIcon.displayName = "ChainIcon";
export { ChainIcon, chainIconVariants };