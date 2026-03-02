import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import windowsxp from "../../assets/icons/windows-xp-icon.png";
import { type AppKeys, APPS } from "../../apps/appConfigs";

import mediaPlayer from "../../assets/icons/media-player.png";

interface TaskbarProps {
  openedApps: AppKeys[];
  onOpenApp: (id: AppKeys) => void;
  onToggleMinimize: (id: AppKeys) => void;
  focusedAppId: AppKeys | null;
}

const Taskbar = ({
  openedApps,
  onOpenApp,
  onToggleMinimize,
  focusedAppId,
}: TaskbarProps) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const FIXED_APPS: AppKeys[] = ["quiz"];

  return (
    <div className={styles.xpTaskbar}>
      <button className={styles.startButton}>
        <img className={styles.xpIcon} src={windowsxp} alt="" />
        <span className={styles.startText}>Iniciar</span>
      </button>

      <div className={styles.quickLaunch}>
        {FIXED_APPS.map((id) => (
          <button
            key={id}
            className={styles.fixedApp}
            onClick={() => onOpenApp(id)}
          >
            <img
              src={APPS.find((a) => a.id === id)?.icon}
              alt=""
              className={styles.fixedIcon}
            />
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.taskItems}>
        {openedApps.map((appId) => {
          const app = APPS.find((a) => a.id === appId);
          const displayIcon = appId === "wmp" ? mediaPlayer : app?.icon;

          return (
            <div
              key={appId}
              className={`${styles.taskItem} ${focusedAppId === appId ? styles.activeTask : ""}`}
              onClick={() => onToggleMinimize(appId)}
            >
              <img src={displayIcon} alt="" className={styles.taskItemIcon} />
              <span className={styles.taskItemLabel}>{app?.label}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.systemTray}>
        <span className={styles.clock}>{time}</span>
      </div>
    </div>
  );
};

export default Taskbar;
