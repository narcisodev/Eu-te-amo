export const MIKU_REACTIONS = {
  IDLE: "idle",
  HAPPY: "happy",
  THINKING: "thinking",
  DANCING: "dancing",
  DANCING_MINECRAFT: "dancing-minecraft",
  PUNCH: "punch",
  SKELETON: "skeleton",
  OUIA_CAT: "ouia-cat",
  DANCING_PIXELART: "dancing-pixelart",
  DANCING_2: "dancing-2",
  DANCING_3: "dancing-3",
} as const;

export type MikuReaction = (typeof MIKU_REACTIONS)[keyof typeof MIKU_REACTIONS];

export interface MikuContextType {
  triggerMiku: (msg: string, react: MikuReaction, duration?: number) => void;
  message: string | null;
  reaction: MikuReaction;
}
