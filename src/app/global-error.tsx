'use client';

/**
 * Global Error Handler
 * Next.js 13+ App Router의 루트 레벨 에러 핸들러
 * layout.tsx의 에러도 캐치합니다
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{
            maxWidth: '600px',
            padding: '40px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#dc2626',
              marginBottom: '16px',
            }}>
              문제가 발생했습니다
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{
                textAlign: 'left',
                margin: '20px 0',
                padding: '16px',
                background: '#f3f4f6',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '12px',
                }}>
                  에러 상세 정보 (개발 모드)
                </summary>
                <pre style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#6b7280',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}>
                  {error.toString()}
                </pre>
              </details>
            )}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: 'none',
                  background: '#547416',
                  color: '#fff',
                }}
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#f3f4f6',
                  color: '#111827',
                  border: '1px solid #d1d5db',
                }}
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
