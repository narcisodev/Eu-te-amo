import { useRef, type ReactNode } from "react";
import Draggable from "react-draggable";
import "xp.css/dist/XP.css";
import styles from "./styles.module.css";

interface Props {
  title: string;
  icon?: string;
  children: ReactNode;
  isActive: boolean;
  isMinimized: boolean;
  resizable?: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}

const WindowsXPWindow = ({
  title,
  icon,
  children,
  isActive,
  isMinimized,
  resizable = false,
  onFocus,
  onClose,
  onMinimize,
}: Props) => {
  const nodeRef = useRef(null);

  if (isMinimized) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".title-bar"
      bounds="parent"
      onStart={onFocus}
      onMouseDown={onFocus}
    >
      <div
        ref={nodeRef}
        className={`
          ${styles.windowWrapper} 
          window 
          ${isActive ? styles.activeWindow : styles.inactiveWindow}
          ${resizable ? styles.resizableWindow : ""} 
        `}
      >
        <div className={`title-bar ${!isActive ? "inactive" : ""}`}>
          <div className={styles.titleContainer}>
            {icon && <img src={icon} alt="" className={styles.titleIcon} />}
            <div className="title-bar-text">{title}</div>
          </div>

          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            />
            <button aria-label="Maximize" />
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
          </div>
        </div>
        <div className={`window-body ${styles.windowBody}`}>{children}</div>
      </div>
    </Draggable>
  );
};

export default WindowsXPWindow;
