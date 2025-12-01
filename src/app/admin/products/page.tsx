'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Product } from '@/types';
import styles from './products.module.scss';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    category: '',
    name: '',
    tags: [],
    description: '',
    badge: '',
    thumbnails: [],
    detailImages: [],
    imageUrl: '',
    storeUrl: '',
    featured: false,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);

  // 자동완성용 기존 태그/배지/카테고리 목록
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [existingBadges, setExistingBadges] = useState<string[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showBadgeSuggestions, setShowBadgeSuggestions] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);

      // 기존 태그, 배지, 카테고리 추출
      const tags = new Set<string>();
      const badges = new Set<string>();
      const categories = new Set<string>();
      data.forEach((product: Product) => {
        product.tags?.forEach(tag => tags.add(tag));
        if (product.badge) badges.add(product.badge);
        if (product.category) categories.add(product.category);
      });
      setExistingTags(Array.from(tags));
      setExistingBadges(Array.from(badges));
      setExistingCategories(Array.from(categories));
    } catch {
      alert('제품을 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/products/${editingId}` : '/api/products';

    try {
      // 빈 문자열을 undefined로 변환하여 validation 통과
      const cleanedData = {
        ...formData,
        storeUrl: formData.storeUrl?.trim() || undefined,
        badge: formData.badge?.trim() || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
      };

      const token = localStorage.getItem('adminToken');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      if (res.ok) {
        alert(editingId ? '제품이 수정되었습니다' : '제품이 추가되었습니다');
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchProducts();
      } else {
        const errorData = await res.json();
        console.error('Validation error:', errorData);
        if (errorData.details) {
          console.error('Validation details:', JSON.stringify(errorData.details, null, 2));
          const errorMessages = errorData.details.map((d: any) => `${d.field}: ${d.message}`).join('\n');
          alert(`Validation 오류:\n${errorMessages}`);
        } else {
          alert(`오류: ${errorData.error || '제품 저장에 실패했습니다'}`);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('오류가 발생했습니다');
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({
          ...formData,
          thumbnails: [...(formData.thumbnails || []), data.url],
        });
      } else {
        alert('이미지 업로드에 실패했습니다');
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDetail(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({
          ...formData,
          detailImages: [...(formData.detailImages || []), data.url],
        });
      } else {
        alert('이미지 업로드에 실패했습니다');
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다');
    } finally {
      setUploadingDetail(false);
    }
  };

  const removeThumbnail = (index: number) => {
    const newThumbnails = [...(formData.thumbnails || [])];
    newThumbnails.splice(index, 1);
    setFormData({ ...formData, thumbnails: newThumbnails });
  };

  const removeDetailImage = (index: number) => {
    const newDetailImages = [...(formData.detailImages || [])];
    newDetailImages.splice(index, 1);
    setFormData({ ...formData, detailImages: newDetailImages });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert('제품이 삭제되었습니다');
        fetchProducts();
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      tags: [],
      description: '',
      badge: '',
      thumbnails: [],
      detailImages: [],
      imageUrl: '',
      storeUrl: '',
      featured: false,
      isActive: true,
    });
    setTagInput('');
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag.trim()],
      });
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    setFormData({ ...formData, tags: newTags });
  };


  const filteredTagSuggestions = existingTags.filter(tag =>
    tag.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags?.includes(tag)
  );

  const filteredBadgeSuggestions = existingBadges.filter(badge =>
    badge.toLowerCase().includes((formData.badge || '').toLowerCase())
  );

  const filteredCategorySuggestions = existingCategories.filter(category =>
    category.toLowerCase().includes((formData.category || '').toLowerCase())
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>제품 관리</h1>
          <button onClick={() => { setShowForm(!showForm); resetForm(); setEditingId(null); }} className={styles.addButton}>
            {showForm ? '취소' : '+ 제품 추가'}
          </button>
        </header>

        {showForm && (
          <div className={styles.formCard}>
            <h2>{editingId ? '제품 수정' : '새 제품 추가'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>

              <div className={styles.formGroup}>
                <label>카테고리*</label>
                <div className={styles.categoryInputWrapper}>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setShowCategorySuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowCategorySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                    placeholder="예: 생물, 손질, 냉동"
                    required
                  />
                  {showCategorySuggestions && filteredCategorySuggestions.length > 0 && (
                    <div className={styles.suggestions}>
                      {filteredCategorySuggestions.map((category, index) => (
                        <div
                          key={index}
                          className={styles.suggestion}
                          onClick={() => {
                            setFormData({ ...formData, category });
                            setShowCategorySuggestions(false);
                          }}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>제품명*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="제품명을 입력하세요"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>태그</label>
                <div className={styles.tagContainer}>
                  <div className={styles.tags}>
                    {formData.tags?.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                        <button type="button" onClick={() => removeTag(index)} className={styles.tagRemove}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className={styles.tagInputWrapper}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagSuggestions(e.target.value.length > 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="태그 입력 후 Enter"
                    />
                    {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                      <div className={styles.suggestions}>
                        {filteredTagSuggestions.map((tag, index) => (
                          <div
                            key={index}
                            className={styles.suggestion}
                            onClick={() => addTag(tag)}
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>설명*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="제품 설명을 입력하세요"
                  required
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label>배지</label>
                <div className={styles.badgeInputWrapper}>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => {
                      setFormData({ ...formData, badge: e.target.value });
                      setShowBadgeSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowBadgeSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowBadgeSuggestions(false), 200)}
                    placeholder="예: 베스트, 인기, NEW"
                  />
                  {showBadgeSuggestions && filteredBadgeSuggestions.length > 0 && (
                    <div className={styles.suggestions}>
                      {filteredBadgeSuggestions.map((badge, index) => (
                        <div
                          key={index}
                          className={styles.suggestion}
                          onClick={() => {
                            setFormData({ ...formData, badge });
                            setShowBadgeSuggestions(false);
                          }}
                        >
                          {badge}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>추천 제품</label>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <label htmlFor="featured">메인 페이지에 추천 제품으로 표시</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>활성화 상태</label>
                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive">제품을 활성화하여 사이트에 표시</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>썸네일 이미지</label>
                <div className={styles.imageUploadArea}>
                  {formData.thumbnails && formData.thumbnails.length > 0 && (
                    <div className={styles.imagePreviewGrid}>
                      {formData.thumbnails.map((url, index) => (
                        <div key={index} className={styles.imagePreviewItem}>
                          <img src={url} alt={`썸네일 ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeThumbnail(index)}
                            className={styles.removeImageButton}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className={styles.uploadButton}>
                    {uploadingThumbnail ? '업로드 중...' : '+ 썸네일 추가'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>상세 이미지</label>
                <div className={styles.imageUploadArea}>
                  {formData.detailImages && formData.detailImages.length > 0 && (
                    <div className={styles.imagePreviewGrid}>
                      {formData.detailImages.map((url, index) => (
                        <div key={index} className={styles.imagePreviewItem}>
                          <img src={url} alt={`상세 ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeDetailImage(index)}
                            className={styles.removeImageButton}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className={styles.uploadButton}>
                    {uploadingDetail ? '업로드 중...' : '+ 상세 이미지 추가'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDetailImageUpload}
                      disabled={uploadingDetail}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>스토어 URL</label>
                <input
                  type="url"
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                  placeholder="네이버 스토어 등 외부 링크"
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                {editingId ? '수정하기' : '추가하기'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>로딩중...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>등록된 제품이 없습니다</div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                {product.thumbnails?.[0] ? (
                  <img src={product.thumbnails[0]} alt={product.name} className={styles.productThumb} />
                ) : (
                  <div className={styles.productPlaceholder}>📦</div>
                )}
                <div className={styles.productBody}>
                  <h3>{product.name}</h3>
                  <p className={styles.category}>{product.category}</p>
                  <div className={styles.productTags}>
                    {product.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className={styles.miniTag}>{tag}</span>
                    ))}
                    {product.featured && (
                      <span className={styles.featuredBadge}>⭐ 추천</span>
                    )}
                    {!product.isActive && (
                      <span className={styles.inactiveBadge}>비활성</span>
                    )}
                  </div>
                  <p className={styles.description}>{product.description?.substring(0, 80)}...</p>
                  <div className={styles.actions}>
                    <button onClick={() => handleEdit(product)} className={styles.editButton}>
                      수정
                    </button>
                    <button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
