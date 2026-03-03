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
import mikuDancingPixelArt from "../../assets/mikuBuddy/miku-dance-pixel-art.gif";
import mikuDancing2 from "../../assets/mikuBuddy/miku-dance.gif";
import mikuDancing3 from "../../assets/mikuBuddy/hatsune-miku-dance.gif";
import mikuOuiaCat from "../../assets/mikuBuddy/ouia-cat.gif";

interface MikuBuddyProps {
  isDancing: boolean;
}

const SKELETON_CHANCE = 0.1;
const SKELETON_DURATION = 2700;
const SKELETON_INSTANCES = 2;
const OUIACAT_DURATION = 4000;

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
  MIKU_REACTIONS.DANCING_PIXELART,
  MIKU_REACTIONS.DANCING_2,
  MIKU_REACTIONS.DANCING_3,
];

// O Konami Code Tradicional
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const MikuBuddy = ({ isDancing }: MikuBuddyProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { message, reaction, triggerMiku } = useMiku();

  const wasDancingRef = useRef(false);
  const lastDanceRef = useRef<MikuReaction | null>(null);

  const reactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeAudiosRef = useRef<HTMLAudioElement[]>([]);
  const keySequenceRef = useRef<string[]>([]);

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

  const playOuiaCatSound = useCallback(() => {
    stopAllAudio();

    const audio = new Audio("/audio/ouia-cat.mp3");
    audio.volume = 1;
    audio.play().catch(() => {});

    activeAudiosRef.current = [audio];

    audioTimeoutRef.current = setTimeout(() => {
      stopAllAudio();
    }, OUIACAT_DURATION);

    return OUIACAT_DURATION;
  }, [stopAllAudio]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keySequenceRef.current = [...keySequenceRef.current, key];

      if (keySequenceRef.current.length > KONAMI_CODE.length) {
        keySequenceRef.current.shift();
      }

      const isKonamiMatch = keySequenceRef.current.every(
        (val, index) => val === KONAMI_CODE[index],
      );

      if (
        keySequenceRef.current.length === KONAMI_CODE.length &&
        isKonamiMatch
      ) {
        keySequenceRef.current = [];

        if (reactionTimeoutRef.current) {
          clearTimeout(reactionTimeoutRef.current);
        }

        const ouia_duration = playOuiaCatSound();

        triggerMiku("", MIKU_REACTIONS.OUIA_CAT, ouia_duration);

        reactionTimeoutRef.current = setTimeout(() => {
          triggerMiku("", MIKU_REACTIONS.IDLE, 0);
        }, ouia_duration);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playOuiaCatSound, triggerMiku]);

  /* ===========================
     🎭 Escolher Dança Variada
  =========================== */

  const getRandomDance = useCallback((): MikuReaction => {
    let next =
      DANCE_VARIATIONS[Math.floor(Math.random() * DANCE_VARIATIONS.length)];

    if (next === lastDanceRef.current) {
      next =
        DANCE_VARIATIONS.find((d) => d !== lastDanceRef.current) ??
        MIKU_REACTIONS.DANCING;
    }

    lastDanceRef.current = next;
    return next;
  }, []);

  /* ===========================
     🛑 Quando Para de Dançar
  =========================== */

  const handleStopDancing = useCallback(() => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }

    // Não interrompe o easter egg do Ouia Cat se ele estiver tocando
    if (reaction === MIKU_REACTIONS.OUIA_CAT) return;

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
  }, [playSkeletonSound, triggerMiku, reaction]);

  useEffect(() => {
    if (isDancing && reaction === MIKU_REACTIONS.IDLE) {
      const dance = getRandomDance();
      triggerMiku("", dance, 0);
    }
  }, [isDancing, reaction, triggerMiku, getRandomDance]);

  useEffect(() => {
    if (isDancing && !wasDancingRef.current) {
      wasDancingRef.current = true;

      // Se estiver tocando o easter egg, não para o som!
      if (reaction !== MIKU_REACTIONS.OUIA_CAT) {
        stopAllAudio();
      }

      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
      }

      if (reaction !== MIKU_REACTIONS.OUIA_CAT) {
        const dance = getRandomDance();
        triggerMiku("", dance, 0);
      }

      return;
    }

    if (!isDancing && wasDancingRef.current) {
      wasDancingRef.current = false;
      handleStopDancing();
    }

    return () => {
      // stopAllAudio(); // Removi daqui pro OuiaCat não bugar se o player pausar/dar play no fundo
    };
  }, [
    isDancing,
    triggerMiku,
    handleStopDancing,
    stopAllAudio,
    getRandomDance,
    reaction,
  ]);

  const reactionAssets: Record<MikuReaction, string> = {
    [MIKU_REACTIONS.IDLE]: mikuIdle,
    [MIKU_REACTIONS.HAPPY]: mikuHappy,
    [MIKU_REACTIONS.THINKING]: mikuIdle,
    [MIKU_REACTIONS.DANCING]: mikuDancing,
    [MIKU_REACTIONS.DANCING_MINECRAFT]: mikuDancingMinecraft,
    [MIKU_REACTIONS.PUNCH]: mikuPunch,
    [MIKU_REACTIONS.SKELETON]: skeleton,
    [MIKU_REACTIONS.DANCING_PIXELART]: mikuDancingPixelArt,
    [MIKU_REACTIONS.DANCING_2]: mikuDancing2,
    [MIKU_REACTIONS.DANCING_3]: mikuDancing3,
    // Adicionado o Sprite do Ouia Cat
    [MIKU_REACTIONS.OUIA_CAT]: mikuOuiaCat,
  };

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
          src={reactionAssets[reaction] || mikuIdle}
          alt="Miku Assistant"
          draggable="false"
        />
      </div>
    </Draggable>
  );
};

export default MikuBuddy;
