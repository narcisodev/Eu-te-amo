import { useRef, useState } from "react";
import Draggable from "react-draggable";
import "xp.css/dist/XP.css";

const WindowsXPWindow = () => {
  const nodeRef = useRef(null);
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Draggable nodeRef={nodeRef} handle=".title-bar">
        <div ref={nodeRef} className="window" style={{ width: 350 }}>
          <div className="title-bar" style={{ cursor: "grab" }}>
            <div className="title-bar-text">Meu Computador</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize" />
              <button aria-label="Maximize" disabled />
              <button aria-label="Close" onClick={() => setVisivel(false)} />
            </div>
          </div>
          <div className="window-body">
            <p style={{ textAlign: "center" }}>Janela funcional!</p>
            <section className="field-row" style={{ justifyContent: "center" }}>
              <button onClick={() => setVisivel(false)}>OK</button>
            </section>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default WindowsXPWindow;
