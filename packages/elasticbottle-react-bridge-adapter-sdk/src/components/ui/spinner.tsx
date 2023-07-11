import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

const spinnerVariants = cva("", {
  variants: {
    variant: {
      default: "bsa-text-primary-foreground ",
      destructive: "bsa-bg-destructive bsa-text-destructive-foreground ",
      secondary:
        "bsa-bg-secondary bsa-text-secondary-foreground hover:bsa-bg-secondary/80",
    },
    size: {
      md: "bsa-h-10 bsa-w-10",
      sm: "bsa-h-9 bsa-w-9",
      lg: "bsa-h-11 bsa-w-11",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <Loader2 />
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
