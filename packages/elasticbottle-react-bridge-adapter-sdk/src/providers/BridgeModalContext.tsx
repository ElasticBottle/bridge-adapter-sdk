import type { useWallet } from "@solana/wallet-adapter-react";
import type { useConnect } from "wagmi";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chainNameToChainId, getEvmAvailableWallets } from "../lib/utils";
import type {
  BridgeStep,
  BridgeStepParams,
  ChainDestType,
  ChainSelectionType,
  SetCurrentBridgeStepType,
} from "../types/BridgeModal";

type BridgeModalState = {
  previousBridgeStep: BridgeStep[];
  previousBridgeStepParams: BridgeStepParams<BridgeStep>[];
  currentBridgeStep: BridgeStep;
  currentBridgeStepParams: BridgeStepParams<BridgeStep>;
  chain: { sourceChain: ChainSelectionType; targetChain: ChainSelectionType };
};

type setChainType = {
  newChain: ChainSelectionType;
  chainDestination: ChainDestType;
  isEvmWalletConnected: boolean;
  connectEvmWallet: ReturnType<typeof useConnect>["connectAsync"];
  availableEvmWallets: ReturnType<typeof useConnect>["connectors"];
  isSolanaWalletConnected: boolean;
  availableSolanaWallets: ReturnType<typeof useWallet>["wallets"];
};

type BridgeModalActions = {
  setCurrentBridgeStep: <T extends BridgeStep>(
    args: SetCurrentBridgeStepType<T>
  ) => void;
  setChain: (args: setChainType) => Promise<void>;
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
        previousBridgeStep: [],
        currentBridgeStep: "MULTI_CHAIN_SELECTION",
        previousBridgeStepParams: [],
        currentBridgeStepParams: undefined,
        chain: {
          sourceChain: "No chain selected",
          targetChain: "No chain selected",
        },
      };
    })
  )
);
export const useBridgeModalStore = createSelectors(useBridgeModalStoreBase);

/** ACTIONS */
export const setCurrentBridgeStep: BridgeModalActions["setCurrentBridgeStep"] =
  (args) => {
    useBridgeModalStore.setState((state: BridgeModalState) => {
      state.previousBridgeStep.push(state.currentBridgeStep);
      state.previousBridgeStepParams.push(state.currentBridgeStepParams);

      state.currentBridgeStep = args.step;
      if ("params" in args) {
        state.currentBridgeStepParams = args.params;
      }
    });
  };

export const goBackOneStep: BridgeModalActions["goBackOneStep"] = () => {
  useBridgeModalStore.setState((state: BridgeModalState) => {
    const previousBridgeStep = state.previousBridgeStep.pop();
    const previousBridgeStepParams = state.previousBridgeStepParams.pop();
    if (previousBridgeStep === undefined) {
      throw new Error("No previous step");
    }
    state.currentBridgeStep = previousBridgeStep;
    state.currentBridgeStepParams = previousBridgeStepParams;
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
  const updateChain = () =>
    useBridgeModalStore.setState((state: BridgeModalState) => {
      state.chain[chainParam] = newChain;
    });

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
  } else if (newChain !== "No chain selected") {
    // evm chains
    if (isEvmWalletConnected) {
      updateChain();
      return goBackOneStep();
    } else if (
      !isEvmWalletConnected &&
      getEvmAvailableWallets(availableEvmWallets) === 1
    ) {
      await connectEvmWallet({
        chainId: chainNameToChainId(newChain),
        connector: availableEvmWallets[0],
      });
      updateChain();
      return goBackOneStep();
    }
  } else if (newChain === "No chain selected") {
    updateChain();
    return goBackOneStep();
  }

  setCurrentBridgeStep({
    step: "WALLET_SELECTION",
    params: {
      chain: newChain,
      onSuccess() {
        useBridgeModalStore.setState((state: BridgeModalState) => {
          state.chain[chainParam] = newChain;
        });
        setCurrentBridgeStep({
          step: "MULTI_CHAIN_SELECTION",
        });
      },
    },
  });
};
