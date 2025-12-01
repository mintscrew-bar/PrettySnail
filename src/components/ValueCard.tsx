import styles from "./ValueCard.module.scss";

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className={styles.valueCard}>
      <div className={styles.valueIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}