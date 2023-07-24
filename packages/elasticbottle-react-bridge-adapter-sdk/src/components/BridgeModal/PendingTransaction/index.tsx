import { Spinner } from "../../ui/spinner";

export function PendingTransaction() {
  return (
    <div className="bsa-flex bsa-h-full bsa-w-full bsa-items-center bsa-justify-center">
      <Spinner variant={"secondary"} size={"lg"} />
    </div>
  );
}
