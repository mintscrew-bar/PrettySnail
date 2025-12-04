import Link from 'next/link';
import styles from './PromotionBanner.module.scss';

interface PromotionBannerProps {
  imageUrl: string;
  title?: string | null;
  description?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  imagePosition?: string;
  imageX?: number;
  imageY?: number;
  imageScale?: number;
}

export default function PromotionBanner({
  imageUrl,
  title,
  description,
  linkUrl,
  buttonText,
  buttonUrl,
  imagePosition,
  imageX,
  imageY,
  imageScale
}: PromotionBannerProps) {
  const hasNewPositioning = imageX !== undefined && imageY !== undefined && imageScale !== undefined;

  const content = (
    <div className={styles.banner}>
      <div className={styles.bannerImage}>
        {hasNewPositioning ? (
          <div style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img
              src={imageUrl}
              alt={title || '프로모션 배너'}
              style={{
                position: 'absolute',
                left: `${imageX}%`,
                top: `${imageY}%`,
                transform: `translate(-50%, -50%) scale(${imageScale})`,
                width: '100%',
                height: 'auto'
              }}
            />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title || '프로모션 배너'}
            style={{ objectPosition: imagePosition || 'center' }}
          />
        )}
      </div>
      {(title || description || buttonText) && (
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
            {buttonText && buttonUrl && (
              <Link href={buttonUrl} className={styles.bannerButton}>
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (linkUrl) {
    return (
      <Link href={linkUrl} className={styles.bannerLink}>
        {content}
      </Link>
    );
  }

  return <div className={styles.bannerContainer}>{content}</div>;
}
