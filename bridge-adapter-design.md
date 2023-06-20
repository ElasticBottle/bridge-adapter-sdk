# Bridge Adapter Design Document

This document covers the existing bridges available and how this package attempts to unify the various bridges out there into a unified interface that is easily extensible while still providing a great developer experience.

## Bridges

### Wormhole

#### Publish

```solidity
publishMessage(
    int nonce,
    byte[] payload,
    int consistencyLevel
) returns int sequenceNumber
```

When `publishMessage` is called against the core contract, some logs are generally emitted.

Once the target [consistency level](#consistency-levels) has been reached, and the Guardian's optional checks pass, a [VAA](#verified-actions-approvals-vaa) is produced.

There might be a fee _in the future_ for publishing a message.

#### Receive

```solidity
parseAndVerifyVAA( byte[] VAA )
```

When called, the payload and associated metadata for the valid VAA is returned. Otherwise, an exception is thrown.

#### Consistency Levels

By default, only finalized messages are observed and attested. [See the other available consistency levels](https://book.wormhole.com/wormhole/3_coreLayerContracts.html#consistency-levels) if the integration require messages before finality.

#### Multi-cast

VAAs simply attest that "this contract on this chain said this thing." Therefore, VAAs are multicast by default and will be verified as authentic on any chain they are brought to.

Use cases where the message has an intended recipient or is only meant to be consumed a single time must be handled in logic outside the Core Contract.

#### Verified Actions Approvals (VAA)

### All Bridge

#### Send Transaction

Called by the sender wallet with the target address and amount of token to be sent.

[Fees are paid here](https://docs.allbridge.io/allbridge-overview/bridge-fee).

#### Receive Transaction

Can be called by the receiving wallet address or by the all bridge sender on some chains.

If using the all bridge sender, user will receive some gas token if the receiving wallet does not have any on [some chains](https://docs.allbridge.io/allbridge-overview/under-the-hood-of-allbridge#bonuses-value-for-chains)

### Circle Cross-Chain Transfer Protocol (CCTP)

#### depositForBurn

```typescript
const burnTx = await ethTokenMessengerContract.methods
  .depositForBurn(
    amount,
    AVAX_DESTINATION_DOMAIN,
    destinationAddressInBytes32,
    USDC_ETH_CONTRACT_ADDRESS
  )
  .send();
```

#### Poll for attestation

```typescript
const transactionReceipt = await web3.eth.getTransactionReceipt(
  burnTx.transactionHash
);
const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
const messageBytes = web3.eth.abi.decodeParameters(["bytes"], log.data)[0];
const messageHash = web3.utils.keccak256(messageBytes);

let attestationResponse = { status: "pending" };
while (attestationResponse.status != "complete") {
  const response = await fetch(
    `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
  );
  attestationResponse = await response.json();
  await new Promise((r) => setTimeout(r, 2000));
}
```

#### receiveMessage

```typescript
const receiveTx = await avaxMessageTransmitterContract.receiveMessage(
  receivingMessageBytes,
  signature
);
```

#### Limitations

- Currently only on Avax and Eth.
- Unclear what Solana integration would look like

## API overview

Developers interact directly with a high level BridgeSdk that abstracts away the underlying implementation for the various bridge implementation.

Ideally, developers should not even care about what adapter they are using. They should just get the best bridge rate for the asset they are trying to bridge.

### Goals

- Developer can allow users to easily bridge assets from one chain to another within their app
- Developers can easily get users to pay them from tokens on other chain while still receiving the expected assets on the target chain

### End User vanilla JS SDK usage details

```typescript
const sdk = new BridgeSdk({
        // this should be optional
        adapter: new WormholeBridge({
            sourceChain: '',
            targetChain: ''
        })
    });
// strongly typed, dynamic based on Bridge adapter, sourceChain, and targetChain
// some strongly typed object as return type
const supportedTokens = sdk.getSupportedTokens()

/**
 * {
 *  amountInBaseUnits: BigInt,
 *  decimals: '',
 *  symbol: '',
 *  name: '',
 *  tokenContractAddress: '',
 * }
*/
const bridgeFeeDetails = await sdk.getBridgeFeeDetails({
    token: supportedTokens.SOME_TOKEN,
    amountInBaseUnits: 102n,
})

// what should the return be?
await sdk.bridge({
    token: supportedTokens.SOME_TOKEN,
    amountInBaseUnits: '',

    // type should be dynamic based on sourceChain
    sourceAccount: PublicKey() | ethers.Signer | viem Account | string
    // This is called whenever the sourceAccount is a string and the bridge process is about to be initiated
    // TODO: figure out return type
    onInitiateBridge?: async (sourceAccount: string, sourceChain: Chains) => Promise<void>,

    // type should be dynamic based on targetChain
    targetAccount: PublicKey() | ethers.Signer | viem Account | string,
    // This will trigger whenever target account is a string and the funds are ready for the developer to be received
    // TODO: figure out return type
    onReadyToReceiveBridgedTokens?: async (targetAccount: string, targetChain: Chains) => Promise<void>,

    // number between 0 and 100, detail contains message on what just happened
    // message should be a list of enum // object dynamic based on the Bridge adapter if possible
    onProgressUpdate: (progress: number, detail: BridgeDetails) => void //optional
})
```

### End User React SDK Usage

This will render a button that will open a modal to provide all the bridging functionality that users would need to bridge funds natively within the developers dApp.

```typescript
export function HomePage() {
  return (
    <BridgeModal
      // all params are optional
      sourceChain={}
      targetChain={}
      sourceAccount={}
      onInitiateBridge={}
      targetAccount={}
      onReadyToReceiveBridgedTokens={}
      token={}
      amountInBaseUnits={}
      onBridgeSuccess={}
      onBridgeError={}
      onBridgeModalClose={}
    />
  );
}
```

### Bridge Adapter

The bridge adapter provides information on:

- Supported tokens
- Fees for the bridging operation
- A way to lock assets on the source chain
- A way to receive assets on the target chain

```typescript
class AbstractBridgeAdapter {
  progressMessages: Record<string, string>;
  sourceChain: Chains;
  targetChain: Chains;

  // if we don't make this async, the bridge might support new tokens not hardcoded and we have to update the sdk
  // if we make this async, we are very likely not going to be able to return the proper list of enums of the supported token
  abstract getSupportedTokens(): Tokens;

  abstract getFeeDetails(args: {
    token: Token;
    amountInBaseUnits: BigInt;
  }): Promise<{
    amountInBaseUnits: BigInt;
    decimals: number;
    symbol: string;
    name: string;
    tokenContractAddress: string;
  }>;

  abstract lock(args: {
    token: Token;
    amountInBaseUnits: BigInt;
    // type should be dynamic based on sourceChain
    sourceAccount: PublicKey | ethers.Signer | viem.Account;
    // type should be dynamic based on targetChain
    targetAccount: PublicKey | ethers.Signer | viem.Account;
    // number between 0 and 100, detail contains message on what just happened
    // message should be a list of enum // object dynamic based on the Bridge adapter if possible
    onProgressUpdate: (progress: number, detail: BridgeDetails) => void; //optional
  }): Promise<void>;
  // TODO: figure out return type

  abstract receive(
    targetAccount: PublicKey | ethers.Signer | viem.Account
  ): Promise<void>;
  // TODO: figure out return type
}
```
