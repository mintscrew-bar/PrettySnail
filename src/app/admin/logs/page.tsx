'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import styles from './page.module.scss';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  errorCode?: string;
  details?: unknown;
  userId?: string;
  ip?: string;
  endpoint?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logType, setLogType] = useState<'error' | 'access' | 'debug'>('error');
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/logs?type=${logType}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      alert('로그를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [logType, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const cleanOldLogs = async () => {
    if (!confirm('30일 이전의 로그를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/logs?days=30', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clean logs');
      }

      alert('오래된 로그를 삭제했습니다');
      fetchLogs();
    } catch (error) {
      console.error('Error cleaning logs:', error);
      alert('로그 삭제에 실패했습니다');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return '#dc3545';
      case 'WARN':
        return '#ffc107';
      case 'INFO':
        return '#17a2b8';
      case 'DEBUG':
        return '#6c757d';
      default:
        return '#000';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR');
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>시스템 로그</h1>
          <button onClick={cleanOldLogs} className={styles.cleanButton}>
            오래된 로그 정리
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.typeSelector}>
            <label>로그 타입:</label>
            <select
              value={logType}
              onChange={e => setLogType(e.target.value as 'error' | 'access' | 'debug')}
            >
              <option value="error">에러 로그</option>
              <option value="access">접근 로그</option>
              <option value="debug">디버그 로그</option>
            </select>
          </div>

          <div className={styles.limitSelector}>
            <label>표시 개수:</label>
            <select value={limit} onChange={e => setLimit(parseInt(e.target.value))}>
              <option value="50">50개</option>
              <option value="100">100개</option>
              <option value="200">200개</option>
              <option value="500">500개</option>
            </select>
          </div>

          <button onClick={fetchLogs} className={styles.refreshButton}>
            새로고침
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>로그를 불러오는 중...</div>
        ) : (
          <div className={styles.logsContainer}>
            {logs.length === 0 ? (
              <div className={styles.noLogs}>로그가 없습니다</div>
            ) : (
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>시간</th>
                    <th>레벨</th>
                    <th>에러코드</th>
                    <th>메시지</th>
                    <th>사용자</th>
                    <th>상세</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className={styles.timestamp}>{formatTimestamp(log.timestamp)}</td>
                      <td>
                        <span
                          className={styles.level}
                          style={{ backgroundColor: getLevelColor(log.level) }}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className={styles.errorCode}>{log.errorCode || '-'}</td>
                      <td className={styles.message}>{log.message}</td>
                      <td className={styles.userId}>{log.userId || '-'}</td>
                      <td className={styles.details}>
                        {log.details && typeof log.details === 'object' ? (
                          <details>
                            <summary>보기</summary>
                            <pre>{JSON.stringify(log.details, null, 2)}</pre>
                          </details>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
