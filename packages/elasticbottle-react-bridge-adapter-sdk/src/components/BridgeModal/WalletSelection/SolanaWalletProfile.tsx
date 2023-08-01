import { LogOut, UserCircle2 } from "lucide-react";
import { Button } from "../../ui/button";
import { WalletAdapterIcon } from "../../ui/icons/WalletAdapterIcon";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKeyLine } from "../../ui/PublicKeyLine";

export function SolanaWalletProfile({
  onDisconnect,
}: {
  onDisconnect?: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { connected, disconnect, publicKey, wallet } = useWallet();

  if (!connected) {
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
        <WalletAdapterIcon
          wallet={wallet}
          className="bsa-max-h-[2.5rem] bsa-px-2 bsa-py-[0.3125rem]"
        />
        <div>
          <PublicKeyLine publicKey={publicKey} isName={!publicKey} />
          <div className="bsa-text-sm bsa-text-muted-foreground">Solana</div>
        </div>
      </div>
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={onDisconnect ? onDisconnect : disconnect}
      >
        <LogOut />
      </Button>
    </div>
  );
}
