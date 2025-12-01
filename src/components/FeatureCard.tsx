import Link from "next/link";
import styles from "./FeatureCard.module.scss";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  linkText?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  href,
  linkText = "자세히 보기 →",
}: FeatureCardProps) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.cardContent}>
        {icon && (
          <div className={styles.featureIcon}>
            <span className={styles.iconEmoji}>{icon}</span>
          </div>
        )}
        <h3>{title}</h3>
        <p>{description}</p>
        <Link href={href} className={styles.featureLink}>
          <span>{linkText}</span>
          <svg
            className={styles.linkArrow}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
