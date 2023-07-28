import { approveEth, getAllowanceEth } from "@certusone/wormhole-sdk";
import {
  array,
  boolean,
  merge,
  number,
  object,
  omit,
  optional,
  parse,
  string,
  url,
} from "valibot";
import type {
  BridgeStatus,
  Bridges,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { Token, TokenWithAmount } from "../../types/Token";
import { isEvmAccount } from "../../utils/bridge";
import {
  chainIdToChainName,
  chainNameToChainId,
} from "../../utils/chainIdMapping";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { walletClientToSigner } from "../../utils/viem/ethers";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class DeBridgeBridgeAdapter extends AbstractBridgeAdapter {
  private supportedChains: ChainName[] = [];
  private tokenList: Record<string, Token[]> = {};
  private TokenSchema = object({
    symbol: string(),
    name: string(),
    decimals: number(),
    address: string(),
    logoURI: string([url()]),
  });
  private TokenListSchema = array(this.TokenSchema);
  private TokenObjectSchema = object({
    tokens: this.TokenListSchema,
  });
  private deBridgeEvmFee = "0xb3E9C57fB983491416a0C77b07629C0991c3FD59";
  private deBridgeSolanaFee = "3uAfBoHB1cTyB7H8G2KTpSgZS1T1ME4bHb8uqzqhWsfe";

  private QuoteSchema = object({
    estimation: object({
      srcChainTokenIn: merge([
        omit(this.TokenSchema, "logoURI" as any),
        object({
          chainId: number(),
          amount: string(),
          mutatedWithOperatingExpense: boolean(),
          approximateOperatingExpense: string(),
        }),
      ]),
      srcChainTokenOut: merge([
        omit(this.TokenSchema, "logoURI" as any),
        object({
          chainId: number(),
          amount: string(),
          maxRefundAmount: string(),
        }),
      ]),
      dstChainTokenOut: merge([
        omit(this.TokenSchema, "logoURI" as any),
        object({
          chainId: number(),
          amount: string(),
          recommendedAmount: string(),
        }),
      ]),
    }),
    tx: optional(
      object({
        allowanceTarget: string(),
        allowanceAmount: optional(string()),
      })
    ),
    order: object({
      approximateFulfillmentDelay: number(),
    }),
    fixFee: string(),
  });
  constructor(args: Partial<ChainSourceAndTarget>) {
    super(args);
  }

  name(): Bridges {
    return "deBridge";
  }
  async getSupportedChains(): Promise<ChainName[]> {
    if (!this.supportedChains.length) {
      console.log("fetching debridge chain");
      const chainsResp = await fetch(
        "https://api.dln.trade/v1.0/supported-chains"
      );
      if (!chainsResp.ok) {
        throw new Error("Failed to fetch supported chains");
      }
      const chains = await chainsResp.json();
      if (!(chains instanceof Array)) {
        throw new Error("Invalid response from server");
      }

      const chainNames = chains
        .map((chainId: number) => chainIdToChainName(chainId))
        .filter(
          (chainName: ChainName | undefined): chainName is ChainName =>
            !!chainName
        );
      this.supportedChains = chainNames.concat(["Solana"]);
    }
    return this.supportedChains;
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
    const chainId = chainNameToChainId(chain);
    if (!this.tokenList[chain]) {
      if (chain === "Solana") {
        console.log("fetching debridge Solana token list");
        const solanaTokenListUrl = new URL("https://cache.jup.ag/tokens");
        const solanaTokenListResp = await fetch(solanaTokenListUrl);
        if (!solanaTokenListResp.ok) {
          throw new Error("Failed to fetch token list");
        }
        const solanaTokenListRaw = await solanaTokenListResp.json();
        const solanaTokenList = parse(this.TokenListSchema, solanaTokenListRaw);
        this.tokenList[chain] = solanaTokenList.map((token) => {
          return {
            bridgeName: "deBridge",
            chain,
            logoUri: token.logoURI,
            address: token.address,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
          };
        });
      } else {
        console.log("fetching debridge EVM token list");
        const tokenListUrl = new URL("https://api.dln.trade/v1.0/token-list");
        tokenListUrl.searchParams.set("chainId", chainId.toString());
        const tokenListResp = await fetch(tokenListUrl);
        if (!tokenListResp.ok) {
          throw new Error("Failed to fetch token list");
        }
        const tokenListRaw = await tokenListResp.json();

        const tokenList = parse(this.TokenObjectSchema, tokenListRaw);
        this.tokenList[chain] = tokenList.tokens.map((token) => {
          return {
            bridgeName: "deBridge",
            chain,
            logoUri: token.logoURI,
            address: token.address,
            decimals: token.decimals,
            name: token.name,
            symbol: token.symbol,
          };
        });
      }
    }
    return this.tokenList[chain];
  }

  async getRouteDetails(
    sourceToken: TokenWithAmount,
    targetToken: Token
  ): Promise<any> {
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

    const quoteUrl = new URL("https://api.dln.trade/v1.0/dln/order/quote");
    quoteUrl.searchParams.set(
      "srcChainId",
      chainNameToChainId(sourceToken.chain).toString()
    );
    quoteUrl.searchParams.set("srcChainTokenIn", sourceToken.address);
    quoteUrl.searchParams.set(
      "srcChainTokenInAmount",
      sourceToken.selectedAmountInBaseUnits
    );
    quoteUrl.searchParams.set(
      "dstChainId",
      chainNameToChainId(targetToken.chain).toString()
    );
    quoteUrl.searchParams.set("dstChainTokenOut", targetToken.address);
    quoteUrl.searchParams.set("prependOperatingExpense", "true");
    quoteUrl.searchParams.set("affiliateFeePercent", "0.05");
    const quoteResp = await fetch(quoteUrl);
    if (!quoteResp.ok) {
      throw new Error("Failed to fetch quote");
    }
    const quoteRaw = await quoteResp.json();
    const quote = parse(this.QuoteSchema, quoteRaw);
    return quote;
  }

  private async createDebridgeTransaction() {
    const createTxUrl = new URL(
      "https://api.dln.trade/v1.0/dln/order/create-tx?"
    );
    createTxUrl.searchParams.set("fee", this.deBridgeEvmFee);
    const createTxResp = await fetch(createTxUrl);
    if (!createTxResp.ok) {
      throw new Error("Failed to create transaction");
    }
    const createTxRaw = createTxResp.json();
  }

  private async getDebridgeTransactionId(txnHash: string) {
    const getTxIdUrl = new URL(
      `https://api.dln.trade/v1.0/dln/tx/${txnHash}/order-ids`
    );
    const getTxIdResp = await fetch(getTxIdUrl);
    if (!getTxIdResp.ok) {
      throw new Error("Failed to get transaction id");
    }
    const getTxIdRaw = getTxIdResp.json();
    const txnId = parse(object({ orderIds: array(string()) }), getTxIdRaw);
    return txnId.orderIds[0];
  }
  private async getDebridgeTransactionStatus(txnId: string) {
    const txnStatusUrl = new URL(
      `https://api.dln.trade/v1.0/dln/order/${txnId}/status`
    );
    const txnStatusResp = await fetch(txnStatusUrl);
    if (!txnStatusResp.ok) {
      throw new Error("Failed to get transaction id");
    }
    const txnStatusRaw = txnStatusResp.json();
    const txnStatus = parse(
      object({ orderId: string(), status: string() }),
      txnStatusRaw
    );
    return txnStatus.status;
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
    const quote = await this.getRouteDetails(sourceToken, targetToken);

    if (sourceToken.chain !== "Solana") {
      if (!isEvmAccount(sourceAccount)) {
        throw new Error("Source account is not an EVM account");
      }
      if (quote.tx?.allowanceAmount && quote.tx?.allowanceTarget) {
        // handle approval
        const ethersSigner = walletClientToSigner(sourceAccount);
        const allowance = await getAllowanceEth(
          quote.tx?.allowanceTarget,
          sourceToken.address,
          ethersSigner
        );
        if (allowance.lt(quote.tx?.allowanceAmount)) {
          await approveEth(
            quote.tx.allowanceTarget,
            sourceToken.address,
            ethersSigner,
            quote.tx.allowanceAmount
          );
        }
      }

      const tx = await this.createDebridgeTransaction();
    } else {
      const tx = await this.createDebridgeTransaction();
    }
  }
}
