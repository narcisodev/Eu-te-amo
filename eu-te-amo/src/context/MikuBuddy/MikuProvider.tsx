import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { MikuContext } from "./MikuContext";
import { MIKU_REACTIONS, type MikuReaction } from "./MikuTypes";

const DEFAULT_DURATIONS: Record<MikuReaction, number> = {
  [MIKU_REACTIONS.IDLE]: 3000,
  [MIKU_REACTIONS.HAPPY]: 5000,
  [MIKU_REACTIONS.THINKING]: 4000,
  [MIKU_REACTIONS.DANCING]: 7000,
  [MIKU_REACTIONS.DANCING_MINECRAFT]: 7000,
  [MIKU_REACTIONS.PUNCH]: 3000,
  [MIKU_REACTIONS.SKELETON]: 3000,
};

export const MikuProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [reaction, setReaction] = useState<MikuReaction>(MIKU_REACTIONS.IDLE);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMikuTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const triggerMiku = useCallback(
    (msg: string, react: MikuReaction, duration?: number) => {
      clearMikuTimeout();
      setMessage(msg);
      setReaction(react);

      const finalDuration = duration ?? DEFAULT_DURATIONS[react];

      if (finalDuration > 0) {
        timeoutRef.current = setTimeout(() => {
          setMessage(null);
          setReaction(MIKU_REACTIONS.IDLE);
          timeoutRef.current = null;
        }, finalDuration);
      }
    },
    [clearMikuTimeout],
  );

  useEffect(() => {
    return () => clearMikuTimeout();
  }, [clearMikuTimeout]);

  return (
    <MikuContext.Provider value={{ triggerMiku, message, reaction }}>
      {children}
    </MikuContext.Provider>
  );
};
