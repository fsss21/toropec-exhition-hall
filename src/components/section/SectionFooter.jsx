import { Link, useNavigate } from 'react-router-dom'
import styles from './section.module.css'

function SectionFooter({ canGoPrev, canGoNext, onPrev, onNext }) {
  const navigate = useNavigate()

  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <button type="button" className={styles.footerButton} onClick={() => navigate(-1)}>
          назад
        </button>
        <Link className={styles.footerButton} to="/">
          главное меню
        </Link>
      </div>

      <div className={styles.arrows}>
        <button
          type="button"
          className={styles.arrow}
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Предыдущий раздел"
        >
          ‹
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Следующий раздел"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default SectionFooter
