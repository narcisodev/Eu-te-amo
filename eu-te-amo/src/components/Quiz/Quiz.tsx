import { useState } from "react";
import "xp.css/dist/XP.css";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    question: "Qual é a coisa mais importante num relacionamento?",
    options: ["Dinheiro", "Amor e respeito", "Aparência", "Popularidade"],
    correct: 1,
  },
  {
    question: "O que eu mais amo em você?",
    options: ["Tudo!", "Só o sorriso", "Nada", "O cabelo"],
    correct: 0,
  },
  {
    question: "Quantos 'eu te amo' são suficientes por dia?",
    options: ["1", "10", "100", "Nunca são suficientes ❤️"],
    correct: 3,
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

  // Retornamos apenas a "window-body" pois a "window" e a "title-bar"
  // já são criadas pelo seu componente WindowsXPWindow no App.tsx
  return (
    <div
      className="window-body"
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {!finished ? (
        <>
          <p style={{ marginBottom: "15px", fontWeight: "bold" }}>
            {q.question}
          </p>

          <fieldset style={{ flex: 1 }}>
            <legend>
              Pergunta {currentQ + 1} de {questions.length}
            </legend>
            {q.options.map((option, i) => (
              <div key={i} className="field-row" style={{ margin: "12px 0" }}>
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

          <section
            className="field-row"
            style={{ justifyContent: "flex-end", marginTop: "15px" }}
          >
            <button
              onClick={nextQuestion}
              disabled={selected === null}
              style={{ minWidth: "80px" }}
            >
              {currentQ === questions.length - 1 ? "Finalizar" : "Próxima >"}
            </button>
          </section>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            <img
              src="/icons/msg_information.png"
              alt="Info"
              style={{ width: "32px", height: "32px" }}
            />
            <div>
              <p>
                <strong>Teste de Compatibilidade Concluído</strong>
              </p>
              <p>O assistente processou suas respostas com sucesso.</p>
            </div>
          </div>
          <div
            style={{
              background: "white",
              border: "1px solid #7F9DB9",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <p>
              Acertos: {score} de {questions.length}
            </p>
            <p style={{ marginTop: "5px" }}>
              {score === questions.length
                ? "Resultado: Alma Gêmea Detectada! 😍"
                : "Resultado: Continue tentando! 💕"}
            </p>
          </div>
          <button
            onClick={() => {
              setFinished(false);
              setCurrentQ(0);
              setScore(0);
              setSelected(null);
            }}
            style={{ width: "80px" }}
          >
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveQuiz;
