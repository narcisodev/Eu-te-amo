import type { ComponentType } from "react";

import ReasonsLove from "../components/Apps/Reasons Love/ReasonsLove";
import Quiz from "../components/Apps/Quiz/Quiz";
import Computer from "../components/Apps/My Computer/MyComputer";

import reasonsIcon from "../assets/icons/love.png";
import quizIcon from "../assets/icons/quiz.ico";
import computerIcon from "../assets/icons/my-computer-icon.ico";
import wmpIcon from "../assets/icons/media-player.png";
import timelineIcon from "../assets/icons/timeline.ico";
import Timeline from "../components/Apps/Timeline/Timeline";
import Notepad from "../components/Apps/Notepad/Notepad";
import notepadIcon from "../assets/icons/notepad.ico";

export type AppKeys =
  | "reasons"
  | "quiz"
  | "computer"
  | "wmp"
  | "timeline"
  | "notepad";

export interface BaseAppProps {
  onClose?: () => void;
}

export interface AppConfig {
  id: AppKeys;
  label: string;
  title: string;
  icon: string;

  Component: ComponentType<BaseAppProps>;

  resizable?: boolean;
}

export const APPS: AppConfig[] = [
  {
    id: "computer",
    label: "Meu Computador",
    title: "Meu Computador",
    icon: computerIcon,
    Component: Computer,
    resizable: true,
  },
  {
    id: "reasons",
    label: "Motivos",
    title: "Motivos Para Te Amar",
    icon: reasonsIcon,
    Component: ReasonsLove,
    resizable: true,
  },
  {
    id: "quiz",
    label: "Quiz do Amor",
    title: "Quiz do Amor",
    icon: quizIcon,
    Component: Quiz,
    resizable: true,
  },
  {
    id: "timeline",
    label: "Linha do Tempo",
    title: "Linha do Tempo",
    icon: timelineIcon,
    Component: Timeline,
    resizable: true,
  },
  {
    id: "notepad",
    label: "Bloco de Notas",
    title: "Bloco de Notas",
    icon: notepadIcon,
    Component: Notepad,
    resizable: true,
  },
  {
    id: "wmp",
    label: "Media Player",
    title: "Windows Media Player",
    icon: wmpIcon,
    Component: () => null,
    resizable: true,
  },
];
