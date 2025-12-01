import fs from 'fs';
import path from 'path';
import { ErrorCode } from './errorCodes';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  errorCode?: ErrorCode;
  details?: unknown;
  userId?: string;
  ip?: string;
  endpoint?: string;
}

class Logger {
  private logsDir: string;
  private errorLogFile: string;
  private accessLogFile: string;
  private debugLogFile: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.errorLogFile = path.join(this.logsDir, 'error.log');
    this.accessLogFile = path.join(this.logsDir, 'access.log');
    this.debugLogFile = path.join(this.logsDir, 'debug.log');
    this.ensureLogsDirectory();
  }

  /**
   * logs 디렉토리가 존재하는지 확인하고 없으면 생성
   */
  private ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * 로그 엔트리를 파일에 기록
   */
  private writeToFile(filePath: string, entry: LogEntry) {
    try {
      const logLine = JSON.stringify(entry) + '\n';
      fs.appendFileSync(filePath, logLine, 'utf-8');
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  /**
   * 콘솔에 로그 출력 (개발 환경용)
   */
  private logToConsole(entry: LogEntry) {
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev) return;

    const colorCodes = {
      [LogLevel.INFO]: '\x1b[36m', // Cyan
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.DEBUG]: '\x1b[90m', // Gray
    };

    const resetCode = '\x1b[0m';
    const color = colorCodes[entry.level] || '';

    console.log(
      `${color}[${entry.timestamp}] [${entry.level}]${resetCode} ${entry.message}`,
      entry.errorCode ? `(${entry.errorCode})` : '',
      entry.details ? entry.details : ''
    );
  }

  /**
   * 일반 정보 로그
   */
  info(message: string, details?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      details,
    };

    this.logToConsole(entry);
    this.writeToFile(this.accessLogFile, entry);
  }

  /**
   * 경고 로그
   */
  warn(message: string, details?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      details,
    };

    this.logToConsole(entry);
    this.writeToFile(this.errorLogFile, entry);
  }

  /**
   * 에러 로그
   */
  error(
    message: string,
    errorCode?: ErrorCode,
    details?: unknown,
    context?: {
      userId?: string;
      ip?: string;
      endpoint?: string;
    }
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      errorCode,
      details,
      ...context,
    };

    this.logToConsole(entry);
    this.writeToFile(this.errorLogFile, entry);
  }

  /**
   * 디버그 로그 (개발 환경에서만 사용)
   */
  debug(message: string, details?: unknown) {
    if (process.env.NODE_ENV === 'production') return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      details,
    };

    this.logToConsole(entry);
    this.writeToFile(this.debugLogFile, entry);
  }

  /**
   * 로그 파일 읽기 (최근 N개 라인)
   */
  readLogs(logType: 'error' | 'access' | 'debug', limit: number = 100): LogEntry[] {
    try {
      const fileMap = {
        error: this.errorLogFile,
        access: this.accessLogFile,
        debug: this.debugLogFile,
      };

      const filePath = fileMap[logType];

      if (!fs.existsSync(filePath)) {
        return [];
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line);

      // 최근 로그부터 반환 (역순)
      const recentLines = lines.slice(-limit).reverse();

      return recentLines.map(line => {
        try {
          return JSON.parse(line) as LogEntry;
        } catch {
          // 파싱 실패 시 빈 객체 반환
          return {
            timestamp: new Date().toISOString(),
            level: LogLevel.ERROR,
            message: 'Failed to parse log entry',
            details: line,
          };
        }
      });
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  /**
   * 로그 파일 정리 (오래된 로그 삭제)
   * 지정된 일수보다 오래된 로그를 삭제
   */
  cleanOldLogs(daysToKeep: number = 30) {
    const files = [this.errorLogFile, this.accessLogFile, this.debugLogFile];

    files.forEach(filePath => {
      if (!fs.existsSync(filePath)) return;

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.trim().split('\n').filter(line => line);

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const filteredLines = lines.filter(line => {
          try {
            const entry = JSON.parse(line) as LogEntry;
            const entryDate = new Date(entry.timestamp);
            return entryDate >= cutoffDate;
          } catch {
            return false;
          }
        });

        fs.writeFileSync(filePath, filteredLines.join('\n') + '\n', 'utf-8');
        this.info(`Cleaned old logs from ${path.basename(filePath)}`, {
          before: lines.length,
          after: filteredLines.length,
        });
      } catch (error) {
        console.error(`Failed to clean logs for ${filePath}:`, error);
      }
    });
  }
}

// 싱글톤 인스턴스 생성
export const logger = new Logger();
