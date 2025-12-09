import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getEnv } from "@/lib/env";
import ToastProvider from "@/components/ToastProvider";
import "./globals.scss";

// 한글 웹폰트 (Noto Sans KR) - 한글 가독성 최적화
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "이쁜우렁이 - 신선한 우렁이 전문 양식장",
  description: "HACCP 인증 시설에서 무항생제 사료만을 사용하여 신선함과 건강함을 최우선으로, 우렁이 브랜드 이쁜우렁이",
  keywords: ["우렁이", "양식장", "HACCP", "무항생제", "신선한 우렁이", "우렁이 요리", "건강식품"],
  authors: [{ name: "이쁜우렁이" }],
  creator: "이쁜우렁이",
  publisher: "이쁜우렁이",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getEnv('NEXT_PUBLIC_BASE_URL')),
  openGraph: {
    title: "이쁜우렁이 - 신선한 우렁이 전문 양식장",
    description: "HACCP 인증 시설에서 무항생제 사료만을 사용하여 신선함과 건강함을 최우선으로",
    type: "website",
    locale: "ko_KR",
    siteName: "이쁜우렁이",
    images: [
      {
        url: "/assets/logo_no.1.png",
        width: 200,
        height: 80,
        alt: "이쁜우렁이 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "이쁜우렁이 - 신선한 우렁이 전문 양식장",
    description: "HACCP 인증 시설에서 무항생제 사료만을 사용하여 신선함과 건강함을 최우선으로",
    images: ["/assets/logo_no.1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: 'your-google-verification-code',
    // naver: 'your-naver-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',  
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKR.variable}>
        {children}
        <ToastProvider />
        <Analytics />
      </body>
    </html>
  );
}
