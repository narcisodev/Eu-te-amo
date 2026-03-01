import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";

const reasons = [
  "Do seu sorriso que ilumina meu dia",
  "Da forma como você me faz rir",
  "Do seu abraço que é meu lugar favorito",
  "Da sua paciência infinita comigo",
  "De como você acredita em mim",
  "Dos seus olhos que me hipnotizam",
  "Da sua voz que me acalma",
  "De como você cuida de mim",
  "Do seu carinho nos pequenos gestos",
  "De tudo que você é ❤️",
  "De como você me entende sem palavras",
  "Da sua risada contagiante",
];

const ReasonCard = ({ reason, index, isFlipped, onFlip }: {
  reason: string;
  index: number;
  isFlipped: boolean;
  onFlip: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="perspective-1000"
  >
    <motion.div
      onClick={onFlip}
      className="relative w-full aspect-square cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-love rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Heart className="text-primary-foreground" size={40} fill="currentColor" />
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-card border-2 border-love-rose-light rounded-2xl flex items-center justify-center p-4 shadow-lg"
          >
            <p className="text-sm md:text-base font-body text-foreground text-center leading-snug">
              {reason}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </motion.div>
);

const ReasonsGame = () => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const resetAll = () => setFlippedCards(new Set());

  return (
    <section className="py-20 md:py-32 px-6 bg-love-blush">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-love mb-4">
            Eu Amo Tudo Em Você
          </h2>
          <p className="text-lg text-muted-foreground font-body italic mb-6">
            Clique nos corações para descobrir os motivos 💝
          </p>
          <motion.button
            onClick={resetAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <RotateCcw size={16} /> Recomeçar
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {reasons.map((reason, index) => (
            <ReasonCard
              key={index}
              reason={reason}
              index={index}
              isFlipped={flippedCards.has(index)}
              onFlip={() => toggleCard(index)}
            />
          ))}
        </div>

        {flippedCards.size === reasons.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-10"
          >
            <p className="text-2xl font-display font-bold text-gradient-love">
              E amo muito mais que isso! 💖
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ReasonsGame;
