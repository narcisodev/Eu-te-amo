import { useState } from "react";
import styles from "./styles.module.css";

// 🌟 IMPORTANTE: Lembre-se de importar aqui os GIFs da Miku!
// Substitua pelos caminhos corretos da sua pasta assets se necessário.
import mikuGif1 from "../../../assets/mikuBuddy/miku-happy.gif";
import mikuGif2 from "../../../assets/mikuBuddy/miku-dance.gif";
import mikuGif3 from "../../../assets/mikuBuddy/miku-punch.gif";

// Lista com os GIFs para o sorteio na "Ajuda"
const MIKU_GIFS = [mikuGif1, mikuGif2, mikuGif3];

const initialPoem = ``;

interface NoteFile {
  id: string;
  title: string;
  content: string;
}

// 🔥 A CORREÇÃO ESTÁ AQUI: O '?' diz ao TypeScript que o onClose é opcional.
interface NotepadProps {
  onClose?: () => void;
}

const Notepad = ({ onClose }: NotepadProps) => {
  const [files, setFiles] = useState<NoteFile[]>([
    { id: "1", title: "poema.txt", content: initialPoem },
  ]);

  const [activeId, setActiveId] = useState<string>("1");

  const activeFile = files.find((f) => f.id === activeId) || files[0];

  /* =================================
     CRIAR NOVO ARQUIVO
  ================================= */
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

  /* =================================
     FECHAR ARQUIVO (ABA)
  ================================= */
  const handleCloseFile = (idToClose: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const remainingFiles = files.filter((f) => f.id !== idToClose);

    // 🔥 E AQUI ESTÁ A PROTEÇÃO: Se fechou a última aba, verificamos se onClose existe antes de chamar.
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

  /* =================================
     AÇÕES DO MENU SUPERIOR
  ================================= */
  const handleClearText = () => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeId ? { ...f, content: "" } : f)),
    );
  };

  const handleHelp = () => {
    // Sorteia um GIF aleatório da lista
    const randomGif = MIKU_GIFS[Math.floor(Math.random() * MIKU_GIFS.length)];

    // Cria a tag HTML da imagem
    const mikuImageHtml = `<br/><br/><img src="${randomGif}" alt="Miku" class="${styles.mikuSticker}" /><br/>`;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeId ? { ...f, content: f.content + mikuImageHtml } : f,
      ),
    );
  };

  /* =================================
     EDITAR TÍTULO
  ================================= */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === activeId ? { ...f, title: e.target.value } : f,
      ),
    );
  };

  /* =================================
     SALVAR CONTEÚDO AO DIGITAR (ContentEditable)
  ================================= */
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
      {/* Barra de Menus Funcional */}
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

      {/* Navegação de Abas (Arquivos) */}
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

      {/* Div contentEditable que aceita GIFs e texto misturados! */}
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
