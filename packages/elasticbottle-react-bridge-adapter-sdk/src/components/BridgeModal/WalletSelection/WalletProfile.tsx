import { Copy, CopyCheck, LogOut, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi";
import { Button } from "../../ui/button";
import { WalletIcon } from "../../ui/icons/WalletIcon";

function AddressLine({
  address,
  isName,
}: {
  address: string;
  isName: boolean;
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
    <div className="bsa-flex bsa-items-center">
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

export function EvmWalletProfile() {
  const { address, connector, isConnected } = useAccount();
  const { data: avatar } = useEnsAvatar();
  const { data: ensName } = useEnsName();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <div className="bsa-flex bsa-items-center bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3">
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }
  return (
    <div className="bsa-flex bsa-items-center bsa-justify-between bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3 ">
      <div className="bsa-flex bsa-items-center">
        {avatar ? (
          <img
            className="bsa-mr-3 bsa-h-8 bsa-w-8 bsa-rounded-full"
            src={avatar}
            alt="Ens Avatar"
          />
        ) : (
          <WalletIcon
            walletName={connector?.name.toLowerCase() || ""}
            className="bsa-mr-3 bsa-h-10 bsa-w-10"
          />
        )}
        <div>
          <AddressLine
            address={ensName ?? (address || "")}
            isName={!!ensName}
          />
          <div className="bsa-text-sm bsa-text-muted-foreground">
            {chain?.name}
          </div>
        </div>
      </div>
      <Button size={"icon"} variant={"ghost"} onClick={() => disconnect()}>
        <LogOut />
      </Button>
    </div>
  );
}
