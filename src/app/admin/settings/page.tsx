/**
 * 관리자 설정 페이지
 * - 비밀번호 변경 기능 제공
 * - 비밀번호 보안 요구사항 안내
 * - 모든 변경 요청은 API를 통해 처리
 */
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import styles from './settings.module.scss';
import { apiFetch } from '@/lib/api';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: {
          currentPassword,
          newPassword,
          confirmPassword,
        },
      });

      setSuccess('비밀번호가 성공적으로 변경되었습니다');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      console.error('Password change error:', error);

      // Handle API errors
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data: { details?: Array<{ field: string; message: string }>; error?: string } }).data;

        if (errorData.details) {
          const errorMessages = errorData.details.map((d: { field: string; message: string }) => d.message).join(', ');
          setError(errorMessages);
        } else {
          setError(errorData.error || '비밀번호 변경에 실패했습니다');
        }
      } else {
        setError('비밀번호 변경 중 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>설정</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>비밀번호 변경</h2>

          <form onSubmit={handleChangePassword} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                required
                autoComplete="current-password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호를 입력하세요"
                required
                autoComplete="new-password"
              />
              <small className={styles.hint}>
                최소 8자 이상, 대문자, 소문자, 숫자, 특수문자 포함
              </small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호를 다시 입력하세요"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>보안 정보</h2>
          <div className={styles.infoBox}>
            <p><strong>비밀번호 요구사항:</strong></p>
            <ul>
              <li>최소 8자 이상</li>
              <li>대문자 1개 이상 포함</li>
              <li>소문자 1개 이상 포함</li>
              <li>숫자 1개 이상 포함</li>
              <li>특수문자 1개 이상 포함</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
