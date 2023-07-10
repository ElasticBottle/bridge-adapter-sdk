import { Settings } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { DialogHeader, DialogTitle } from "../ui/dialog";

export function BridgeHeader({ title }: { title?: string }) {
  return (
    <DialogHeader aria-description="Modal to swap assets between various blockchains">
      <DialogTitle
        className={cn({
          "flex items-center text-xl": true,
          "justify-between": !!title,
          "justify-end": !title,
        })}
      >
        {title}
        <Button size={"icon"} variant={"secondary"} className="p-2">
          <Settings />
        </Button>
      </DialogTitle>
    </DialogHeader>
  );
}
