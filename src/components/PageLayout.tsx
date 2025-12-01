import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className="skip-link">
        메인 콘텐츠로 건너뛰기
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
