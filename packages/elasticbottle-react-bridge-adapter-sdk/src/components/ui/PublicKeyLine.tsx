import type { PublicKey } from "@solana/web3.js";
import { Copy, CopyCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatPublicKey } from "../../lib/utils";

export function PublicKeyLine({
  publicKey,
  isName,
  className,
}: {
  publicKey: PublicKey | null;
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
    if (publicKey) {
      setIsCopied(true);
      navigator.clipboard.writeText(publicKey.toBase58()).catch((e) => {
        console.error("ERROR copying value to clipboard", e);
      });
    }
  };

  const formattedAddress = isName
    ? publicKey?.toBase58()
    : formatPublicKey(publicKey);
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
