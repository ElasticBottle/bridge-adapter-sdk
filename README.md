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
  - Ethereum
  - Polygon
  - Solana
  - Arbitrum
  - Optimism
  - Binance Smart Chain
  - Avalanche
- 🌉 3 different bridges with 2 in the works
  - Wormhole
  - DeBridge
  - Mayan Finance
  - Allbridge Core (in pipeline)
  - Allbridge Classic (planning)
- 🦄 3 different DEXes supported for swapping to and from the token used during bridging.
  - Paraswap (EVM)
  - 1inch (EVM)
  - Jupiter (Solana)
  - Prism (Solana)
- 🌙 Light and Dark Mode.
- 📃 Composable with existing decentralized applications today.
- 🙍‍♂️ Great DX for developers. Integration is a couple lines of code and easy to understand.

## API overview

As a developer, you can choose to interact directly with the core SDK in vanilla JS or with the higher level abstracted react SDK. This guide covers both.

### End User vanilla JS SDK usage details

#### Initializing the SDK

```typescript
const sdk = new BridgeAdapterSdk();
```

#### Getting supported chains

```typescript
const chains = await sdk.getSupportedChains(); // ['Ethereum', 'Avalanche', 'Solana', ...]
```

#### Getting supported tokens

```typescript
// getting tokens to swap from
const tokens = await sdk.getSupportedTokens(
  "source",
  {
    sourceChain,
    targetChain, //optional
  },
  {
    sourceToken, // optional
    targetToken, // optional
  }
);
const tokens = await sdk.getSupportedTokens(
  "target",
  {
    sourceChain, //optional
    targetChain,
  },
  {
    sourceToken, // optional
    targetToken, // optional
  }
);

// type Token = {
//     logoUri: string;
//     name: string;
//     symbol: string;
//     address: string;
//     chain: ChainName;
//     decimals: number;
//     bridgeNames: Bridges[];
// };
console.log("tokens", tokens); // of type Token[]
```

#### Getting a swap quote

```typescript
const routeInfo = await sdk.getSwapInformation(sourceToken, targetToken);

// type SwapInformation = {
//     sourceToken: TokenWithAmount;
//     targetToken: TokenWithExpectedOutput;
//     bridgeName: string;
//     tradeDetails: {
//         fee: FeeToken[];
//         priceImpact: number;
//         estimatedTimeMinutes: number;
//         routeInformation: {
//             fromTokenSymbol: string;
//             toTokenSymbol: string;
//         }[];
//     };
// };
console.log("routeInfo", routeInfo);
```

#### Bridging the Assets

```typescript
const isSuccess = sdk.bridge({
  sourceAccount,
  targetAccount,
  swapInformation, // this is from sdk.getSwapInformation above
  onStatusUpdate,
});
```

### End User React SDK Usage

The main goal of the React SDK is to provider a handler that will attach itself to a button to start the modal flow

Here's how the user experience looks like

![gif of cross chain bridge flow](https://github.com/thirdweb-dev/paper-web/assets/44563205/d74dec9a-2dad-41be-a7b9-cb202e2eb05e)

#### Vanilla Integration of React swap modal

```typescript
export function HomePage() {
  const adapters = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  return (
    <SolanaWalletProvider wallets={adapters} autoConnect={false}>
      <EvmWalletProvider
        settings={{
          coinbaseWalletSettings: {
            appName: "Example Defi Dapp",
          },
          walletConnectProjectId:
            process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
        }}
      >
        <BridgeModalProvider>
          <BridgeModal
            customization={{
              theme: "dark",
              modalTitle: "Defi Dapp",
            }}
          >
            <Button
              size="sm"
              type="button"
              className="mt-8 w-full hover:bg-zinc-400"
            >
              Subscribe
            </Button>
          </BridgeModal>
        </BridgeModalProvider>
      </EvmWalletProvider>
    </SolanaWalletProvider>
  );
}
```

#### Integrating with existing applications

If your application already uses `wagmi` or `"@solana/wallet-adapter-react`, the `bridge-adapter-sdk` works out of the box with it

In particular, you simply omit `EvmWalletProvider` or `SolanaWalletProvider` respectively. You will still need to wrap the BridgeModalProvider`which provides information on the bridge sdk settings to be used`

### Bridge Developer

The bridge adapter provides information on:

- Supported tokens
- A way to get a swap route between two asset on similar or different chains
- A way to instantiate the bridging process while having insights on what's happening

Here's a minimal interface that's needed in order to add support for your bridge

```typescript
export abstract class AbstractBridgeAdapter {
  constructor({ sourceChain, targetChain, settings }: BridgeAdapterArgs) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
    this.settings = settings;
  }

  abstract name(): Bridges;

  abstract getSupportedChains(): Promise<ChainName[]>;

  abstract getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>,
    tokens?: { sourceToken: Token; targetToken: Token }
  ): Promise<Token[]>;

  abstract getQuoteDetails(
    sourceToken: Token,
    targetToken: Token
  ): Promise<SwapInformation>;

  abstract bridge({
    onStatusUpdate,
    sourceAccount,
    targetAccount,
    swapInformation,
  }: {
    swapInformation: SwapInformation;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus) => void;
  }): Promise<boolean>;
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
