import { Copy, CopyCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export function AddressLine({
  address,
  isName,
  className,
}: {
  address: string;
  isName: boolean;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1_000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isCopied]);

  const copyAddress = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(address).catch((e) => {
      console.error("ERROR copying value to clipboard", e);
    });
  };

  const formattedAddress = isName ? address : address.slice(0, 6);
  return (
    <div className={cn("bsa-flex bsa-items-center", className)}>
      <div className="bsa-mr-1">{formattedAddress} </div>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="bsa-h-6 bsa-w-6 bsa-p-1"
        onClick={copyAddress}
      >
        {isCopied ? <CopyCheck /> : <Copy />}
      </Button>
    </div>
  );
}
