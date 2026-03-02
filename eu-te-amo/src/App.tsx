import { useEffect, useRef, useState } from "react";
import DesktopIcon from "./components/Desktop Icon/DesktopIcon";
import WindowsXPWindow from "./components/Windows XP/WindowsXPWindow";
import Taskbar from "./components/Taskbar/Taskbar";
import { APPS, type AppKeys } from "./apps/appConfigs";

import styles from "./App.module.css";
import BootScreen from "./components/Boot Screen/BootScreen";
import WelcomeScreen from "./components/Welcome Screen/WelcomeScreen";

export default function App() {
  const [activeAppIds, setActiveAppIds] = useState<AppKeys[]>([]);

  const openApp = (id: AppKeys) => {
    if (!activeAppIds.includes(id)) {
      setActiveAppIds((prev) => [...prev, id]);
    }
  };

  const closeApp = (id: AppKeys) => {
    setActiveAppIds((prev) => prev.filter((appId) => appId !== id));
  };

  const [stage, setStage] = useState<"boot" | "welcome" | "desktop">("boot");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/windows-xp-boot.mp3");
    audioRef.current.load();
  }, []);

  const startStartupSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) =>
          console.error(
            "Erro ao tocar som (provavelmente bloqueio de autoplay):",
            e,
          ),
        );
    }
  };

  const handleLogin = () => {
    startStartupSound();
    setStage("desktop");
  };

  if (stage === "boot") {
    return <BootScreen onFinish={() => setStage("welcome")} />;
  }

  if (stage === "welcome") {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  return (
    <div className={styles.background}>
      <main className={styles.desktop}>
        <div className={styles.iconGrid}>
          {APPS.map((app) => (
            <DesktopIcon
              key={app.id}
              label={app.label}
              iconUrl={app.icon}
              onDoubleClick={() => openApp(app.id)}
            />
          ))}
        </div>

        {APPS.filter((app) => activeAppIds.includes(app.id)).map((app) => {
          const Content = app.Component;
          return (
            <WindowsXPWindow
              key={app.id}
              title={app.title}
              onClose={() => closeApp(app.id)}
            >
              <Content />
            </WindowsXPWindow>
          );
        })}
      </main>

      <Taskbar openedApps={activeAppIds} onOpenApp={openApp} />
    </div>
  );
}
