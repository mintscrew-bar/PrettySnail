"use client";

import AdminLayout from "@/components/AdminLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.scss";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  errorCode?: string;
  details?: unknown;
  userId?: string;
  ip?: string;
  endpoint?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logType, setLogType] = useState<"error" | "access" | "debug">("error");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`/api/logs?type=${logType}&limit=${limit}`, {
        credentials: "include", // use cookie-based auth primarily
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      alert("로그를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  }, [logType, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const cleanOldLogs = async () => {
    if (!confirm("30일 이전의 로그를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("/api/logs?days=30", {
        method: "DELETE",
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to clean logs");
      }

      alert("오래된 로그를 삭제했습니다");
      fetchLogs();
    } catch (error) {
      console.error("Error cleaning logs:", error);
      alert("로그 삭제에 실패했습니다");
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "#dc3545";
      case "WARN":
        return "#ffc107";
      case "INFO":
        return "#17a2b8";
      case "DEBUG":
        return "#6c757d";
      default:
        return "#000";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ko-KR");
  };

  const toggleLogExpanded = (index: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportToTXT = () => {
    const lines = logs.map(log => {
      const time = formatTimestamp(log.timestamp);
      const parts = [
        `시간: ${time}`,
        `레벨: ${log.level}`,
        `에러코드: ${log.errorCode || "-"}`,
        `사용자: ${log.userId || "-"}`,
        `엔드포인트: ${log.endpoint || "-"} `,
        `메시지: ${log.message}`,
        `상세: ${log.details ? JSON.stringify(log.details, null, 2) : "-"}`,
      ];
      return parts.join("\n");
    });

    const content =
      `로그 타입: ${logType}\n생성 시각: ${new Date().toLocaleString("ko-KR")}\n총 ${logs.length}개 항목\n\n` +
      lines.join("\n\n----\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `logs_${logType}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("시스템 로그", 14, 15);

    // Add metadata
    doc.setFontSize(10);
    doc.text(`로그 타입: ${logType}`, 14, 22);
    doc.text(`생성 시각: ${new Date().toLocaleString("ko-KR")}`, 14, 27);
    doc.text(`총 ${logs.length}개 항목`, 14, 32);

    // Prepare table data
    const tableData = logs.map(log => [
      formatTimestamp(log.timestamp),
      log.level,
      log.errorCode || "-",
      log.message,
      log.userId || "-",
      log.details ? "O" : "X",
    ]);

    // Add table
    autoTable(doc, {
      startY: 38,
      head: [["시간", "레벨", "에러코드", "메시지", "사용자", "상세"]],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 26, 26] },
      margin: { top: 38 },
    });

    // Save PDF
    doc.save(`logs_${logType}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ["시간", "레벨", "에러코드", "메시지", "사용자", "IP", "엔드포인트", "상세"];
    const csvData = logs.map(log => [
      formatTimestamp(log.timestamp),
      log.level,
      log.errorCode || "",
      `"${log.message.replace(/"/g, '""')}"`,
      log.userId || "",
      log.ip || "",
      log.endpoint || "",
      log.details ? `"${JSON.stringify(log.details).replace(/"/g, '""')}"` : "",
    ]);

    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `logs_${logType}_${new Date().toISOString().split("T")[0]}.csv`;
    // append to DOM for better browser compatibility
    document.body.appendChild(link);
    link.click();
    // cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const exportToJSON = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      logType,
      totalCount: logs.length,
      logs: logs.map(log => ({
        ...log,
        timestamp: formatTimestamp(log.timestamp),
      })),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `logs_${logType}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>시스템 로그</h1>
          <div className={styles.headerActions}>
            <button onClick={cleanOldLogs} className={styles.cleanButton}>
              오래된 로그 정리
            </button>

            <div className={styles.exportWrapper}>
              <button
                onClick={() => setShowExportMenu(s => !s)}
                className={styles.exportButton}
                disabled={loading || logs.length === 0}
                aria-haspopup="true"
                aria-expanded={showExportMenu}
              >
                내보내기 ▾
              </button>

              {showExportMenu && (
                <div className={styles.exportMenu} role="menu">
                  <button
                    onClick={() => {
                      exportToPDF();
                      setShowExportMenu(false);
                    }}
                    className={styles.exportMenuItem}
                    disabled={loading || logs.length === 0}
                    role="menuitem"
                  >
                    PDF
                  </button>

                  <button
                    onClick={() => {
                      exportToTXT();
                      setShowExportMenu(false);
                    }}
                    className={styles.exportMenuItem}
                    disabled={loading || logs.length === 0}
                    role="menuitem"
                  >
                    메모장(.txt)
                  </button>

                  <button
                    onClick={() => {
                      exportToJSON();
                      setShowExportMenu(false);
                    }}
                    className={styles.exportMenuItem}
                    disabled={loading || logs.length === 0}
                    role="menuitem"
                  >
                    JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.typeSelector}>
            <label>로그 타입:</label>
            <select
              value={logType}
              onChange={e => setLogType(e.target.value as "error" | "access" | "debug")}
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
                  {logs.map((log, index) => {
                    const isExpanded = expandedLogs.has(index);
                    return (
                      <tr
                        key={index}
                        className={isExpanded ? styles.expanded : styles.collapsed}
                        onClick={() => toggleLogExpanded(index)}
                      >
                        <td className={styles.timestamp} data-label="시간">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td data-label="레벨">
                          <span
                            className={styles.level}
                            style={{ backgroundColor: getLevelColor(log.level) }}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td
                          className={styles.errorCode}
                          data-label="에러코드"
                          onClick={e => e.stopPropagation()}
                        >
                          {log.errorCode || "-"}
                        </td>
                        <td
                          className={styles.message}
                          data-label="메시지"
                          onClick={e => e.stopPropagation()}
                        >
                          {log.message}
                        </td>
                        <td
                          className={styles.userId}
                          data-label="사용자"
                          onClick={e => e.stopPropagation()}
                        >
                          {log.userId || "-"}
                        </td>
                        <td
                          className={styles.details}
                          data-label="상세"
                          onClick={e => e.stopPropagation()}
                        >
                          {log.details && typeof log.details === "object" ? (
                            <details>
                              <summary>보기</summary>
                              <pre>{JSON.stringify(log.details, null, 2)}</pre>
                            </details>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
