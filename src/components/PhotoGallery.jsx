import { useEffect, useState } from 'react'
import styles from './PhotoGallery.module.css'

function PhotoGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [broken, setBroken] = useState({})

  const active = activeIndex !== null ? images[activeIndex] : null

  useEffect(() => {
    if (activeIndex === null) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => (index + 1) % images.length)
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => (index - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, images.length])

  if (!images.length) {
    return null
  }

  return (
    <section className={styles.gallery} aria-label="Фотогалерея">
      <h2 className={styles.heading}>Галерея</h2>
      <ul className={styles.grid}>
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`}>
            <button
              type="button"
              className={styles.card}
              onClick={() => setActiveIndex(index)}
            >
              {broken[image.src] ? (
                <div className={styles.placeholder}>
                  <span>Нет файла</span>
                  <small>{image.src}</small>
                </div>
              ) : (
                <img
                  src={image.src}
                  alt={image.alt}
                  onError={() =>
                    setBroken((current) => ({ ...current, [image.src]: true }))
                  }
                />
              )}
              {image.caption ? (
                <span className={styles.caption}>{image.caption}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={active.alt || active.caption || 'Просмотр фотографии'}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className={styles.close}
            onClick={() => setActiveIndex(null)}
          >
            Закрыть
          </button>
          {images.length > 1 ? (
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={(event) => {
                event.stopPropagation()
                setActiveIndex((index) => (index - 1 + images.length) % images.length)
              }}
            >
              ‹
            </button>
          ) : null}
          <figure
            className={styles.figure}
            onClick={(event) => event.stopPropagation()}
          >
            {broken[active.src] ? (
              <div className={styles.placeholderLarge}>
                <span>Изображение ещё не добавлено</span>
                <small>{active.src}</small>
              </div>
            ) : (
              <img src={active.src} alt={active.alt} />
            )}
            {active.caption ? <figcaption>{active.caption}</figcaption> : null}
          </figure>
          {images.length > 1 ? (
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={(event) => {
                event.stopPropagation()
                setActiveIndex((index) => (index + 1) % images.length)
              }}
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default PhotoGallery
