import PhotoGallery from '../../PhotoGallery.jsx'
import styles from '../section.module.css'

function TextGalleryLayout({ title, subtitle, texts = [], images = [] }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      <div className={styles.split}>
        <div className={styles.splitText}>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          <div className={styles.texts}>
            {texts.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        <PhotoGallery images={images} variant="side" showHeading={false} />
      </div>
    </>
  )
}

export default TextGalleryLayout
