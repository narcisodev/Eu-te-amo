import styles from "./styles.module.css";

interface DesktopIconProps {
  label: string;
  iconUrl: string;
  onDoubleClick: () => void;
}

const DesktopIcon = ({ label, iconUrl, onDoubleClick }: DesktopIconProps) => {
  return (
    <div className={styles.iconContainer} onDoubleClick={onDoubleClick}>
      <img src={iconUrl} alt={label} className={styles.iconImage} />
      <span className={styles.iconLabel}>{label}</span>
    </div>
  );
};

export default DesktopIcon;
