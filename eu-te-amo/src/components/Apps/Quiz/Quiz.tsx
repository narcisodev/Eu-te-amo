import { useState, useRef } from "react";
import "xp.css/dist/XP.css";
import styles from "./styles.module.css";
import info from "../../../assets/icons/info.png";

import { useMiku } from "../../../context/MikuBuddy/MikuContext";
import { MIKU_REACTIONS } from "../../../context/MikuBuddy/MikuTypes";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    question: "Qual é que começamos a namorar?",
    options: ["11/09/2001", "06/08/1945", "16/11/2024", "30/04/1945"],
    correct: 2,
  },
  {
    question: "Qual melhor série do mundo?",
    options: [
      "How I meet your mother",
      "Hora de Aventura",
      "Rick and Morty",
      "Todas que eu assistir com você",
    ],
    correct: 1,
  },
  {
    question: "Quem eu escolheria?",
    options: ["Hatsune Miku", "PC", "Maga caçadora", "Você"],
    correct: 3,
  },
  {
    question: "Qual foi a primeira coisa que eu pensei quando te vi?",
    options: [
      "Socorro, eu quero correr",
      "Que mulher gostosa da ****",
      "Vou contar a lore inteira de Hora de Aventura pra ela",
      "Esqueci de entregar minha lista",
    ],
    correct: 2,
  },
];

/* ============================
   FRASES VARIADAS
============================ */

const CORRECT_PHRASES = [
  "Sabia que você acertaria 😌",
  "Issooo!! 💖",
  "Muito bem!! 👏",
  "Perfeita como sempre ✨",
  "Você me conhece demais 😳",
];

const WRONG_PHRASES = [
  "Como assim?? 😤",
  "Eu não acredito nisso 👊",
  "Tá de brincadeira né? 😠",
  "Eu vou fingir que não vi isso...",
  "Erradooooo 😭",
];

const getRandomPhrase = (
  phrases: string[],
  lastIndexRef: React.MutableRefObject<number | null>,
) => {
  if (phrases.length === 1) return phrases[0];

  let newIndex: number;

  do {
    newIndex = Math.floor(Math.random() * phrases.length);
  } while (newIndex === lastIndexRef.current);

  lastIndexRef.current = newIndex;

  return phrases[newIndex];
};

const LoveQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const { triggerMiku } = useMiku();

  const lastCorrectIndex = useRef<number | null>(null);
  const lastWrongIndex = useRef<number | null>(null);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;

    setSelected(optionIndex);

    const isCorrect = optionIndex === questions[currentQ].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);

      const phrase = getRandomPhrase(CORRECT_PHRASES, lastCorrectIndex);

      triggerMiku(phrase, MIKU_REACTIONS.HAPPY, 3000);
    } else {
      const phrase = getRandomPhrase(WRONG_PHRASES, lastWrongIndex);

      triggerMiku(phrase, MIKU_REACTIONS.PUNCH, 3000);
    }

    // Reação especial se escolher Hatsune Miku
    if (currentQ === 2 && optionIndex === 0) {
      triggerMiku(
        "E-Eu mesma?! 😳 Você tá me testando?",
        MIKU_REACTIONS.THINKING,
        4000,
      );
    }
  };

  const nextQuestion = () => {
    if (selected === null) return;

    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);

      if (score === questions.length) {
        triggerMiku(
          "PERFEITO!!! Você é incrível 💖✨",
          MIKU_REACTIONS.HAPPY,
          5000,
        );
      } else if (score >= questions.length / 2) {
        triggerMiku("Hmm... aceitável 😌", MIKU_REACTIONS.THINKING, 4000);
      } else {
        triggerMiku(
          "Vou fingir que não vi isso 😤",
          MIKU_REACTIONS.PUNCH,
          4000,
        );
      }
    }
  };

  const resetQuiz = () => {
    setFinished(false);
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    triggerMiku("Vamos de novo 😏", MIKU_REACTIONS.HAPPY, 3000);
  };

  const q = questions[currentQ];

  return (
    <div className={`window-body ${styles.container}`}>
      {!finished ? (
        <>
          <p className={styles.questionText}>{q.question}</p>

          <fieldset className={styles.optionsFieldset}>
            <legend>
              Pergunta {currentQ + 1} de {questions.length}
            </legend>

            {q.options.map((option, i) => {
              const isCorrect = i === q.correct;
              const isSelected = selected === i;

              return (
                <div key={i} className={`field-row ${styles.optionRow}`}>
                  <input
                    type="radio"
                    id={`opt-${i}`}
                    name="quiz-opt"
                    checked={isSelected}
                    onChange={() => handleSelect(i)}
                    disabled={selected !== null}
                  />

                  <label
                    htmlFor={`opt-${i}`}
                    style={{
                      color:
                        selected !== null && isCorrect
                          ? "#008000"
                          : isSelected && !isCorrect
                            ? "#FF0000"
                            : "black",
                      fontWeight:
                        selected !== null && isCorrect ? "bold" : "normal",
                    }}
                  >
                    {option}
                  </label>
                </div>
              );
            })}
          </fieldset>

          <section className={`field-row ${styles.footerActions}`}>
            <button
              onClick={nextQuestion}
              disabled={selected === null}
              className={styles.nextButton}
            >
              {currentQ === questions.length - 1 ? "Finalizar" : "Próxima >"}
            </button>
          </section>
        </>
      ) : (
        <div className={styles.resultWrapper}>
          <div className={styles.resultInfo}>
            <img src={info} alt="Info" className={styles.infoIcon} />
            <div>
              <p>
                <strong>Teste Concluído</strong>
              </p>
              <p>O assistente processou suas respostas com sucesso.</p>
            </div>
          </div>

          <div className={styles.scoreBox}>
            <p>
              Acertos: {score} de {questions.length}
            </p>
          </div>

          <button onClick={resetQuiz} className={styles.resetButton}>
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveQuiz;
