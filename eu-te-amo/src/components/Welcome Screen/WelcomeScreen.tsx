import { useState } from "react";
import styles from "./styles.module.css";

import user from "../../assets/icons/profile.png";
import boot from "../../assets/icons/windows-xp-boot-screen.png";

interface UserDefinition {
  id: "hellen" | "karen" | "paul";
  name: string;
  avatar: string;
}

const XP_USERS: UserDefinition[] = [
  { id: "hellen", name: "Hellen", avatar: user },
];

interface WelcomeProps {
  onLogin: () => void;
}

const WelcomeScreen = ({ onLogin }: WelcomeProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleUserClick = () => {
    setIsLoggingIn(true);
    setTimeout(onLogin, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoGroup}>
          <div className={styles.winText}>
            <img className={styles.logo} src={boot} alt="Windows XP Logo" />
          </div>
          <p className={styles.loadingText}>
            Para continuar, clique em seu usuário
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.rightPanel}>
        {!isLoggingIn ? (
          <>
            <div className={styles.userList}>
              {XP_USERS.map((user) => (
                <div
                  key={user.id}
                  className={styles.userCard}
                  onClick={handleUserClick}
                >
                  <div className={styles.avatarWrapper}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.avatar}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userStatus}>
                      Clique aqui para iniciar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <span className={styles.loadingText}>
            Carregando suas configurações...
          </span>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
