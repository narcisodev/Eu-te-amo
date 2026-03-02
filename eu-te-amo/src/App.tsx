import { useEffect, useRef, useState } from "react";
import DesktopIcon from "./components/Desktop Icon/DesktopIcon";
import WindowsXPWindow from "./components/Windows XP/WindowsXPWindow";
import Taskbar from "./components/Taskbar/Taskbar";
import BootScreen from "./components/Boot Screen/BootScreen";
import WelcomeScreen from "./components/Welcome Screen/WelcomeScreen";
import WindowsMediaPlayer from "./components/Windows Media Player/WindowsMediaPlayer";
import videoIcon from "./assets/icons/audio.png";
import wmpTaskbarIcon from "./assets/icons/media-player.png";

import { APPS, type AppKeys } from "./apps/appConfigs";
import styles from "./App.module.css";

interface MusicData {
  src: string;
  title: string;
  subtitle: string;
}

export default function App() {
  const [stage, setStage] = useState<"boot" | "welcome" | "desktop">("boot");
  const [openedAppIds, setOpenedAppIds] = useState<AppKeys[]>([]);
  const [minimizedAppIds, setMinimizedAppIds] = useState<AppKeys[]>([]);
  const [focusedAppId, setFocusedAppId] = useState<AppKeys | null>(null);
  const [currentMusic, setCurrentMusic] = useState<MusicData | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/windows-xp-boot.mp3");
    audioRef.current.load();
  }, []);

  const openApp = (id: AppKeys) => {
    if (id === "wmp" && !currentMusic) return;
    if (!openedAppIds.includes(id)) {
      setOpenedAppIds((prev) => [...prev, id]);
    }
    setMinimizedAppIds((prev) => prev.filter((appId) => appId !== id));
    setFocusedAppId(id);
  };

  const closeApp = (id: AppKeys) => {
    setOpenedAppIds((prev) => prev.filter((appId) => appId !== id));
    setMinimizedAppIds((prev) => prev.filter((appId) => appId !== id));
    if (focusedAppId === id) setFocusedAppId(null);
    if (id === "wmp") setCurrentMusic(null);
  };

  const toggleMinimize = (id: AppKeys) => {
    const isMinimized = minimizedAppIds.includes(id);
    if (isMinimized) {
      setMinimizedAppIds((prev) => prev.filter((appId) => appId !== id));
      setFocusedAppId(id);
    } else if (focusedAppId === id) {
      setMinimizedAppIds((prev) => [...prev, id]);
      setFocusedAppId(null);
    } else {
      setFocusedAppId(id);
    }
  };

  const handleOpenMusic = (data: MusicData) => {
    setCurrentMusic(data);
    if (!openedAppIds.includes("wmp")) {
      setOpenedAppIds((prev) => [...prev, "wmp"]);
    }
    setMinimizedAppIds((prev) => prev.filter((appId) => appId !== "wmp"));
    setFocusedAppId("wmp");
  };

  const handleLogin = () => {
    audioRef.current?.play().catch(() => {});
    setStage("desktop");
  };

  if (stage === "boot")
    return <BootScreen onFinish={() => setStage("welcome")} />;
  if (stage === "welcome") return <WelcomeScreen onLogin={handleLogin} />;

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

          const windowIcon = isWMP ? wmpTaskbarIcon : app.icon;
          const windowTitle = isWMP ? "Media Player" : app.title;

          return (
            <WindowsXPWindow
              key={app.id}
              title={windowTitle}
              icon={windowIcon}
              onClose={() => closeApp(app.id)}
              onMinimize={() => toggleMinimize(app.id)}
              isActive={focusedAppId === app.id}
              onFocus={() => setFocusedAppId(app.id)}
              isMinimized={minimizedAppIds.includes(app.id)}
              resizable={isWMP}
            >
              {isWMP && currentMusic ? (
                <WindowsMediaPlayer
                  src={currentMusic.src}
                  title={currentMusic.title}
                  subtitle={currentMusic.subtitle}
                />
              ) : (
                <app.Component />
              )}
            </WindowsXPWindow>
          );
        })}
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
