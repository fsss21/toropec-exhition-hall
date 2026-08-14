import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SubsectionsModal.module.css'

function SubsectionsModal({ section, onClose }) {
  const navigate = useNavigate()
  const items = section.subsections ?? []
  const top = items.slice(0, 2)
  const bottom = items.slice(2)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const openSubsection = (sub) => {
    navigate(`/section/${section.id}/${sub.id}`)
    onClose()
  }

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="subsections-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <h2 id="subsections-title" className={styles.title}>
          {section.title}
        </h2>
        <div className={styles.rule} aria-hidden="true" />
        <div className={styles.grid}>
          <div className={styles.top}>
            {top.map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={styles.button}
                onClick={() => openSubsection(sub)}
              >
                {sub.title}
              </button>
            ))}
          </div>
          {bottom.length > 0 ? (
            <div className={styles.bottom}>
              {bottom.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={styles.button}
                  onClick={() => openSubsection(sub)}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default SubsectionsModal
