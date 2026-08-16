import PhotoGallery from '../../PhotoGallery.jsx'
import styles from '../section.module.css'

function GalleryLayout({ title, subtitle, images = [] }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <PhotoGallery images={images} variant="album" showHeading={false} />
    </>
  )
}

export default GalleryLayout
