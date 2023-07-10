import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "bsa-inline-flex bsa-items-center bsa-justify-center bsa-rounded-md bsa-text-sm bsa-font-medium bsa-ring-offset-background bsa-transition-colors focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2 disabled:bsa-pointer-events-none disabled:bsa-opacity-50",
  {
    variants: {
      variant: {
        default:
          "bsa-bg-primary bsa-text-primary-foreground hover:bsa-bg-primary/90",
        destructive:
          "bsa-bg-destructive bsa-text-destructive-foreground hover:bsa-bg-destructive/90",
        outline:
          "bsa-border bsa-border-input bsa-bg-background hover:bsa-bg-accent hover:bsa-text-accent-foreground",
        secondary:
          "bsa-bg-secondary bsa-text-secondary-foreground hover:bsa-bg-secondary/80",
        ghost: "hover:bsa-bg-accent hover:bsa-text-accent-foreground",
        link: "bsa-text-primary bsa-underline-offset-4 hover:bsa-underline",
      },
      size: {
        default: "bsa-h-10 bsa-px-4 bsa-py-2",
        sm: "bsa-h-9 bsa-rounded-md bsa-px-3",
        lg: "bsa-h-11 bsa-rounded-md bsa-px-8",
        icon: "bsa-h-10 bsa-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };