import styles from "./styles.module.css";
import "xp.css/dist/XP.css";

const HISTORIA = [
  {
    id: 1,
    date: "06/2024",
    title: "Onde Tudo Começou",
    description:
      "Quando começamos a nós falar, eu já sentia que tinha algo especial. ",
  },
  {
    id: 2,
    date: "07/2024",
    title: "Nosso Primeiro Encontro",
    description: "Quando a gente se viu pela primeira vez!",
  },
  {
    id: 3,
    date: "31/08/2024",
    title: "Gostar",
    description:
      "Você me disse que gostava de mim pela primeira vez e meu coração quase saiu pela boca.",
  },
  {
    id: 4,
    date: "16/11/2024",
    title: "O Pedido",
    description: "O dia em que tomei coragem e te pedi em namoro na praia.",
  },
  {
    id: 5,
    date: "16/11/2024",
    title: "Você me ama?",
    description:
      "Você disse que me amava pela primeira vez e eu senti que era a pessoa mais sortuda do mundo. Assim, como eu também disse que te amava.",
  },
  {
    id: 6,
    date: "08/08/2025",
    title: "Amor pra toda vida",
    description:
      "Você disse que eu era o amor da sua vida e eu não poderia concordar mais. Eu te amo tanto, tanto, tanto!",
  },
  {
    id: 7,
    date: "Hoje (02/03/2026)",
    title: "Eu te amo <3",
    description:
      "Você disse que me ama aproximadamente 540 vezes e eu te amo mais a cada dia que passa. Obrigado por ser minha namorada, minha melhor amiga, meu tudo. Eu te amo infinitamente, pra todo sempre!",
  },
];

const LoveTimeline = () => {
  return (
    <div className={`window-body ${styles.container}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Nossa História de Amor</h2>
        <p className={styles.subtitle}>
          Registro de Eventos Oficiais do Sistema
        </p>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.timeline}>
          {HISTORIA.map((evento) => (
            <div key={evento.id} className={styles.event}>
              <div className={styles.node} />

              <div className={styles.content}>
                <div className={styles.date}>{evento.date}</div>
                <h3 className={styles.eventTitle}>{evento.title}</h3>
                <p className={styles.eventDesc}>{evento.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveTimeline;
