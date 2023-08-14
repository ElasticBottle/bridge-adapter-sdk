# Bridge Adapter SDK

## Problem

Today's liquidity is highly fragmented. With more chains popping up than ever, it is increasingly hard for a developer to ensure that the incoming user will have the necessary funds needed to interact with the protocol or application.

Additional work has to be taken to provide instructions on how to bridge assets over. Or in the case of the ambitious developer, integrate a bridge with obscure tokens that have little liquidity.

## Solution

To solve this, this bridge adapter SDK does two things. The first is to leverage the existing bridges of today and provide a unified framework for interacting with them. Instead of having to integrate bridges 1 by 1, one simply needs to integrate this sdk to get the benefit of multiple bridges. The second is to leverage existing DEXes to open up the total pool of tokens that can be swapped with.

Developers simply integrate a single SDK and get the combined benefits of the existing bridges and swaps that exists today.

## Features

- ✅ Easily allow users within your app to bridge assets from one chain to another.
- 🔗 7 chains supported.
- 🌉 3 different bridges with 2 in the works
- 🦄 3 different DEXes supported for swapping to and from the token used during bridging.
- 🌙 Light and Dark Mode.
- 📃 Composable with existing decentralized applications today.
- 🙍‍♂️ Great DX for developers. Integration is a couple lines of code and easy to understand.

## API overview

As a developer, you can choose to interact directly with the core SDK in vanilla JS or with the higher level abstracted react SDK. This guide covers both.

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

    // Is this enough for Solana.
    // You might need the owner and the token account.

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

    onError: () => void
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

## Local development

To start developing, simply run `pnpm dev`. This will build all the packages in watch mode as well as spin up a local development server with the react sdk which uses the js sdk under the hood.

### Building

Run `pnpm build` to confirm compilation is working correctly. You should see a folder `acme-core/dist` which contains the compiled output.

```bash
acme-core
└── dist
    ├── index.d.ts  <-- Types
    ├── index.js    <-- CommonJS version
    └── index.mjs   <-- ES Modules version
```

### Versioning & Publishing Packages

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm.

<!-- TODO: install the [Changesets bot](https://github.com/apps/changeset-bot) on the repository. -->

#### Generating the Changelog

To generate your changelog, run `pnpm changeset` locally:

1. **Which packages would you like to include?** – This shows which packages and changed and which have remained the same. By default, no packages are included. Press `space` to select the packages you want to include in the `changeset`.
1. **Which packages should have a major bump?** – Press `space` to select the packages you want to bump versions for.
1. If doing the first major version, confirm you want to release.
1. Write a summary for the changes.
1. Confirm the changeset looks as expected.
1. A new Markdown file will be created in the `changeset` folder with the summary and a list of the packages included.

#### Releasing

When you push your code to GitHub, the [GitHub Action](https://github.com/changesets/action) will run the `release` script defined in the root `package.json`:

```bash
turbo run build && changeset publish
```

Turborepo runs the `build` script for all publishable packages (excluding docs) and publishes the packages to npm.
