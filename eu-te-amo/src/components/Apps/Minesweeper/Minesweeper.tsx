import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import dead from "../../../assets/icons/apps/minesweeper/dead.png";
import bomb from "../../../assets/icons/apps/minesweeper/mine-ceil.png";
import bombCeil from "../../../assets/icons/apps/minesweeper/mine-death.png";
import flag from "../../../assets/icons/apps/minesweeper/flag.png";
import smile from "../../../assets/icons/apps/minesweeper/smile.png";
import win from "../../../assets/icons/apps/minesweeper/win.png";

import { useMiku } from "../../../context/MikuBuddy/MikuContext";
import { MIKU_REACTIONS } from "../../../context/MikuBuddy/MikuTypes";

const WIN_PHRASES = [
  "Aeee! Você conseguiu! Sabia que você era incrível! ❤️",
  "Uau, que mente brilhante! Parabéns! ✨",
  "Vencemooos! Isso pede uma dancinha! 💃",
  "Você é demais! Sobreviveu ao campo minado! 🎉",
  "Nossa, que velocidade! Arrasou muito! 🥰",
];

const DANCE_VARIATIONS = [
  MIKU_REACTIONS.DANCING,
  MIKU_REACTIONS.DANCING_MINECRAFT,
  MIKU_REACTIONS.DANCING_PIXELART,
  MIKU_REACTIONS.DANCING_2,
  MIKU_REACTIONS.DANCING_3,
];

const FIRST_CLICK_PHRASES = [
  "Primeiro clique feito... Boa sorte! 👀",
  "Vai dar tudo certo! Confio em você! ✨",
  "O primeiro passo é sempre o mais importante! 🥰",
  "Que os jogos comecem! 🎮",
  "Cruzando os dedos por você! 🤞",
];

const RESTART_PHRASES = [
  "Vamos de novo! Dessa vez você consegue! 💪",
  "Limpando o tabuleiro... Pronto! ✨",
  "Mais uma partida? Eu adoro te ver jogar! 🥰",
  "Foco total agora! 👀",
  "Preparando as minas... Brincadeira, boa sorte! 🤭",
];

const BEGINNER_PHRASES = [
  "Nível Iniciante! Vamos aquecer! 🥰",
  "Tá fácil, hein? Arrasa! ✨",
  "Pegando leve para começar! 😌",
];

const INTERMEDIATE_PHRASES = [
  "Intermediário! Mostra do que você é capaz! 🧐",
  "Agora o negócio ficou sério! 😳",
  "Vamos aumentar a dificuldade um pouquinho... 📈",
];

const EXPERT_PHRASES = [
  "Avançado?! Nossa, toma MUITO cuidado agora! 😱",
  "Uau, você é corajoso! Boa sorte! 🍀",
  "Atenção máxima! Qualquer deslize e... BUM! 💥",
];

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

type DifficultyLevel = keyof typeof DIFFICULTIES;

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  exploded: boolean;
}

