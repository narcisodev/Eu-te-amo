import { useRef, type ReactNode } from "react";
import Draggable from "react-draggable";
import "xp.css/dist/XP.css";

// 1. Definimos a interface para as props da janela
interface WindowsXPWindowProps {
  title: string;
  children: ReactNode; // ReactNode permite qualquer conteúdo renderizável (texto, HTML, outros componentes)
  onClose: () => void;
}

const WindowsXPWindow = ({
  title,
  children,
  onClose,
}: WindowsXPWindowProps) => {
  const nodeRef = useRef(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0, // Atalho para top, left, right, bottom: 0
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none", // Permite clicar no que está atrás da área vazia
      }}
    >
      <Draggable nodeRef={nodeRef} handle=".title-bar">
        <div
          ref={nodeRef}
          className="window"
          style={{
            width: 350,
            pointerEvents: "auto", // Reativa o clique apenas na janela em si
            position: "absolute",
          }}
        >
          <div className="title-bar" style={{ cursor: "grab" }}>
            <div className="title-bar-text">{title}</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize" />
              <button aria-label="Maximize" />
              <button aria-label="Close" onClick={onClose} />
            </div>
          </div>
          <div className="window-body">{children}</div>
        </div>
      </Draggable>
    </div>
  );
};

export default WindowsXPWindow;
