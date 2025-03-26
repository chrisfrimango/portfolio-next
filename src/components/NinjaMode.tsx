"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePortfolioStore } from "@/store/portfolio-store";

export default function NinjaMode() {
  const store = usePortfolioStore();
  const [buttonName, setButtonName] = useState("Ninja Mode off");

  useEffect(() => {
    setButtonName(store.ninjaMode ? "Ninja Mode on" : "Ninja Mode off");
  }, [store.ninjaMode]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={store.toggleNinjaMode}
      className={`
        w-[140px] text-xs font-mono uppercase px-2
        text-black hover:text-white
        ${store.ninjaMode ? "text-[#ff3b00]" : ""}
      `}
    >
      {buttonName}
    </Button>
  );
}
