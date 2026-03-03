import { createContext, useContext } from "react";
import type { MikuContextType } from "./MikuTypes";

export const MikuContext = createContext<MikuContextType | undefined>(
  undefined,
);

export const useMiku = () => {
  const context = useContext(MikuContext);
  if (!context) {
    throw new Error("useMiku deve ser usado dentro de um MikuProvider");
  }
  return context;
};
