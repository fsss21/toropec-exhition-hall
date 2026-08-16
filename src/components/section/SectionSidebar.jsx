import { useNavigate } from 'react-router-dom'
import { getSectionPath } from '../../utils/sectionNavigation.js'
import DotRule from './DotRule.jsx'
import styles from './section.module.css'

function SectionSidebar({
  sections,
  section,
  subId,
  expandedId,
  visibleSections,
  canScrollUp,
  canScrollDown,
  onScrollMenu,
}) {
  const navigate = useNavigate()

  const openSection = (item) => {
    if (item.id === section.id) {
      return
    }
    navigate(getSectionPath(item))
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.navStack}>
        <div className={styles.scrollSlot}>
          {canScrollUp ? (
            <button
              type="button"
              className={styles.scrollHint}
              aria-label="Прокрутить меню вверх"
              onClick={() => onScrollMenu(-1)}
            >
              ▲
            </button>
          ) : null}
        </div>

        <div className={styles.menu}>
          {visibleSections.map((item) => {
            const hasSubs = Boolean(item.subsections?.length)
            const itemExpanded = hasSubs && expandedId === item.id
            const isSectionActive = item.id === section.id

            return (
              <div
                key={item.id}
                className={`${styles.group} ${itemExpanded ? styles.expanded : ''}`}
              >
                {isSectionActive ? <DotRule /> : null}
                <button
                  type="button"
                  className={`${styles.sideButton} ${isSectionActive ? styles.active : ''}`}
                  onClick={() => openSection(item)}
                >
                  {item.shortTitle}
                </button>
                {itemExpanded ? (
                  <div className={styles.branch}>
                    <div className={styles.subs}>
                      {item.subsections.map((sub) => {
                        const isSubActive = item.id === section.id && sub.id === subId

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            className={`${styles.sideButton} ${styles.subButton} ${isSubActive ? styles.active : ''}`}
                            onClick={() => {
                              if (sub.id !== subId) {
                                navigate(`/section/${item.id}/${sub.id}`)
                              }
                            }}
                          >
                            {sub.shortTitle ?? sub.title}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
                {isSectionActive ? <DotRule /> : null}
              </div>
            )
          })}
        </div>

        <div className={styles.scrollSlot}>
          {canScrollDown ? (
            <button
              type="button"
              className={styles.scrollHint}
              aria-label="Прокрутить меню вниз"
              onClick={() => onScrollMenu(1)}
            >
              ▼
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

export default SectionSidebar
