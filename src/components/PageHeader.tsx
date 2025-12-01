import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
}

export default function PageHeader({ title, description, backgroundImage }: PageHeaderProps) {
  return (
    <section className={styles.pageHeader} style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
