'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import BannerImageEditor from '@/components/BannerImageEditor';
import { Banner } from '@/types';
import styles from './banners.module.scss';
import { initializeCsrfToken, uploadFile, apiFetch } from '@/lib/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Banner>>({
    type: 'promotion',
    title: '',
    description: '',
    contentPosition: 'middle-left',
    titleColor: '#ffffff',
    descriptionColor: '#e9c46a',
    imageUrl: '',
    imageX: 50,
    imageY: 50,
    imageScale: 1,
    linkUrl: '',
    buttonText: '',
    buttonUrl: '',
    showButton: false,
    position: 1,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Initialize CSRF token before making any requests
    initializeCsrfToken().then(() => {
      fetchBanners();
    });
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners', { credentials: 'include' });
      const data = await res.json();
      setBanners(data);
    } catch {
      alert('배너를 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handlePositionChange = useCallback((pos: { x: number; y: number; scale: number }) => {
    setFormData(prev => ({
      ...prev,
      imageX: pos.x,
      imageY: pos.y,
      imageScale: pos.scale
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/banners/${editingId}` : '/api/banners';

    try {
      // 빈 문자열을 undefined로 변환하여 validation 통과
      const cleanedData = {
        ...formData,
        title: formData.title?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        linkUrl: formData.linkUrl?.trim() || undefined,
        buttonText: formData.buttonText?.trim() || undefined,
        buttonUrl: formData.buttonUrl?.trim() || undefined,
      };

      await apiFetch(url, {
        method,
        body: cleanedData,
      });

      alert(editingId ? '배너가 수정되었습니다' : '배너가 추가되었습니다');
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchBanners();
    } catch (error: unknown) {
      console.error('Submit error:', error);

      // Handle API errors
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data: { error?: string } }).data;
        alert(`오류: ${errorData.error || '배너 저장에 실패했습니다'}`);
      } else {
        alert('오류가 발생했습니다');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await apiFetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      alert('배너가 삭제되었습니다');
      fetchBanners();
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleEdit = (banner: Banner) => {
    setFormData(banner);
    setEditingId(banner.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'promotion',
      title: '',
      description: '',
      contentPosition: 'middle-left',
      titleColor: '#ffffff',
      descriptionColor: '#e9c46a',
      imageUrl: '',
      imageX: 50,
      imageY: 50,
      imageScale: 1,
      linkUrl: '',
      buttonText: '',
      buttonUrl: '',
      showButton: false,
      position: 1,
      isActive: true,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = await uploadFile(file);
      setFormData({
        ...formData,
        imageUrl: data.url,
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('이미지 업로드에 실패했습니다');
    } finally {
      setUploadingImage(false);
    }
  };

  const getPositionLabel = (position: number) => {
    const labels: { [key: number]: string } = {
      0: '메인 히어로',
      1: '브랜드 가치 후',
      2: '제품 쇼케이스 후',
      3: '하단',
    };
    return labels[position] || `위치 ${position}`;
  };

  const mainBanner = banners.find(b => b.type === 'main');
  const promotionBanners = banners.filter(b => b.type === 'promotion').sort((a, b) => a.position - b.position);

  return (
    <AdminLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>배너 관리</h1>
          <button onClick={() => { setShowForm(!showForm); resetForm(); setEditingId(null); }} className={styles.addButton}>
            {showForm ? '취소' : '+ 배너 추가'}
          </button>
        </header>

        {showForm && (
          <div className={styles.formCard}>
            <h2>{editingId ? '배너 수정' : '새 배너 추가'}</h2>

            {/* 이미지 편집기 섹션 */}
            {formData.imageUrl && (
              <div className={styles.previewSection}>
                <h3>이미지 위치 및 크기 조정</h3>
                <BannerImageEditor
                  imageUrl={formData.imageUrl}
                  onPositionChange={handlePositionChange}
                  initialPosition={{
                    x: formData.imageX || 50,
                    y: formData.imageY || 50,
                    scale: formData.imageScale || 1
                  }}
                />
              </div>
            )}

            {/* 미리보기 섹션 */}
            {formData.imageUrl && (
              <div className={styles.previewSection}>
                <h3>최종 미리보기</h3>
                <div className={styles.previewBanner} style={{ position: 'relative', minHeight: '400px', overflow: 'hidden', borderRadius: '8px' }}>
                  <div className={styles.previewImage} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={formData.imageUrl}
                        alt="미리보기"
                        style={{
                          position: 'absolute',
                          left: `${formData.imageX || 50}%`,
                          top: `${formData.imageY || 50}%`,
                          transform: `translate(-50%, -50%) scale(${formData.imageScale || 1})`,
                          width: '100%',
                          height: 'auto',
                          minHeight: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.previewOverlay} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    padding: '40px',
                    alignItems: formData.contentPosition?.includes('top') ? 'flex-start' : formData.contentPosition?.includes('bottom') ? 'flex-end' : 'center',
                    justifyContent: formData.contentPosition?.includes('left') ? 'flex-start' : formData.contentPosition?.includes('right') ? 'flex-end' : 'center'
                  }}>
                    <div className={styles.previewContent} style={{
                      maxWidth: '600px',
                      textAlign: formData.contentPosition?.includes('left') ? 'left' : formData.contentPosition?.includes('right') ? 'right' : 'center'
                    }}>
                      {formData.title && (
                        <h4 style={{
                          color: formData.titleColor || '#ffffff',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          marginBottom: '10px'
                        }}>
                          {formData.title}
                        </h4>
                      )}
                      {formData.description && (
                        <p style={{
                          color: formData.descriptionColor || '#e9c46a',
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          marginBottom: '20px'
                        }}>
                          {formData.description}
                        </p>
                      )}
                      {formData.buttonText && (
                        <div className={styles.previewButton} style={{
                          display: 'inline-block',
                          padding: '12px 24px',
                          background: '#2ea100',
                          color: '#ffffff',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}>
                          {formData.buttonText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.formGroup}>
                <label>배너 타입*</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'main' | 'promotion' })}
                  required
                >
                  <option value="main">메인 히어로 배너</option>
                  <option value="promotion">프로모션 배너</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>제목</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="배너 제목 (선택)"
                />
              </div>

              <div className={styles.formGroup}>
                <label>설명</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="배너 설명 (선택)"
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>타이틀/버튼 위치</label>
                <select
                  value={formData.contentPosition || 'middle-left'}
                  onChange={(e) => setFormData({ ...formData, contentPosition: e.target.value as 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' })}
                >
                  <option value="top-left">왼쪽 위</option>
                  <option value="top-center">중앙 위</option>
                  <option value="top-right">오른쪽 위</option>
                  <option value="middle-left">왼쪽 중앙</option>
                  <option value="middle-center">중앙</option>
                  <option value="middle-right">오른쪽 중앙</option>
                  <option value="bottom-left">왼쪽 아래</option>
                  <option value="bottom-center">중앙 아래</option>
                  <option value="bottom-right">오른쪽 아래</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>제목 색상</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.titleColor || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                    style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.titleColor || '#ffffff'}
                    onChange={(e) => setFormData({ ...formData, titleColor: e.target.value })}
                    placeholder="#ffffff"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>설명 색상</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.descriptionColor || '#e9c46a'}
                    onChange={(e) => setFormData({ ...formData, descriptionColor: e.target.value })}
                    style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={formData.descriptionColor || '#e9c46a'}
                    onChange={(e) => setFormData({ ...formData, descriptionColor: e.target.value })}
                    placeholder="#e9c46a"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {formData.type === 'promotion' && (
                <div className={styles.formGroup}>
                  <label>위치*</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                    required
                  >
                    <option value={1}>브랜드 가치 섹션 후</option>
                    <option value={2}>제품 쇼케이스 섹션 후</option>
                    <option value={3}>하단</option>
                  </select>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>배너 이미지*</label>
                <div className={styles.imageUploadArea}>
                  {formData.imageUrl && (
                    <div className={styles.imagePreview}>
                      <img src={formData.imageUrl} alt="배너 미리보기" />
                    </div>
                  )}
                  <label className={styles.uploadButton}>
                    {uploadingImage ? '업로드 중...' : formData.imageUrl ? '이미지 변경' : '이미지 업로드'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>


              <div className={styles.formGroup}>
                <label>링크 URL</label>
                <input
                  type="url"
                  value={formData.linkUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="배너 전체 클릭 시 이동할 URL (선택)"
                />
              </div>

              <div className={styles.formGroup}>
                <label>버튼 텍스트</label>
                <input
                  type="text"
                  value={formData.buttonText || ''}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="버튼에 표시될 텍스트 (선택)"
                />
              </div>

              <div className={styles.formGroup}>
                <label>버튼 URL</label>
                <input
                  type="url"
                  value={formData.buttonUrl || ''}
                  onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                  placeholder="버튼 클릭 시 이동할 URL (선택)"
                />
              </div>

              {formData.type === 'main' && (
                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.showButton || false}
                      onChange={(e) => setFormData({ ...formData, showButton: e.target.checked })}
                    />
                    <span>Hero 섹션에 버튼 표시 (스크롤 고정)</span>
                  </label>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>활성화</span>
                </label>
              </div>

              <button type="submit" className={styles.submitButton}>
                {editingId ? '수정하기' : '추가하기'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>로딩중...</div>
        ) : (
          <>
            {/* 메인 배너 섹션 */}
            <section className={styles.section}>
              <h2>메인 히어로 배너</h2>
              {mainBanner ? (
                <div className={styles.bannerCard}>
                  <div className={styles.bannerImage}>
                    <img src={mainBanner.imageUrl} alt="메인 배너" />
                    {!mainBanner.isActive && <div className={styles.inactiveBadge}>비활성</div>}
                  </div>
                  <div className={styles.bannerInfo}>
                    <div className={styles.bannerMeta}>
                      <span className={styles.bannerType}>메인 배너</span>
                      {mainBanner.linkUrl && <span className={styles.bannerLink}>🔗 링크: {mainBanner.linkUrl}</span>}
                      {mainBanner.showButton && <span className={styles.bannerLink}>✅ Hero 버튼 표시</span>}
                    </div>
                    <div className={styles.actions}>
                      <button onClick={() => handleEdit(mainBanner)} className={styles.editButton}>수정</button>
                      <button onClick={() => handleDelete(mainBanner.id)} className={styles.deleteButton}>삭제</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.empty}>메인 배너가 없습니다. 배너를 추가하세요.</div>
              )}
            </section>

            {/* 프로모션 배너 섹션 */}
            <section className={styles.section}>
              <h2>프로모션 배너</h2>
              {promotionBanners.length === 0 ? (
                <div className={styles.empty}>프로모션 배너가 없습니다</div>
              ) : (
                <div className={styles.bannersGrid}>
                  {promotionBanners.map((banner) => (
                    <div key={banner.id} className={styles.bannerCard}>
                      <div className={styles.bannerImage}>
                        <img src={banner.imageUrl} alt={banner.title || '프로모션 배너'} />
                        {!banner.isActive && <div className={styles.inactiveBadge}>비활성</div>}
                      </div>
                      <div className={styles.bannerInfo}>
                        <h3>{banner.title || '제목 없음'}</h3>
                        {banner.description && <p>{banner.description}</p>}
                        <div className={styles.bannerMeta}>
                          <span className={styles.position}>📍 {getPositionLabel(banner.position)}</span>
                          {banner.linkUrl && <span className={styles.bannerLink}>🔗 링크: {banner.linkUrl}</span>}
                          {banner.buttonText && <span className={styles.bannerLink}>🔘 버튼: {banner.buttonText}</span>}
                          {banner.buttonUrl && <span className={styles.bannerLink}>🔗 버튼 URL: {banner.buttonUrl}</span>}
                          {banner.showButton && <span className={styles.bannerLink}>✅ Hero 버튼 표시</span>}
                        </div>
                        <div className={styles.actions}>
                          <button onClick={() => handleEdit(banner)} className={styles.editButton}>수정</button>
                          <button onClick={() => handleDelete(banner.id)} className={styles.deleteButton}>삭제</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
