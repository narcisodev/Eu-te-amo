import { useEffect, useRef, useState } from "react";
import DesktopIcon from "./components/Desktop Icon/DesktopIcon";
import WindowsXPWindow from "./components/Windows XP/WindowsXPWindow";
import Taskbar from "./components/Taskbar/Taskbar";
import BootScreen from "./components/Boot Screen/BootScreen";
import WelcomeScreen from "./components/Welcome Screen/WelcomeScreen";
import WindowsMediaPlayer from "./components/Windows Media Player/WindowsMediaPlayer";
import MikuBuddy from "./components/Miku Buddy/MikuBuddy";

import { MikuProvider } from "./context/MikuBuddy/MikuProvider";
import { useMiku } from "./context/MikuBuddy/MikuContext";
import { MIKU_REACTIONS } from "./context/MikuBuddy/MikuTypes";

import { APPS, type AppKeys } from "./apps/appConfigs";
import styles from "./App.module.css";

import videoIcon from "./assets/icons/audio.png";

interface MusicData {
  src: string;
  title: string;
  subtitle: string;
}

function DesktopContent() {
  const [stage, setStage] = useState<"boot" | "welcome" | "desktop">("boot");

  const [openedAppIds, setOpenedAppIds] = useState<AppKeys[]>([]);
  const [minimizedAppIds, setMinimizedAppIds] = useState<AppKeys[]>([]);
  const [focusedAppId, setFocusedAppId] = useState<AppKeys | null>(null);

  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { triggerMiku } = useMiku();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Boot sound
  useEffect(() => {
    audioRef.current = new Audio("/audio/windows-xp-boot.mp3");
    audioRef.current.load();
  }, []);

  // ---------------------------
  // APP CONTROLS
  // ---------------------------

  const openApp = (id: AppKeys) => {
    if (id === "wmp" && !currentMusic) {
      triggerMiku("Escolha uma música primeiro!", MIKU_REACTIONS.THINKING);
      return;
    }

    setOpenedAppIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

    setMinimizedAppIds((prev) => prev.filter((appId) => appId !== id));

    setFocusedAppId(id);
  };

  const closeApp = (id: AppKeys) => {
    setOpenedAppIds((prev) => prev.filter((appId) => appId !== id));

    setMinimizedAppIds((prev) => prev.filter((appId) => appId !== id));

    if (focusedAppId === id) {
      setFocusedAppId(null);
    }

    if (id === "wmp") {
      setCurrentMusic(null);
      setIsVideoPlaying(false);
    }
  };

  const toggleMinimize = (id: AppKeys) => {
    setMinimizedAppIds((prev) => {
      const isMinimized = prev.includes(id);

      if (isMinimized) {
        setFocusedAppId(id);
        return prev.filter((appId) => appId !== id);
      }

      setFocusedAppId(null);
      return [...prev, id];
    });
  };

  const handleOpenMusic = (data: MusicData) => {
    setCurrentMusic(data);

    setOpenedAppIds((prev) => (prev.includes("wmp") ? prev : [...prev, "wmp"]));

    setMinimizedAppIds((prev) => prev.filter((appId) => appId !== "wmp"));

    setFocusedAppId("wmp");
  };

  const handleLogin = () => {
    audioRef.current?.play().catch(() => {});
    setStage("desktop");

    setTimeout(() => {
      triggerMiku("Bem-vinda meu amor!", MIKU_REACTIONS.HAPPY);
    }, 1500);
  };

  // ---------------------------
  // STAGES
  // ---------------------------

  if (stage === "boot") {
    return <BootScreen onFinish={() => setStage("welcome")} />;
  }

  if (stage === "welcome") {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  // ---------------------------
  // DESKTOP
  // ---------------------------

  const isMikuDancing =
    openedAppIds.includes("wmp") &&
    !minimizedAppIds.includes("wmp") &&
    currentMusic !== null &&
    isVideoPlaying;

  return (
    <div className={styles.background}>
      <main className={styles.desktop}>
        <div className={styles.iconGrid}>
          {APPS.filter((app) => app.id !== "wmp").map((app) => (
            <DesktopIcon
              key={app.id}
              label={app.label}
              iconUrl={app.icon}
              onDoubleClick={() => openApp(app.id)}
            />
          ))}

          <DesktopIcon
            label="Miku - Ievan Polkka"
            iconUrl={videoIcon}
            onDoubleClick={() =>
              handleOpenMusic({
                src: "/video/miku-Ievan-polkka.mp4",
                title: "Miku - Ievan Polkka",
                subtitle: "/vtt/miku-Ievan-polkka.vtt",
              })
            }
          />
        </div>

        {APPS.filter((app) => openedAppIds.includes(app.id)).map((app) => {
          const isWMP = app.id === "wmp";

          if (isWMP && !currentMusic) return null;

          return (
            <WindowsXPWindow
              key={app.id}
              title={isWMP ? "Media Player" : app.title}
              icon={app.icon}
              onClose={() => closeApp(app.id)}
              onMinimize={() => toggleMinimize(app.id)}
              isActive={focusedAppId === app.id}
              onFocus={() => setFocusedAppId(app.id)}
              isMinimized={minimizedAppIds.includes(app.id)}
              resizable={app.resizable}
            >
              {isWMP && currentMusic ? (
                <WindowsMediaPlayer
                  src={currentMusic.src}
                  title={currentMusic.title}
                  subtitle={currentMusic.subtitle}
                  onPlayingChange={setIsVideoPlaying}
                />
              ) : (
                <app.Component />
              )}
            </WindowsXPWindow>
          );
        })}

        <MikuBuddy isDancing={isMikuDancing} />
      </main>

      <Taskbar
        openedApps={openedAppIds}
        onOpenApp={openApp}
        onToggleMinimize={toggleMinimize}
        focusedAppId={focusedAppId}
      />
    </div>
  );
}

export default function App() {
  return (
    <MikuProvider>
      <DesktopContent />
    </MikuProvider>
  );
}
