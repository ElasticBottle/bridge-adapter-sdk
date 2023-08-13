import type {
  ChainName as MayanChainName,
  Quote,
} from "@mayanfinance/swap-sdk";
import {
  fetchQuote,
  fetchTokenList,
  swapFromEvm,
  swapFromSolana,
} from "@mayanfinance/swap-sdk";
import { parseUnits } from "viem";
import type {
  BridgeStatus,
  Bridges,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { QuoteInformation } from "../../types/QuoteInformation";
import type { Token, TokenWithAmount } from "../../types/Token";
import { isEvmAccount, isSolanaAccount } from "../../utils/bridge";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { getWalletAddress } from "../../utils/getWalletAddress";
import {
  getPublicClientFromWallet,
  publicClientToProvider,
  walletClientToSigner,
} from "../../utils/viem/ethers";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class MayanBridgeAdapter extends AbstractBridgeAdapter {
  private tokenList: Record<string, Token[]> = {};
  private mayanQuote: Quote | undefined;
  private mayanSolanaFee = "3uAfBoHB1cTyB7H8G2KTpSgZS1T1ME4bHb8uqzqhWsfe";

  constructor(args: Partial<ChainSourceAndTarget>) {
    super(args);
  }

  name(): Bridges {
    return "deBridge";
  }
  async getSupportedChains(): Promise<ChainName[]> {
    return Promise.resolve([
      "Solana",
      "BSC",
      "Arbitrum",
      "Ethereum",
      "Polygon",
      "Avalanche",
    ]);
  }

  async getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget> | undefined
  ): Promise<Token[]> {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: super.sourceChain,
      sdkTargetChain: super.targetChain,
      chainChecks: {
        needEitherChain: true,
      },
    });
    const chain = interestedTokenList === "source" ? source : target;
    if (!chain) {
      throw new Error(`Missing chain for ${interestedTokenList}`);
    }
    const supportedChainList = await this.getSupportedChains();
    if (!supportedChainList.includes(chain)) {
      throw new Error(`Chain ${chain} is not supported by ${this.name()}`);
    }
    if (!this.tokenList[chain]) {
      console.log("fetching Mayan Solana token list");
      const tokenList = await fetchTokenList(
        chain.toLowerCase() as MayanChainName
      );
      this.tokenList[chain] = tokenList.map((token) => {
        return {
          bridgeNames: ["mayan"],
          chain,
          logoUri: token.logoURI,
          address: chain === "Solana" ? token.mint : token.contract,
          decimals: token.decimals,
          name: token.name,
          symbol: token.symbol,
        };
      });
    }
    return this.tokenList[chain];
  }

  async getRouteDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token
  ): Promise<QuoteInformation> {
    const supportedChainList = await this.getSupportedChains();
    if (
      !supportedChainList.includes(sourceToken.chain) ||
      !supportedChainList.includes(targetToken.chain)
    ) {
      throw new Error(
        `The source token's chain ${
          sourceToken.chain
        } or the target token's chain ${
          targetToken.chain
        } is not supported by ${this.name()}`
      );
    }

    const quote = await fetchQuote({
      amount: parseFloat(sourceToken.selectedAmountFormatted),
      fromToken: sourceToken.address,
      toToken: targetToken.address,
      fromChain: sourceToken.chain.toLowerCase() as MayanChainName,
      toChain: targetToken.chain.toLowerCase() as MayanChainName,
      slippage: 3,
      gasDrop: 0, // optional
      referrer: this.mayanSolanaFee,
    });
    console.log("quote", quote);
    this.mayanQuote = quote;
    return {
      sourceToken: sourceToken,
      targetToken: {
        ...targetToken,
        expectedOutputFormatted: quote.expectedAmountOut.toString(),
        expectedOutputInBaseUnits: parseUnits(
          quote.expectedAmountOut.toString(),
          targetToken.decimals
        ).toString(),
        minOutputFormatted: quote.minAmountOut.toString(),
        minOutputInBaseUnits: parseUnits(
          quote.minAmountOut.toString(),
          targetToken.decimals
        ).toString(),
      },
      bridgeName: this.name(),
      tradeDetails: {
        priceImpact: quote.priceImpact,
        estimatedTimeMinutes: quote.eta,
        fee: {
          ...sourceToken,
          selectedAmountFormatted: quote.swapRelayerFee.toString(),
          selectedAmountInBaseUnits: parseUnits(
            quote.swapRelayerFee.toString(),
            sourceToken.decimals
          ).toString(),
        },
        routeInformation: [],
      },
    };
  }

  async bridge({
    onStatusUpdate,
    sourceAccount,
    targetAccount,
    sourceToken,
    targetToken,
  }: {
    sourceToken: TokenWithAmount;
    targetToken: TokenWithAmount;
    sourceAccount: SolanaOrEvmAccount;
    targetAccount: SolanaOrEvmAccount;
    onStatusUpdate: (args: BridgeStatus[]) => void;
  }): Promise<void> {
    if (!this.mayanQuote) {
      throw new Error("No quote found");
    }

    const timoutInSeconds = 300;

    if (sourceToken.chain !== "Solana") {
      if (!isEvmAccount(sourceAccount)) {
        throw new Error("Source account is not an EVM account");
      }
      const swapTrx = await swapFromEvm(
        this.mayanQuote,
        getWalletAddress(targetAccount),
        timoutInSeconds,
        this.mayanSolanaFee,
        publicClientToProvider(getPublicClientFromWallet(sourceAccount)),
        walletClientToSigner(sourceAccount)
      );
      console.log("evm swapTrx", swapTrx);
    } else {
      if (!isSolanaAccount(sourceAccount)) {
        throw new Error("Source account is not a Solana account");
      }
      const swapTrx = await swapFromSolana(
        this.mayanQuote,
        getWalletAddress(sourceAccount),
        getWalletAddress(targetAccount),
        timoutInSeconds,
        this.mayanSolanaFee,
        sourceAccount.signTransaction
      );
      console.log("solana swapTrx", swapTrx);
    }
  }
}
