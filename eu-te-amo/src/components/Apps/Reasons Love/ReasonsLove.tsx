import { useEffect, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";
import styles from "./styles.module.css";
import { MIKU_REACTIONS } from "../../../context/MikuBuddy/MikuTypes";
import { useMiku } from "../../../context/MikuBuddy/MikuContext";

// Se triggerMiku e MIKU_REACTIONS vêm de outro arquivo, não esqueça de importar aqui!
// import { triggerMiku, MIKU_REACTIONS } from "../seu-caminho";

const reasons = [
  "Da felicidade que eu sinto quando você chega em casa",
  "Da sua comida deliciosa que me enche de amor (e barriga)",
  "Do seu abraço que é meu lugar seguro",
  "Da sua personalidade incrível que me encanta todo dia",
  "Da sua grande inteligência que me deixa orgulhoso",
  'Dos seus olhos que me dizem "eu te amo" sem precisar de palavras',
  "Da sua voz que me acalma",
  "De como você cuida de mim",
  "Do seu carinho nos pequenos gestos",
  "De tudo que você é, porque eu te amo exatamente assim",
  "De como você me entende sem palavras",
  "Da sua risada que é música para os meus ouvidos",
];

interface ReasonCardProps {
  reason: string;
  index: number;
  isFlipped: boolean;
  onFlip: () => void;
}

function ReasonCard({ reason, index, isFlipped, onFlip }: ReasonCardProps) {
  return (
    <div
      className={styles.card}
      onClick={onFlip}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}>
        <div className={styles.cardFront}>
          <Heart size={28} color="#ef4444" fill="#ef4444" cursor="pointer" />
        </div>

        <div className={styles.cardBack}>
          <p>{reason}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReasonsLove() {
  // useMiku must be called inside a component
  const { triggerMiku } = useMiku();

  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // 🔥 CORREÇÃO: O useEffect agora está DENTRO do componente,
  // onde ele tem acesso à variável `flippedCards`.
  useEffect(() => {
    if (flippedCards.size === reasons.length && reasons.length > 0) {
      triggerMiku("Eu te amo!!!", MIKU_REACTIONS.HAPPY, 3000);
    }
  }, [flippedCards.size, triggerMiku]);

  const toggleCard = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const resetAll = () => {
    setFlippedCards(new Set());
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Motivos Para Te Amar</h2>
        <p>Clique nos corações para revelar!</p>

        <button onClick={resetAll} className={styles.resetBtn}>
          <RotateCcw size={14} /> Reiniciar
        </button>
      </div>

      <div className={styles.grid}>
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
        <div className={styles.statusBar}>
          Você desbloqueou tudo! E eu amo muito mais que isso!
        </div>
      )}
    </div>
  );
}
