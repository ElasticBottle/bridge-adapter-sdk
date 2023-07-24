import type {
  BridgeAdapterSdkArgs,
  ChainDestType,
  TokenWithAmount,
} from "@elasticbottle/core-bridge-adapter-sdk";
import { BridgeAdapterSdk } from "@elasticbottle/core-bridge-adapter-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnect } from "wagmi";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_TOKEN_WITH_AMOUNT } from "../constants/Token";
import { getEvmAvailableWallets } from "../lib/utils";
import type {
  BridgeStep,
  BridgeStepParams,
  ChainSelectionType,
  SetCurrentBridgeStepType,
} from "../types/BridgeModal";

type BridgeModalState = {
  sdk: BridgeAdapterSdk;
  previousBridgeStep: BridgeStep[];
  previousBridgeStepParams: BridgeStepParams<BridgeStep>[];
  currentBridgeStep: BridgeStep;
  currentBridgeStepParams: BridgeStepParams<BridgeStep>;
  chain: { sourceChain: ChainSelectionType; targetChain: ChainSelectionType };
  token: { sourceToken: TokenWithAmount; targetToken: TokenWithAmount };
};

type SetChain = {
  newChain: ChainSelectionType;
  chainDestination: ChainDestType;
  isEvmWalletConnected: boolean;
  connectEvmWallet: ReturnType<typeof useConnect>["connectAsync"];
  availableEvmWallets: ReturnType<typeof useConnect>["connectors"];
  isSolanaWalletConnected: boolean;
  availableSolanaWallets: ReturnType<typeof useWallet>["wallets"];
};

type BridgeModalActions = {
  setSdkSettings: (args: BridgeAdapterSdkArgs) => void;
  setCurrentBridgeStep: <T extends BridgeStep>(
    args: SetCurrentBridgeStepType<T>
  ) => void;
  setChain: (args: SetChain) => Promise<void>;
  setToken: (token: TokenWithAmount, chainDest: ChainDestType) => Promise<void>;
  goBackOneStep: () => void;
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

const useBridgeModalStoreBase = create<BridgeModalState>()(
  devtools(
    immer<BridgeModalState>(() => {
      return {
        sdk: new BridgeAdapterSdk(),
        previousBridgeStep: [],
        currentBridgeStep: "MULTI_CHAIN_SELECTION",
        previousBridgeStepParams: [],
        currentBridgeStepParams: undefined,
        chain: {
          sourceChain: "Select a chain",
          targetChain: "Select a chain",
        },
        token: {
          sourceToken: DEFAULT_TOKEN_WITH_AMOUNT,
          targetToken: DEFAULT_TOKEN_WITH_AMOUNT,
        },
      };
    })
  )
);
export const useBridgeModalStore = createSelectors(useBridgeModalStoreBase);

/** ACTIONS */
export const setCurrentBridgeStep: BridgeModalActions["setCurrentBridgeStep"] =
  (args) => {
    useBridgeModalStore.setState((state) => {
      state.previousBridgeStep.push(state.currentBridgeStep);
      state.previousBridgeStepParams.push(state.currentBridgeStepParams);

      state.currentBridgeStep = args.step;
      if ("params" in args) {
        state.currentBridgeStepParams = args.params;
      }
    });
  };

export const goBackOneStep: BridgeModalActions["goBackOneStep"] = () => {
  useBridgeModalStore.setState((state) => {
    const previousBridgeStep = state.previousBridgeStep.pop();
    const previousBridgeStepParams = state.previousBridgeStepParams.pop();
    if (previousBridgeStep === undefined) {
      throw new Error("No previous step");
    }
    state.currentBridgeStep = previousBridgeStep;
    state.currentBridgeStepParams = previousBridgeStepParams;
  });
};

const clearChain = (chainDest: ChainDestType) => {
  useBridgeModalStore.setState((state) => {
    if (chainDest === "source") {
      if (state.token.sourceToken.chain === state.chain.sourceChain) {
        return;
      }
      if (state.token.sourceToken.isBridgeToken) {
        state.token.targetToken = DEFAULT_TOKEN_WITH_AMOUNT;
      }
      state.token.sourceToken = DEFAULT_TOKEN_WITH_AMOUNT;
    } else if (chainDest === "target") {
      if (state.token.targetToken.chain === state.chain.targetChain) {
        return;
      }
      if (state.token.targetToken.isBridgeToken) {
        state.token.targetToken = DEFAULT_TOKEN_WITH_AMOUNT;
      }
      state.token.targetToken = DEFAULT_TOKEN_WITH_AMOUNT;
    }
  });
};

export const setChain: BridgeModalActions["setChain"] = async ({
  newChain,
  chainDestination,
  isEvmWalletConnected,
  availableEvmWallets,
  connectEvmWallet,
  isSolanaWalletConnected,
  availableSolanaWallets,
}) => {
  const chainParam =
    chainDestination === "source" ? "sourceChain" : "targetChain";
  const updateChain = () => {
    useBridgeModalStore.setState((state) => {
      state.chain[chainParam] = newChain;
    });
    clearChain(chainDestination);
  };

  if (newChain === "Solana") {
    if (isSolanaWalletConnected) {
      updateChain();
      return goBackOneStep();
    } else if (
      !isSolanaWalletConnected &&
      availableSolanaWallets.length === 1
    ) {
      await availableSolanaWallets[0].adapter.connect();
      updateChain();
      return goBackOneStep();
    }
  } else if (newChain !== "Select a chain") {
    // evm chains
    if (isEvmWalletConnected) {
      updateChain();
      return goBackOneStep();
    } else if (
      !isEvmWalletConnected &&
      getEvmAvailableWallets(availableEvmWallets) === 1
    ) {
      await connectEvmWallet({
        connector: availableEvmWallets[0],
      });
      updateChain();
      return goBackOneStep();
    }
  } else if (newChain === "Select a chain") {
    updateChain();
    return goBackOneStep();
  }

  setCurrentBridgeStep({
    step: "WALLET_SELECTION",
    params: {
      chain: newChain,
      onSuccess() {
        useBridgeModalStore.setState((state) => {
          state.chain[chainParam] = newChain;
        });
        setCurrentBridgeStep({
          step: "MULTI_CHAIN_SELECTION",
        });
      },
    },
  });
};

export const setBridgeAdapterSdkSettings: BridgeModalActions["setSdkSettings"] =
  (args) => {
    useBridgeModalStore.setState((state) => {
      state.sdk = new BridgeAdapterSdk(args);
    });
  };

export const setToken: BridgeModalActions["setToken"] = async (
  token,
  chainDest
) => {
  useBridgeModalStore.setState((state) => {
    if (chainDest === "source") {
      state.token.sourceToken = token;
      if (token.isBridgeToken) {
        state.token.targetToken = {
          ...token,
          address: token.targetAddress,
          chain: token.targetChain,
          decimals: token.targetDecimals,
        };
      }
    } else if (chainDest === "target") {
      state.token.targetToken = token;

      if (token.isBridgeToken) {
        state.token.sourceToken = {
          ...token,
          address: token.sourceAddress,
          chain: token.sourceChain,
          decimals: token.sourceDecimals,
        };
      }
    }
  });
  setCurrentBridgeStep({
    step: "MULTI_CHAIN_SELECTION",
  });
  if (token.isBridgeToken) {
    setCurrentBridgeStep({
      step: "SINGLE_CHAIN_SELECTION",
      params: {
        chainDest: chainDest === "source" ? "target" : "source",
        autoConnectToChain:
          chainDest === "source" ? token.targetChain : token.sourceChain,
      },
    });
  }
};
