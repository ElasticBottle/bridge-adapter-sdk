import type {
  Commitment,
  Connection,
  SendOptions,
  Transaction,
} from "@solana/web3.js";

export async function submitSolanaTransaction(
  signedTransaction: Transaction,
  connection: Connection,
  sendOptions?: SendOptions,
  commitment?: Commitment
) {
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    sendOptions
  );
  const response = await connection.confirmTransaction(
    {
      blockhash,
      lastValidBlockHeight,
      signature,
    },
    commitment
  );
  return { signature, response };
}
