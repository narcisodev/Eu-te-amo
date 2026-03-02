import { useState } from "react";
import "xp.css/dist/XP.css";
import styles from "./styles.module.css";
import info from "../../assets/icons/info.png";

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
      "Vou contar a lore inteira de Hora de Aventtura pra ela",
      "Esqueci de entregar minha lista",
    ],
    correct: 2,
  },
];

const LoveQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === questions[currentQ].correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
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
            {q.options.map((option, i) => (
              <div key={i} className={`field-row ${styles.optionRow}`}>
                <input
                  type="radio"
                  id={`opt-${i}`}
                  name="quiz-opt"
                  checked={selected === i}
                  onChange={() => handleSelect(i)}
                  disabled={selected !== null}
                />
                <label
                  htmlFor={`opt-${i}`}
                  style={{
                    color:
                      selected !== null && i === q.correct
                        ? "#008000"
                        : selected === i && i !== q.correct
                          ? "#FF0000"
                          : "black",
                    fontWeight:
                      selected !== null && i === q.correct ? "bold" : "normal",
                  }}
                >
                  {option}
                </label>
              </div>
            ))}
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
                <strong>Teste de Compatibilidade Concluído</strong>
              </p>
              <p>O assistente processou suas respostas com sucesso.</p>
            </div>
          </div>

          <div className={styles.scoreBox}>
            <p>
              Acertos: {score} de {questions.length}
            </p>
            <p className={styles.resultMessage}>
              {score === questions.length
                ? "Resultado: Alma Gêmea Detectada!"
                : "Resultado: Continue tentando!"}
            </p>
          </div>

          <button
            onClick={() => {
              setFinished(false);
              setCurrentQ(0);
              setScore(0);
              setSelected(null);
            }}
            className={styles.resetButton}
          >
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveQuiz;
