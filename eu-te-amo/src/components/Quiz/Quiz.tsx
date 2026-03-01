import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle, XCircle, RotateCcw } from "lucide-react";

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
  {
    question: "Qual é o melhor programa de casal?",
    options: ["Ficar no sofá juntos", "Viajar", "Cozinhar junto", "Todos os acima!"],
    correct: 3,
  },
  {
    question: "O que torna nosso amor especial?",
    options: ["Sermos nós mesmos", "Os presentes", "As fotos", "Os likes"],
    correct: 0,
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
    if (optionIndex === questions[currentQ].correct) {
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  const q = questions[currentQ];

  return (
    <section className="py-20 md:py-32 px-6 bg-background">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-love mb-4">
            Quiz do Amor
          </h2>
          <p className="text-lg text-muted-foreground font-body italic">
            Será que você me conhece de verdade? 💘
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-body text-muted-foreground">
                  Pergunta {currentQ + 1} de {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i <= currentQ ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-8">
                {q.question}
              </h3>

              <div className="space-y-3">
                {q.options.map((option, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === q.correct;
                  const showResult = selected !== null;

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleSelect(i)}
                      whileHover={selected === null ? { scale: 1.02 } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-body transition-all flex items-center gap-3 ${
                        showResult && isCorrect
                          ? "border-love-warm bg-secondary"
                          : showResult && isSelected && !isCorrect
                          ? "border-destructive bg-secondary"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      {showResult && isCorrect && <CheckCircle className="text-love-warm flex-shrink-0" size={20} />}
                      {showResult && isSelected && !isCorrect && <XCircle className="text-destructive flex-shrink-0" size={20} />}
                      {!showResult && <Heart className="text-love-rose-light flex-shrink-0" size={18} />}
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-3xl p-10 shadow-lg border border-border text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Heart className="mx-auto text-primary mb-6" size={64} fill="currentColor" />
              </motion.div>

              <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                {score === questions.length
                  ? "Perfeito! Você me conhece demais! 😍"
                  : score >= 3
                  ? "Quase lá! Você me conhece bem! 🥰"
                  : "Vamos passar mais tempo juntos! 💕"}
              </h3>

              <p className="text-xl text-muted-foreground font-body mb-8">
                Você acertou {score} de {questions.length} perguntas
              </p>

              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-love text-primary-foreground px-8 py-3 rounded-full font-body text-lg"
              >
                <RotateCcw size={18} /> Jogar de Novo
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LoveQuiz;
