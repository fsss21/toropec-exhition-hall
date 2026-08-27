import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SubsectionsModal.module.css'

function SubsectionsModal({ section, onClose }) {
  const navigate = useNavigate()
  const items = section.subsections ?? []
  const top = items.slice(0, 2)
  const middle = items.slice(2, 4)
  const bottom = items.slice(4, 6)
  const rows = [
    { key: 'top', items: top, className: styles.top },
    { key: 'middle', items: middle, className: styles.middle },
    { key: 'bottom', items: bottom, className: styles.bottom },
  ].filter((row) => row.items.length > 0)

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
          {rows.map((row) => (
            <div key={row.key} className={row.className}>
              {row.items.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={styles.button}
                  onClick={() => openSubsection(sub)}
                >
                  {sub.shortTitle ?? sub.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubsectionsModal
