import { useState } from 'react'
import { Link } from 'react-router-dom'
import themeImg from '../assets/main_theme_img.jpg'
import themeImg4k from '../assets/main_theme_img-4k.jpg'
import SubsectionsModal from '../components/SubsectionsModal.jsx'
import styles from './HomePage.module.css'

function HomePage({ data }) {
  const [modalSection, setModalSection] = useState(null)
  const rows = [
    data.sections.slice(0, 3),
    data.sections.slice(3, 6),
    data.sections.slice(6, 8),
  ]

  const renderButton = (section) => {
    if (section.subsections?.length) {
      return (
        <button
          key={section.id}
          type="button"
          className={styles.button}
          onClick={() => setModalSection(section)}
        >
          {section.shortTitle}
        </button>
      )
    }

    return (
      <Link key={section.id} className={styles.button} to={`/section/${section.id}`}>
        {section.shortTitle}
      </Link>
    )
  }

  return (
    <main
      className={styles.page}
      style={{
        backgroundImage: `image-set(url("${themeImg}") 1x, url("${themeImg4k}") 2x)`,
      }}
    >
      <nav className={styles.nav} aria-label="Разделы выставки">
        {rows.map((items, index) => {
          const isPair = items.length === 2
          const rowClass = [styles.rowOne, styles.rowTwo, styles.rowThree][index]

          return (
            <div
              key={items.map((item) => item.id).join('-')}
              className={`${styles.row} ${rowClass}`}
            >
              {!isPair && (
                <span className={`${styles.circle} ${styles.large}`} aria-hidden="true" />
              )}
              <span className={`${styles.circle} ${styles.small}`} aria-hidden="true" />
              {items.flatMap((section, itemIndex) => [
                itemIndex > 0 ? (
                  <span
                    key={`${section.id}-dot`}
                    className={`${styles.circle} ${styles.medium}`}
                    aria-hidden="true"
                  />
                ) : null,
                renderButton(section),
              ])}
              <span className={`${styles.circle} ${styles.small}`} aria-hidden="true" />
              {!isPair && (
                <span className={`${styles.circle} ${styles.large}`} aria-hidden="true" />
              )}
            </div>
          )
        })}
      </nav>

      {modalSection ? (
        <SubsectionsModal section={modalSection} onClose={() => setModalSection(null)} />
      ) : null}
    </main>
  )
}

export default HomePage
