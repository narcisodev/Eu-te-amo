export const MIKU_REACTIONS = {
  IDLE: "idle",
  HAPPY: "happy",
  THINKING: "thinking",
  DANCING: "dancing",
  DANCING_MINECRAFT: "dancing-minecraft",
  PUNCH: "punch",
  SKELETON: "skeleton",
} as const;

export type MikuReaction = (typeof MIKU_REACTIONS)[keyof typeof MIKU_REACTIONS];

export interface MikuContextType {
  triggerMiku: (msg: string, react: MikuReaction, duration?: number) => void;
  message: string | null;
  reaction: MikuReaction;
}
