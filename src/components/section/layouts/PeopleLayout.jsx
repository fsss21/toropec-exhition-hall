import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PhotoGallery from '../../PhotoGallery.jsx'
import { resolveImageSrc } from '../../../utils/imageSrc.js'
import styles from '../section.module.css'

function PeopleLayout({
  title,
  subtitle,
  people = [],
  groups = [],
  onPrevSection,
  onNextSection,
  canGoPrev,
  canGoNext,
  hideFooterArrowsOnPerson = false,
}) {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null)
  const [broken, setBroken] = useState({})

  const sections = useMemo(() => {
    if (groups.length) {
      return groups
    }
    return people.length ? [{ id: 'all', title: null, people }] : []
  }, [groups, people])

  const flatPeople = useMemo(
    () => sections.flatMap((group) => group.people ?? []),
    [sections],
  )

  const selectedIndex = flatPeople.findIndex((person) => person.id === selectedId)
  const person = selectedIndex >= 0 ? flatPeople[selectedIndex] : null
  const activeGroup =
    sections.find((group) =>
      (group.people ?? []).some((item) => item.id === selectedId),
    ) ?? null
  const groupPeople = activeGroup?.people ?? flatPeople
  const groupIndex = groupPeople.findIndex((item) => item.id === selectedId)

  const goPerson = (direction) => {
    if (!groupPeople.length || groupIndex < 0) {
      return
    }
    const next = (groupIndex + direction + groupPeople.length) % groupPeople.length
    setSelectedId(groupPeople[next].id)
  }

  const handleBack = () => {
    if (person) {
      setSelectedId(null)
      return
    }
    navigate(-1)
  }

  const handleSectionNav = (direction) => {
    if (person) {
      setSelectedId(null)
      return
    }
    if (direction < 0) {
      onPrevSection?.()
      return
    }
    onNextSection?.()
  }

  const renderPortraitCard = (item) => {
    const portraitSrc = resolveImageSrc(item.portrait?.src)

    return (
      <li key={item.id}>
        <button
          type="button"
          className={styles.personCard}
          onClick={() => setSelectedId(item.id)}
        >
          {broken[item.portrait?.src] || !portraitSrc ? (
            <div className={styles.personPlaceholder}>Нет портрета</div>
          ) : (
            <img
              src={portraitSrc}
              alt={item.portrait.alt || item.name}
              onError={() =>
                setBroken((state) => ({
                  ...state,
                  [item.portrait.src]: true,
                }))
              }
            />
          )}
          <span className={styles.personName}>{item.name}</span>
        </button>
      </li>
    )
  }

  return (
    <div className={styles.peopleRoot}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

      <div className={styles.peopleBody}>
        {!person ? (
          <div className={styles.peopleSections}>
            {sections.map((group) => (
              <div key={group.id} className={styles.peopleSection}>
                {group.title ? (
                  <h2 className={styles.peopleSectionTitle}>{group.title}</h2>
                ) : null}
                <ul className={styles.peopleGrid}>
                  {(group.people ?? []).map(renderPortraitCard)}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.personView}>
            <div
              className={`${styles.personSplit} ${!(person.images ?? []).length ? styles.personSplitTextOnly : ''}`}
            >
              <div className={styles.personText}>
                {activeGroup?.title ? (
                  <p className={styles.personGroupLabel}>{activeGroup.title}</p>
                ) : null}
                <h2 className={styles.personTitle}>{person.name}</h2>
                <div className={styles.texts}>
                  {(person.texts ?? []).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className={styles.personTextNav}>
                  <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => goPerson(-1)}
                    disabled={groupPeople.length <= 1}
                    aria-label="Предыдущий человек"
                  >
                    ‹
                  </button>
                  <span className={styles.pageHint}>
                    {groupIndex + 1} / {groupPeople.length}
                  </span>
                  <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => goPerson(1)}
                    disabled={groupPeople.length <= 1}
                    aria-label="Следующий человек"
                  >
                    ›
                  </button>
                </div>
              </div>

            <PhotoGallery
              key={person.id}
              images={person.images ?? []}
              variant="side"
              showHeading={false}
            />
            </div>
          </div>
        )}
      </div>

      <div className={styles.personFooter}>
        <div className={styles.footerLeft}>
          <button type="button" className={styles.footerButton} onClick={handleBack}>
            назад
          </button>
          <Link className={styles.footerButton} to="/">
            главное меню
          </Link>
        </div>

        {hideFooterArrowsOnPerson && person ? null : (
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => handleSectionNav(-1)}
              disabled={!person && !canGoPrev}
              aria-label="Предыдущий подраздел"
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => handleSectionNav(1)}
              disabled={!person && !canGoNext}
              aria-label="Следующий подраздел"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PeopleLayout
