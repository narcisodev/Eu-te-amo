import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import windowsxp from "../../assets/icons/windows-xp-icon.png";
import { type AppKeys, APPS } from "../../apps/appConfigs";

interface TaskbarProps {
  openedApps: AppKeys[];
  onOpenApp: (id: AppKeys) => void;
}

const Taskbar = ({ openedApps, onOpenApp }: TaskbarProps) => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );

  const FIXED_APPS: AppKeys[] = ["meuComputador"];

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

  return (
    <div className={styles.xpTaskbar}>
      <button className={styles.startButton}>
        <img className={styles.xpIcon} src={windowsxp} alt="" />
        <span className={styles.startText}>Iniciar</span>
      </button>

      <div className={styles.quickLaunch}>
        {FIXED_APPS.map((id) => {
          const app = APPS.find((a) => a.id === id);
          return (
            <button
              key={`fixed-${id}`}
              className={styles.fixedApp}
              onClick={() => onOpenApp(id)}
              title={app?.label}
            >
              <img src={app?.icon} alt="" className={styles.fixedIcon} />
            </button>
          );
        })}
      </div>

      <div className={styles.divider} />

      <div className={styles.taskItems}>
        {openedApps.map((appId) => {
          const appInfo = APPS.find((a) => a.id === appId);
          return (
            <div key={appId} className={styles.taskItem}>
              <img src={appInfo?.icon} alt="" className={styles.taskItemIcon} />
              <span className={styles.taskItemLabel}>{appInfo?.label}</span>
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
