import PhotoGallery from '../../PhotoGallery.jsx'
import styles from '../section.module.css'

function ExhibitsLayout({
  title,
  subtitle,
  items = [],
  pageSize = 8,
  pageIndex = 0,
  pageCount = 1,
}) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <PhotoGallery
        items={items}
        variant="exhibits"
        showHeading={false}
        pageSize={pageSize}
        pageIndex={pageIndex}
      />
      {pageCount > 1 ? (
        <p className={styles.pageHint}>
          Страница {pageIndex + 1} из {pageCount}
        </p>
      ) : null}
    </>
  )
}

export default ExhibitsLayout
