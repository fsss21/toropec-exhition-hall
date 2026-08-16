import { useEffect, useState } from 'react'
import styles from './PhotoGallery.module.css'

function PhotoGallery({
  images = [],
  items = [],
  variant = 'album',
  showHeading = false,
  pageSize = 8,
  pageIndex = 0,
}) {
  const [fullscreen, setFullscreen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [broken, setBroken] = useState({})

  const source = items.length ? items : images
  const isExhibits = variant === 'exhibits'
  const pageItems = isExhibits
    ? source.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
    : source
  const current = pageItems[currentIndex] ?? null

  const sourceKey = source.map((item) => item.src).join('|')

  useEffect(() => {
    setFullscreen(false)
    setCurrentIndex(0)
    setBroken({})
  }, [pageIndex, variant, sourceKey])

  useEffect(() => {
    if (pageItems.length <= 1) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setCurrentIndex((index) => (index + 1) % pageItems.length)
      }
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((index) => (index - 1 + pageItems.length) % pageItems.length)
      }
      if (event.key === 'Escape' && fullscreen) {
        setFullscreen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pageItems.length, fullscreen])

  if (!source.length) {
    return null
  }

  const goPrev = () => {
    setCurrentIndex((index) => (index - 1 + pageItems.length) % pageItems.length)
  }

  const goNext = () => {
    setCurrentIndex((index) => (index + 1) % pageItems.length)
  }

  const renderMedia = (image, className) =>
    broken[image.src] ? (
      <div className={styles.placeholderLarge}>
        <span>Изображение ещё не добавлено</span>
        <small>{image.src}</small>
      </div>
    ) : (
      <img
        className={className}
        src={image.src}
        alt={image.alt}
        onError={() => setBroken((state) => ({ ...state, [image.src]: true }))}
      />
    )

  const lightbox = fullscreen && current ? (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || current.caption || 'Просмотр фотографии'}
      onClick={() => setFullscreen(false)}
    >
      <button type="button" className={styles.close} onClick={() => setFullscreen(false)}>
        Закрыть
      </button>
      {pageItems.length > 1 ? (
        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          onClick={(event) => {
            event.stopPropagation()
            goPrev()
          }}
        >
          ‹
        </button>
      ) : null}
      <figure className={styles.figure} onClick={(event) => event.stopPropagation()}>
        {renderMedia(current)}
        {current.caption ? <figcaption>{current.caption}</figcaption> : null}
        {current.description ? (
          <p className={styles.lightboxText}>{current.description}</p>
        ) : null}
      </figure>
      {pageItems.length > 1 ? (
        <button
          type="button"
          className={`${styles.nav} ${styles.next}`}
          onClick={(event) => {
            event.stopPropagation()
            goNext()
          }}
        >
          ›
        </button>
      ) : null}
    </div>
  ) : null

  if (isExhibits) {
    return (
      <section className={`${styles.gallery} ${styles.exhibits}`} aria-label="Каталог предметов">
        {showHeading ? <h2 className={styles.heading}>Галерея</h2> : null}
        <ul className={styles.grid}>
          {pageItems.map((image, index) => (
            <li key={`${image.src}-${index}`}>
              <button
                type="button"
                className={styles.card}
                onClick={() => {
                  setCurrentIndex(index)
                  setFullscreen(true)
                }}
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
                      setBroken((state) => ({ ...state, [image.src]: true }))
                    }
                  />
                )}
                {image.caption ? (
                  <span className={styles.caption}>{image.caption}</span>
                ) : null}
                {image.description ? (
                  <span className={styles.description}>{image.description}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        {lightbox}
      </section>
    )
  }

  if (!current) {
    return null
  }

  return (
    <section
      className={`${styles.gallery} ${styles.album} ${styles[variant] ?? ''}`}
      aria-label="Фотогалерея"
    >
      {showHeading ? <h2 className={styles.heading}>Галерея</h2> : null}

      <div className={styles.albumPhoto}>{renderMedia(current)}</div>

      <div className={styles.albumText}>
        {current.caption ? <p className={styles.albumCaption}>{current.caption}</p> : null}
        {current.description ? (
          <p className={styles.albumDescription}>{current.description}</p>
        ) : null}
      </div>

      <div className={styles.albumControls}>
        <div className={styles.albumNav}>
          <button
            type="button"
            className={styles.albumArrow}
            onClick={goPrev}
            disabled={pageItems.length <= 1}
            aria-label="Предыдущее фото"
          >
            ‹
          </button>
          <span className={styles.albumCounter}>
            {currentIndex + 1} / {pageItems.length}
          </span>
          <button
            type="button"
            className={styles.albumArrow}
            onClick={goNext}
            disabled={pageItems.length <= 1}
            aria-label="Следующее фото"
          >
            ›
          </button>
        </div>

        <button
          type="button"
          className={styles.fullscreenButton}
          onClick={() => setFullscreen(true)}
          aria-label="Полноэкранный режим"
        >
          ⛶
        </button>
      </div>

      {lightbox}
    </section>
  )
}

export default PhotoGallery
