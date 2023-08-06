import * as React from "react";
import { cn } from "../../lib/utils";
import * as Switch from "@radix-ui/react-switch";

export interface ToggleProps extends Switch.SwitchProps {
  text?: string;
  textClassName?: string;
  switchClassName?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, text, textClassName, switchClassName, ...props }, ref) => {
    return (
      <Switch.Root
        className={cn(
          `bsa-relative bsa-h-10 bsa-min-w-[42px] bsa-cursor-default bsa-rounded-full bsa-border bsa-bg-background bsa-shadow-[0_2px_10px] bsa-shadow-background bsa-outline-none focus:bsa-shadow-[0_0_0_2px] focus:bsa-shadow-black data-[state=checked]:bsa-bg-black`,
          className
        )}
        ref={ref}
        {...props}
      >
        <Switch.Thumb
          className={cn(
            "bsa-block bsa-h-[21px] bsa-w-[21px] bsa-translate-x-0.5 bsa-rounded-full bsa-bg-white bsa-shadow-[0_2px_2px] bsa-shadow-black bsa-transition-transform bsa-will-change-transform bsa-duration-100 data-[state=checked]:bsa-translate-x-[19px]",
            switchClassName
          )}
        />
        <span
          className={cn("bsa-absolute bsa-bottom-0 bsa-top-0", textClassName)}
        >
          {text}
        </span>
      </Switch.Root>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle };
