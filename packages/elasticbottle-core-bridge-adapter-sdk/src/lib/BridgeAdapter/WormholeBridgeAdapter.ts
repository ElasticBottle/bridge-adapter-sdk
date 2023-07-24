import { csv2json, parseValue } from "csv42";
import { CHAIN_NAMES } from "../../constants/ChainNames";
import type { Bridges } from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { BridgeToken, Token, TokenWithAmount } from "../../types/Token";
import { getSourceAndTargetChain } from "../../utils/getSourceAndTargetChain";
import { AbstractBridgeAdapter } from "./AbstractBridgeAdapter";

export class WormholeBridgeAdapter extends AbstractBridgeAdapter {
  private tokenList: BridgeToken[] = [];

  constructor(args: Partial<ChainSourceAndTarget>) {
    super(args);
  }
  name(): Bridges {
    return "wormhole";
  }
  getSupportedChains(): Promise<ChainName[]> {
    return Promise.resolve([
      "Ethereum",
      "Solana",
      "Polygon",
      "Mumbai",
      "Goerli",
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
    if (this.tokenList.length === 0) {
      const tokenList = await fetch(
        "https://raw.githubusercontent.com/certusone/wormhole-token-list/main/content/by_dest.csv"
      );
      if (!tokenList.ok) {
        throw new Error("Failed to fetch token list");
      }
      const csv = await tokenList.text();
      const token: BridgeToken[] = csv2json(csv, {
        fields: [
          {
            name: "address",
            setValue(item, value) {
              item.targetAddress = value;
            },
          },
          {
            name: "sourceAddress",
            setValue(item, value) {
              item.sourceAddress = value;
            },
          },
          {
            name: "name",
            setValue(item, value) {
              item.name = value;
            },
          },
          {
            name: "symbol",
            setValue(item, value) {
              item.symbol = value;
            },
          },
          {
            name: "logo",
            setValue(item, value) {
              item.logoUri = value;
            },
          },
          {
            name: "decimals",
            setValue(item, value) {
              if (typeof value === "string") {
                item.targetDecimals = parseInt(value);
              } else if (typeof value === "number") {
                item.targetDecimals = value;
              } else {
                item.targetDecimals = 0;
              }
            },
          },
          {
            name: "sourceDecimals",
            setValue(item, value) {
              if (typeof value === "string") {
                item.sourceDecimals = parseInt(value);
              } else if (typeof value === "number") {
                item.sourceDecimals = value;
              } else {
                item.sourceDecimals = 0;
              }
            },
          },
          {
            name: "origin",
            setValue(item, value) {
              if (value === "sol") {
                item.sourceChain = "Solana";
              } else if (value === "eth") {
                item.sourceChain = "Ethereum";
              } else if (value === "matic") {
                item.sourceChain = "Polygon";
              } else {
                item.sourceChain = value;
              }
            },
          },
          {
            name: "dest",
            setValue(item, value) {
              if (value === "sol") {
                item.targetChain = "Solana";
              } else if (value === "eth") {
                item.targetChain = "Ethereum";
              } else if (value === "matic") {
                item.targetChain = "Polygon";
              } else {
                item.targetChain = value;
              }
            },
          },
        ],
        parseValue: (value) => {
          if (value.startsWith("0x")) {
            return value;
          }
          return parseValue(value);
        },
      });
      this.tokenList = token;
    }

    let filteredToken = this.tokenList;
    if (source) {
      filteredToken = filteredToken.filter(
        (token) =>
          token.sourceChain.toLowerCase() === source.toLowerCase() &&
          CHAIN_NAMES.includes(token.targetChain)
      );
    }
    if (target) {
      filteredToken = filteredToken.filter(
        (token) =>
          token.targetChain.toLowerCase() === target.toLowerCase() &&
          CHAIN_NAMES.includes(token.sourceChain)
      );
    }

    if (interestedTokenList === "source") {
      return filteredToken.map((token) => {
        return {
          address: token.sourceAddress,
          chain: token.sourceChain,
          decimals: token.sourceDecimals,
          isBridgeToken: true,
          ...token,
        };
      });
    } else if (interestedTokenList === "target") {
      return filteredToken.map((token) => {
        return {
          address: token.targetAddress,
          chain: token.targetChain,
          decimals: token.targetDecimals,
          isBridgeToken: true,
          ...token,
        };
      });
    }
    throw new Error("Invalid interestedTokenList value");
  }

  getFeeDetails(
    chains?: Partial<ChainSourceAndTarget> | undefined
  ): Promise<
    Omit<TokenWithAmount, "userAmountInBaseUnits" | "userAmountFormatted">
  > {
    const { source, target } = getSourceAndTargetChain({
      overrideSourceChain: chains?.sourceChain,
      overrideTargetChain: chains?.targetChain,
      sdkSourceChain: this.sourceChain,
      sdkTargetChain: this.targetChain,
    });
    throw new Error("Method not implemented.");
  }
  lock(
    args: {
      token: Token;
      amountToSwapInBaseUnits: bigint;
      sourceAccount: string;
      targetAccount: string;
    } & Partial<ChainSourceAndTarget>
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  receive(targetAccount: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
