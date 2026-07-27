"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface IntroState {
  /** True once the intro (preloader) has finished or was skipped. */
  introDone: boolean;
  finishIntro: () => void;
}

// Default assumes no intro on the page (standalone routes render instantly)
const IntroContext = createContext<IntroState>({
  introDone: true,
  finishIntro: () => {},
});

export const useIntro = () => useContext(IntroContext);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  return (
    <IntroContext.Provider value={{ introDone, finishIntro }}>
      {children}
    </IntroContext.Provider>
  );
}
