import { Ethereum, Polygon, Solana } from "@thirdweb-dev/chain-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { Link2Off } from "lucide-react";
import type { SVGProps } from "react";
import React from "react";
import { cn } from "../../../lib/utils";
import type { ChainSelectionType } from "../../../types/BridgeModal";

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "bsa-h-5 bsa-w-5",
      md: "bsa-h-6 bsa-w-6",
      lg: "bsa-h-7 bsa-w-7",
      xl: "bsa-h-8 bsa-w-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

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
      case "Select a chain":
        return (
          <Link2Off
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
