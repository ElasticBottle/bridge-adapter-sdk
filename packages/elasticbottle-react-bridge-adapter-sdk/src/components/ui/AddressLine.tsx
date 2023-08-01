import { Copy, CopyCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useCopyAddress } from "./useCopyAddress";

export function AddressLine({
  address,
  isName,
  className,
}: {
  address: string;
  isName: boolean;
  className?: string;
}) {
  const { copyAddress, isCopied } = useCopyAddress(address);

  const formattedAddress = isName ? address : address.slice(0, 6);
  return (
    <div className={cn("bsa-flex bsa-items-center", className)}>
      <div className="bsa-mr-1">{formattedAddress} </div>
      <div
        className="bsa-inline-flex bsa-h-6 bsa-w-6 bsa-items-center bsa-justify-center bsa-rounded-md bsa-p-1 bsa-text-sm bsa-font-medium bsa-ring-offset-background bsa-transition-colors hover:bsa-bg-accent  hover:bsa-text-accent-foreground focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2"
        onClick={copyAddress}
      >
        {isCopied ? <CopyCheck /> : <Copy />}
      </div>
    </div>
  );
}
