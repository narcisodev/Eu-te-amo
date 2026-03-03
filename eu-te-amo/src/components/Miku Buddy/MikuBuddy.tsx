import { useRef, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import { useMiku } from "../../context/MikuBuddy/MikuContext";
import {
  MIKU_REACTIONS,
  type MikuReaction,
} from "../../context/MikuBuddy/MikuTypes";
import styles from "./styles.module.css";

import mikuIdle from "../../assets/mikuBuddy/miku-hatsune.gif";
import mikuHappy from "../../assets/mikuBuddy/miku-happy.gif";
import mikuDancing from "../../assets/mikuBuddy/miku-balacing.gif";
import mikuDancingMinecraft from "../../assets/mikuBuddy/miku-dancing-minecraft.gif";
import mikuPunch from "../../assets/mikuBuddy/miku-punch.gif";
import skeleton from "../../assets/mikuBuddy/mad-skeleton.gif";

interface MikuBuddyProps {
  isDancing: boolean;
}

/* ===========================
   CONFIG
=========================== */

const SKELETON_CHANCE = 0.1;
const SKELETON_DURATION = 2700;
const SKELETON_INSTANCES = 2;

const STOP_DANCING_PHRASES = [
  "Eiii!! Por que parou?!",
  "Eu tava me divertindo!!",
  "Assim do nada?!",
  "Volta a música agora!!",
  "Que injusto!!",
];

const DANCE_VARIATIONS = [
  MIKU_REACTIONS.DANCING,
  MIKU_REACTIONS.DANCING_MINECRAFT,
];

const MikuBuddy = ({ isDancing }: MikuBuddyProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { message, reaction, triggerMiku } = useMiku();

  const wasDancingRef = useRef(false);
  const lastDanceRef = useRef<MikuReaction | null>(null);

  const reactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeAudiosRef = useRef<HTMLAudioElement[]>([]);

  /* ===========================
     🔊 Stop All Audio
  =========================== */

  const stopAllAudio = useCallback(() => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }

    activeAudiosRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    activeAudiosRef.current = [];
  }, []);

  /* ===========================
     🔊 Play Skeleton
  =========================== */

  const playSkeletonSound = useCallback(() => {
    stopAllAudio();

    const audios: HTMLAudioElement[] = [];

    for (let i = 0; i < SKELETON_INSTANCES; i++) {
      const audio = new Audio("/audio/skeleton.mp3");
      audio.volume = 1;
      audio.play().catch(() => {});
      audios.push(audio);
    }

    activeAudiosRef.current = audios;

    audioTimeoutRef.current = setTimeout(() => {
      stopAllAudio();
    }, SKELETON_DURATION);
  }, [stopAllAudio]);

  /* ===========================
     🎭 Escolher Dança Variada
  =========================== */

  const getRandomDance = (): MikuReaction => {
    let next =
      DANCE_VARIATIONS[Math.floor(Math.random() * DANCE_VARIATIONS.length)];

    // evita repetir a mesma dança
    if (next === lastDanceRef.current) {
      next =
        DANCE_VARIATIONS.find((d) => d !== lastDanceRef.current) ??
        MIKU_REACTIONS.DANCING;
    }

    lastDanceRef.current = next;
    return next;
  };

  /* ===========================
     🛑 Quando Para de Dançar
  =========================== */

  const handleStopDancing = useCallback(() => {
    const shouldSkeleton = Math.random() < SKELETON_CHANCE;

    if (shouldSkeleton) {
      playSkeletonSound();

      triggerMiku("AUGGHHHH 💀", MIKU_REACTIONS.SKELETON, SKELETON_DURATION);

      reactionTimeoutRef.current = setTimeout(() => {
        triggerMiku("", MIKU_REACTIONS.IDLE, 0);
      }, SKELETON_DURATION);
    } else {
      const randomComplaint =
        STOP_DANCING_PHRASES[
          Math.floor(Math.random() * STOP_DANCING_PHRASES.length)
        ];

      triggerMiku(randomComplaint, MIKU_REACTIONS.PUNCH, 2500);

      reactionTimeoutRef.current = setTimeout(() => {
        triggerMiku("", MIKU_REACTIONS.IDLE, 0);
      }, 3000);
    }
  }, [playSkeletonSound, triggerMiku]);

  /* ===========================
     🎵 Effect Principal
  =========================== */

  useEffect(() => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }

    // 🎵 Está dançando
    if (isDancing) {
      wasDancingRef.current = true;

      stopAllAudio();

      const dance = getRandomDance();
      triggerMiku("", dance, 0);

      return;
    }

    // 🛑 Parou de dançar
    if (wasDancingRef.current) {
      wasDancingRef.current = false;
      handleStopDancing();
    }

    return () => {
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
      }
      stopAllAudio();
    };
  }, [isDancing, triggerMiku, handleStopDancing, stopAllAudio]);

  /* ===========================
     SPRITES
  =========================== */

  const reactionAssets: Record<MikuReaction, string> = {
    [MIKU_REACTIONS.IDLE]: mikuIdle,
    [MIKU_REACTIONS.HAPPY]: mikuHappy,
    [MIKU_REACTIONS.THINKING]: mikuIdle,
    [MIKU_REACTIONS.DANCING]: mikuDancing,
    [MIKU_REACTIONS.DANCING_MINECRAFT]: mikuDancingMinecraft,
    [MIKU_REACTIONS.PUNCH]: mikuPunch,
    [MIKU_REACTIONS.SKELETON]: skeleton,
  };

  /* ===========================
     RENDER
  =========================== */

  return (
    <Draggable nodeRef={nodeRef} bounds="parent">
      <div ref={nodeRef} className={styles.mikuWrapper}>
        {message && (
          <div className={styles.speechBubble}>
            <span>{message}</span>
          </div>
        )}

        <img
          className={styles.mikuSprite}
          src={reactionAssets[reaction]}
          alt="Miku Assistant"
          draggable="false"
        />
      </div>
    </Draggable>
  );
};

export default MikuBuddy;
