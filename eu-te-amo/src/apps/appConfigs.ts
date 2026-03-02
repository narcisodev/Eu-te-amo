import MeuComputador from "../components/Apps/My Computer/MyComputer";
import myComputer from "../assets/icons/my-computer-icon.png";
import LoveQuiz from "../components/Quiz/Quiz";

export type AppKeys = "meuComputador" | "quiz";

export interface AppConfig {
  id: AppKeys;
  label: string;
  title: string;
  icon: string;
  Component: React.ComponentType;
}

export const APPS: AppConfig[] = [
  {
    id: "meuComputador",
    label: "Meu Computador",
    title: "Meu Computador",
    icon: myComputer,
    Component: MeuComputador,
  },
  {
    id: "quiz",
    label: "Quiz de Amor",
    title: "Quiz de Amor",
    icon: myComputer,
    Component: LoveQuiz,
  },
];