type GameStatus = "idle" | "playing" | "won" | "lost";

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { triggerMiku } = useMiku();

  const config = DIFFICULTIES[difficulty];

  useEffect(() => {
    if (status === "won") {
      const randomPhrase =
        WIN_PHRASES[Math.floor(Math.random() * WIN_PHRASES.length)];
      const randomDance =
        DANCE_VARIATIONS[Math.floor(Math.random() * DANCE_VARIATIONS.length)];

      triggerMiku(randomPhrase, randomDance, 5000);
    } else if (status === "lost") {
      triggerMiku(
        "BUM! Ai, que susto! 😵 Não desiste, tenta de novo!",
        MIKU_REACTIONS.PUNCH,
        4000,
      );
    }
  }, [status, triggerMiku]);

  const handleDifficultyChange = (level: DifficultyLevel) => {
    setDifficulty(level);

    if (level === "beginner") {
      const phrase =
        BEGINNER_PHRASES[Math.floor(Math.random() * BEGINNER_PHRASES.length)];
      triggerMiku(phrase, MIKU_REACTIONS.HAPPY, 3000);
    } else if (level === "intermediate") {
      const phrase =
        INTERMEDIATE_PHRASES[
          Math.floor(Math.random() * INTERMEDIATE_PHRASES.length)
        ];
      triggerMiku(phrase, MIKU_REACTIONS.THINKING, 3000);
    } else if (level === "expert") {
      const phrase =
        EXPERT_PHRASES[Math.floor(Math.random() * EXPERT_PHRASES.length)];
      triggerMiku(phrase, MIKU_REACTIONS.PUNCH, 4000);
    }
  };

  const initBoard = () => {
    const newBoard: Cell[][] = [];
    for (let r = 0; r < config.rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < config.cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          exploded: false,
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setStatus("idle");
    setFlags(config.mines);
    setTime(0);
    setIsFirstClick(true);
    setShowModal(false);
  };

  const handleRestart = () => {
    initBoard();
    const phrase =
      RESTART_PHRASES[Math.floor(Math.random() * RESTART_PHRASES.length)];
    triggerMiku(phrase, MIKU_REACTIONS.HAPPY, 3000);
  };

  useEffect(() => {
    initBoard();
  }, [difficulty]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (status === "playing") {
      timerId = setInterval(() => setTime((t) => (t < 999 ? t + 1 : t)), 1000);
    }
    return () => clearInterval(timerId);
  }, [status]);

  const placeMines = (
    firstRow: number,
    firstCol: number,
    currentBoard: Cell[][],
  ) => {
    let minesPlaced = 0;
    while (minesPlaced < config.mines) {
      const r = Math.floor(Math.random() * config.rows);
      const c = Math.floor(Math.random() * config.cols);

      if (!currentBoard[r][c].isMine && !(r === firstRow && c === firstCol)) {
        currentBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (!currentBoard[r][c].isMine) {
          let count = 0;
          getNeighbors(r, c).forEach((n) => {
            if (currentBoard[n.r][n.c].isMine) count++;
          });
          currentBoard[r][c].neighborMines = count;
        }
      }
    }
    return currentBoard;
  };

  const getNeighbors = (r: number, c: number) => {
    const neighbors: { r: number; c: number }[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (
          r + i >= 0 &&
          r + i < config.rows &&
          c + j >= 0 &&
          c + j < config.cols
        ) {
          neighbors.push({ r: r + i, c: c + j });
        }
      }
    }
    return neighbors;
  };

  const revealCell = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;

    let currentBoard = [...board.map((row) => [...row])];

    if (isFirstClick) {
      currentBoard = placeMines(r, c, currentBoard);
      setIsFirstClick(false);
      setStatus("playing");

      const randomPhrase =
        FIRST_CLICK_PHRASES[
          Math.floor(Math.random() * FIRST_CLICK_PHRASES.length)
        ];
      triggerMiku(randomPhrase, MIKU_REACTIONS.THINKING, 3000);
    }

    const cell = currentBoard[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (cell.isMine) {
      cell.isRevealed = true;
      cell.exploded = true;
      setStatus("lost");
      setBoard(currentBoard);
      setShowModal(true);
      return;
    }

    floodFill(r, c, currentBoard);
    setBoard(currentBoard);
    checkWinCondition(currentBoard);

    if (!isFirstClick) {
      const chance = Math.random();

      if (chance < 0.15) {
        if (cell.neighborMines >= 3) {
          triggerMiku(
            "Ai que tensão... tem muita bomba aí perto! 😰",
            MIKU_REACTIONS.THINKING,
            3000,
          );
        } else if (cell.neighborMines === 0) {
          triggerMiku(
            "Que alívio, abriu um espação! ✨",
            MIKU_REACTIONS.HAPPY,
            3000,
          );
        } else {
          triggerMiku("Ufa, essa foi segura! 😮‍💨", MIKU_REACTIONS.IDLE, 3000);
        }
      }
    }
  };

  const floodFill = (r: number, c: number, currentBoard: Cell[][]) => {
    const stack = [{ r, c }];
    while (stack.length > 0) {
      const { r: currR, c: currC } = stack.pop()!;
      const currCell = currentBoard[currR][currC];

      if (!currCell.isRevealed && !currCell.isFlagged && !currCell.isMine) {
        currCell.isRevealed = true;
        if (currCell.neighborMines === 0) {
          getNeighbors(currR, currC).forEach((n) =>
            stack.push({ r: n.r, c: n.c }),
          );
        }
      }
    }
  };

  const handleChord = (r: number, c: number) => {
    if (status !== "playing") return;
    const currentBoard = [...board.map((row) => [...row])];
    const cell = currentBoard[r][c];

    if (!cell.isRevealed || cell.neighborMines === 0) return;

    let flagCount = 0;
    const neighbors = getNeighbors(r, c);

    neighbors.forEach((n) => {
      if (currentBoard[n.r][n.c].isFlagged) flagCount++;
    });

    if (flagCount === cell.neighborMines) {
      let hitMine = false;
      neighbors.forEach((n) => {
        const neighborCell = currentBoard[n.r][n.c];
        if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
          if (neighborCell.isMine) {
            neighborCell.isRevealed = true;
            neighborCell.exploded = true;
            hitMine = true;
          } else {
            floodFill(n.r, n.c, currentBoard);
          }
        }
      });

      if (hitMine) {
        setStatus("lost");
        setShowModal(true);
      } else {
        if (Math.random() < 0.1) {
          triggerMiku(
            "Nossa, limpou tudo de uma vez! Você é bom nisso! 😎",
            MIKU_REACTIONS.HAPPY,
            3000,
          );
        }
      }
      setBoard(currentBoard);
      checkWinCondition(currentBoard);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === "won" || status === "lost") return;

    const newBoard = [...board.map((row) => [...row])];
    const cell = newBoard[r][c];

    if (cell.isRevealed) return;

    if (!cell.isFlagged && flags > 0) {
      cell.isFlagged = true;
      setFlags(flags - 1);

      if (Math.random() < 0.1) {
        triggerMiku(
          "Bandeira posicionada! Menos uma! 🚩",
          MIKU_REACTIONS.HAPPY,
          2500,
        );
      }
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlags(flags + 1);
    }
    setBoard(newBoard);
  };

  const checkWinCondition = (currentBoard: Cell[][]) => {
    let revealedCount = 0;
    currentBoard.forEach((row) =>
      row.forEach((cell) => {
        if (cell.isRevealed) revealedCount++;
      }),
    );

    if (revealedCount === config.rows * config.cols - config.mines) {
      setStatus("won");
      setShowModal(true);
    }
  };

  const getSmiley = () => {
    if (status === "lost")
      return (
        <img
          src={dead}
          alt="dead"
          draggable="false"
          style={{ width: "20px", height: "20px" }}
        />
      );
    if (status === "won")
      return (
        <img
          src={win}
          alt="win"
          draggable="false"
          style={{ width: "20px", height: "20px" }}
        />
      );
    return (
      <img
        src={smile}
        alt="smile"
        draggable="false"
        style={{ width: "20px", height: "20px" }}
      />
    );
  };

  const getNumberColor = (num: number) => {
    const colors = [
      "",
      "blue",
      "green",
      "red",
      "darkblue",
      "darkred",
      "teal",
      "black",
      "gray",
    ];
    return colors[num] || "black";
  };

  return (
    <div className={`window-body ${styles.windowContainer}`}>
      <div className={styles.menuBar}>
        <span className={styles.menuItem} onClick={handleRestart}>
          Novo Jogo
        </span>
        <span
          className={styles.menuItem}
          onClick={() => handleDifficultyChange("beginner")}
        >
          Iniciante
        </span>
        <span
          className={styles.menuItem}
          onClick={() => handleDifficultyChange("intermediate")}
        >
          Intermediário
        </span>
        <span
          className={styles.menuItem}
          onClick={() => handleDifficultyChange("expert")}
        >
          Avançado
        </span>
      </div>

      {showModal && (status === "won" || status === "lost") && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalWindow}>
            <div className={styles.modalTitle}>
              <span>Campo Minado</span>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(false)}
              >
                X
              </span>
            </div>
            <div className={styles.modalBody}>
              {status === "won" ? (
                <>
                  <p>
                    <strong>Você venceu!</strong>
                  </p>
                  <p>Tempo: {time} segundos</p>
                  <p style={{ marginTop: "12px", color: "#d10000" }}>
                    Você sobreviveu ao campo minado... Mas o meu coração já é
                    seu! ❤️
                  </p>
                </>
              ) : (
                <p>
                  <strong>Fim de Jogo!</strong>
                  <br />
                  <br />
                  Você clicou em uma mina.
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginTop: "16px",
                }}
              >
                <button
                  className={styles.modalButton}
                  style={{ marginTop: 0 }}
                  onClick={handleRestart}
                >
                  Jogar Novamente
                </button>
                <button
                  className={styles.modalButton}
                  style={{ marginTop: 0 }}
                  onClick={() => setShowModal(false)}
                >
                  Ver Campo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.gameWrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.scoreboard}>
              {flags.toString().padStart(3, "0")}
            </div>
            <div className={styles.smileyBtn} onClick={handleRestart}>
              {getSmiley()}
            </div>
            <div className={styles.scoreboard}>
              {time.toString().padStart(3, "0")}
            </div>
          </div>

          <div className={styles.board}>
            {board.map((row, rIdx) => (
              <div key={rIdx} className={styles.row}>
                {row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`${styles.cell} ${
                      cell.isRevealed
                        ? cell.exploded
                          ? styles.cellMineExploded
                          : styles.cellRevealed
                        : styles.cellHidden
                    }`}
                    onClick={() => revealCell(cell.row, cell.col)}
                    onContextMenu={(e) => toggleFlag(e, cell.row, cell.col)}
                    onDoubleClick={() => handleChord(cell.row, cell.col)}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        <img
                          src={bomb}
                          alt="bomb"
                          draggable="false"
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : cell.neighborMines > 0 ? (
                        <span
                          style={{ color: getNumberColor(cell.neighborMines) }}
                        >
                          {cell.neighborMines}
                        </span>
                      ) : (
                        ""
                      )
                    ) : cell.isFlagged ? (
                      <img
                        src={flag}
                        alt="flag"
                        draggable="false"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : status === "lost" && cell.isMine ? (
                      <img
                        src={bombCeil}
                        alt="bomb"
                        draggable="false"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;
