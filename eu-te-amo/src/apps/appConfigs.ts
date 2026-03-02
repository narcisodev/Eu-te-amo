import React from "react";
import MeuComputador from "../components/Apps/My Computer/MyComputer";
import LoveQuiz from "../components/Quiz/Quiz";
import WindowsMediaPlayer from "../components/Windows Media Player/WindowsMediaPlayer";

import myComputerIcon from "../assets/icons/my-computer-icon.png";
import loveIcon from "../assets/icons/love.png";
import audioIcon from "../assets/icons/audio.png";

export type AppKeys = "meuComputador" | "quiz" | "wmp";

export interface AppConfig {
  id: AppKeys;
  label: string;
  title: string;
  icon: string;
  Component: React.ComponentType<Record<string, unknown>>;
}

export const APPS: AppConfig[] = [
  {
    id: "meuComputador",
    label: "Meu Computador",
    title: "Meu Computador",
    icon: myComputerIcon,
    Component: MeuComputador as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: "quiz",
    label: "Quiz de Amor",
    title: "Quiz de Amor",
    icon: loveIcon,
    Component: LoveQuiz as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: "wmp",
    label: "Media Player",
    title: "Windows Media Player",
    icon: audioIcon,
    Component: WindowsMediaPlayer as unknown as React.ComponentType<
      Record<string, unknown>
    >,
  },
];
