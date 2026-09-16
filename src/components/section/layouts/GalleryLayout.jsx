import PhotoGallery from '../../PhotoGallery.jsx'
import styles from '../section.module.css'

function GalleryLayout({ title, subtitle, images = [] }) {
  return (
    <div className={styles.galleryRoot}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.galleryFrame}>
        <PhotoGallery images={images} variant="album" showHeading={false} />
      </div>
    </div>
  )
}

export default GalleryLayout
