import { useState } from "react";
import styles from "./styles.module.css";

import mikuGif1 from "../../../assets/mikuBuddy/miku-happy.gif";
import mikuGif2 from "../../../assets/mikuBuddy/miku-dance.gif";
import mikuGif3 from "../../../assets/mikuBuddy/miku-punch.gif";

const MIKU_GIFS = [mikuGif1, mikuGif2, mikuGif3];

const initialPoem = ``;

interface NoteFile {
  id: string;
  title: string;
  content: string;
}

interface NotepadProps {
  onClose?: () => void;
}

const Notepad = ({ onClose }: NotepadProps) => {
  const [files, setFiles] = useState<NoteFile[]>([
    { id: "1", title: "poema.txt", content: initialPoem },
  ]);

  const [activeId, setActiveId] = useState<string>("1");

  const activeFile = files.find((f) => f.id === activeId) || files[0];

  const handleCreateFile = () => {
    const newId = Date.now().toString();
    const newFile = {
      id: newId,
      title: `novo_arquivo_${files.length + 1}.txt`,
      content: "",
    };

    setFiles([...files, newFile]);
    setActiveId(newId);
  };

  const handleCloseFile = (idToClose: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const remainingFiles = files.filter((f) => f.id !== idToClose);

    if (remainingFiles.length === 0) {
      if (onClose) {
        onClose();
      }
    } else {
      setFiles(remainingFiles);
      if (activeId === idToClose) {
        setActiveId(remainingFiles[remainingFiles.length - 1].id);
      }
    }
  };

  const handleClearText = () => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeId ? { ...f, content: "" } : f)),
    );
  };

  const handleHelp = () => {
    const randomGif = MIKU_GIFS[Math.floor(Math.random() * MIKU_GIFS.length)];
    const mikuImageHtml = `<br/><br/><img src="${randomGif}" alt="Miku" class="${styles.mikuSticker}" /><br/>`;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeId ? { ...f, content: f.content + mikuImageHtml } : f,
      ),
    );
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === activeId ? { ...f, title: e.target.value } : f,
      ),
    );
  };

  const handleContentBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === activeId ? { ...f, content: newHtml } : f,
      ),
    );
  };

  return (
    <div className={`window-body ${styles.container}`}>
      <div className={styles.menuBar}>
        <span
          className={styles.menuItem}
          onClick={handleCreateFile}
          title="Criar nova aba"
        >
          Novo
        </span>
        <span
          className={styles.menuItem}
          onClick={handleClearText}
          title="Apagar texto atual"
        >
          Limpar
        </span>
        <span
          className={styles.menuItem}
          onClick={() => handleCloseFile(activeId)}
          title="Fechar aba atual"
        >
          Fechar Aba
        </span>
        <span
          className={styles.menuItem}
          onClick={handleHelp}
          title="Chamar a Miku!"
        >
          Ajuda
        </span>
      </div>

      <div className={styles.tabsContainer}>
        {files.map((file) => {
          const isActive = file.id === activeId;

          return (
            <div
              key={file.id}
              className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}
              onClick={() => setActiveId(file.id)}
            >
              {isActive ? (
                <input
                  type="text"
                  className={styles.tabInput}
                  value={file.title}
                  onChange={handleTitleChange}
                />
              ) : (
                <span>{file.title}</span>
              )}

              <span
                className={styles.closeTabBtn}
                onClick={(e) => handleCloseFile(file.id, e)}
                title="Fechar"
              >
                x
              </span>
            </div>
          );
        })}

        <button
          className={styles.addTabBtn}
          onClick={handleCreateFile}
          title="Novo Arquivo"
        >
          +
        </button>
      </div>

      <div
        key={activeFile.id}
        className={styles.textArea}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleContentBlur}
        dangerouslySetInnerHTML={{ __html: activeFile.content }}
      />
    </div>
  );
};

export default Notepad;
