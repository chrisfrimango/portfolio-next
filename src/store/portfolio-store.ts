import { create } from "zustand";

interface PortfolioState {
  countWhileLoading: number;
  transitionFinished: boolean;
  ninjaMode: boolean;
  decreaseCount: () => void;
  setTransitionFinished: (finished: boolean) => void;
  toggleNinjaMode: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  countWhileLoading: 30,
  transitionFinished: false,
  ninjaMode: false,
  decreaseCount: () =>
    set((state) => ({
      countWhileLoading: state.countWhileLoading - 1,
    })),
  setTransitionFinished: (finished) =>
    set({
      transitionFinished: finished,
    }),
  toggleNinjaMode: () =>
    set((state) => ({
      ninjaMode: !state.ninjaMode,
    })),
}));
