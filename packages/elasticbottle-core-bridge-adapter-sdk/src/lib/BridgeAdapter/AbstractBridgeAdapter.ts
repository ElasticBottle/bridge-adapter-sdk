import type {
  BridgeStatus,
  Bridges,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { QuoteInformation } from "../../types/QuoteInformation";
import type { Token, TokenWithAmount } from "../../types/Token";

export abstract class AbstractBridgeAdapter {
  sourceChain: ChainName | undefined;
  targetChain: ChainName | undefined;
  constructor({ sourceChain, targetChain }: Partial<ChainSourceAndTarget>) {
    this.sourceChain = sourceChain;
    this.targetChain = targetChain;
  }
  abstract name(): Bridges;

  abstract getSupportedChains(): Promise<ChainName[]>;

  abstract getSupportedTokens(
    interestedTokenList: ChainDestType,
    chains?: Partial<ChainSourceAndTarget>,
    tokens?: { sourceToken: Token; targetToken: Token }
  ): Promise<Token[]>;

  abstract getRouteDetails(
    sourceToken: Token,
    targetToken: Token
  ): Promise<QuoteInformation>;

  abstract bridge({
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
  }): Promise<void>;
}
