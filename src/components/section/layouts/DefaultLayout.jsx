import PhotoGallery from '../../PhotoGallery.jsx'
import styles from '../section.module.css'

function DefaultLayout({ title, subtitle, texts = [], images = [] }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.texts}>
        {texts.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {images.length ? <PhotoGallery images={images} variant="album" showHeading={false} /> : null}
    </>
  )
}

export default DefaultLayout
