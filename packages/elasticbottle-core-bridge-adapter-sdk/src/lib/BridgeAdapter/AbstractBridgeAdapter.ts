import type {
  BridgeAdapterArgs,
  BridgeStatus,
  Bridges,
  SolanaOrEvmAccount,
} from "../../types/Bridges";
import type { ChainName, ChainSourceAndTarget } from "../../types/Chain";
import type { ChainDestType } from "../../types/ChainDest";
import type { SwapInformation } from "../../types/SwapInformation";
import type { Token } from "../../types/Token";

export abstract class AbstractBridgeAdapter {
  protected sourceChain: ChainName | undefined;
  protected targetChain: ChainName | undefined;
  protected settings: BridgeAdapterArgs["settings"];
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
  }): Promise<void>;
}
