import styles from "./styles.module.css";

const MeuComputador = () => {
  const drives = [
    {
      id: "c",
      label: "Disco Local (C:)",
      icon: "/icons/hard-drive.png",
      total: "40GB",
      free: "12GB",
    },
    {
      id: "d",
      label: "Dados (D:)",
      icon: "/icons/hard-drive.png",
      total: "120GB",
      free: "80GB",
    },
    {
      id: "e",
      label: "Unidade de CD (E:)",
      icon: "/icons/cd-drive.png",
      total: "700MB",
      free: "0MB",
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Unidades de Disco Rígido</h3>
      <div className={styles.grid}>
        {drives.map((drive) => (
          <div key={drive.id} className={styles.driveItem}>
            <img src={drive.icon} alt="Drive" className={styles.driveIcon} />
            <div className={styles.driveInfo}>
              <span className={styles.driveLabel}>{drive.label}</span>
              <div className={styles.capacityBar}>
                <div
                  className={styles.capacityFill}
                  style={{ width: "60%" }}
                ></div>
              </div>
              <span className={styles.driveSpace}>
                {drive.free} livres de {drive.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeuComputador;
