import { useEffect } from "react";
import styles from "./styles.module.css";
import xpLogo from "../../assets/icons/windows-xp-boot-screen.png";

const BootScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const randomTime = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;
    const timer = setTimeout(onFinish, randomTime);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={styles.bootContainer}>
      <div className={styles.logoContainer}>
        <img src={xpLogo} alt="Windows XP" className={styles.logo} />
      </div>

      <div className={styles.loadingBar}>
        <div className={styles.progressChunk}></div>
        <div className={styles.progressChunk}></div>
        <div className={styles.progressChunk}></div>
      </div>

      <div className={styles.copyright}>Copyright © Microsoft Corporation</div>
    </div>
  );
};

export default BootScreen;
