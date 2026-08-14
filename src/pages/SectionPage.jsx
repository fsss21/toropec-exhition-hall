import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import PhotoGallery from '../components/PhotoGallery.jsx'
import themeImg from '../assets/section_theme_img.jpg'
import themeImg4k from '../assets/section_theme_img-4k.jpg'
import styles from './SectionPage.module.css'

function getPages(sections) {
  return sections.flatMap((section) => {
    if (section.subsections?.length) {
      return section.subsections.map((sub) => ({
        sectionId: section.id,
        subId: sub.id,
        path: `/section/${section.id}/${sub.id}`,
      }))
    }

    return [{ sectionId: section.id, subId: null, path: `/section/${section.id}` }]
  })
}

function DotRule() {
  return (
    <div className={styles.dotRule} aria-hidden="true">
      <span />
      <i />
      <i />
      <i />
      <span />
    </div>
  )
}

function SectionPage({ data }) {
  const { id, subId } = useParams()
  const navigate = useNavigate()
  const listRef = useRef(null)
  const [expandedId, setExpandedId] = useState(id)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const [canScrollUp, setCanScrollUp] = useState(false)

  const section = data.sections.find((item) => item.id === id)
  const subsection = subId
    ? section?.subsections?.find((item) => item.id === subId)
    : null
  const content = subsection ?? section
  const pages = useMemo(() => getPages(data.sections), [data.sections])
  const pageIndex = pages.findIndex(
    (page) => page.sectionId === id && page.subId === (subId ?? null),
  )

  const updateScrollHint = () => {
    const node = listRef.current
    if (!node) {
      return
    }
    setCanScrollUp(node.scrollTop > 8)
    setCanScrollDown(node.scrollTop + node.clientHeight < node.scrollHeight - 8)
  }

  useEffect(() => {
    setExpandedId(section?.subsections?.length ? id : null)
  }, [id, section])

  useEffect(() => {
    const node = listRef.current
    if (!node || !expandedId) {
      return
    }

    const group = node.querySelector(`[data-menu-item="${expandedId}"]`)
    if (group) {
      node.scrollTop = group.offsetTop
    }
    updateScrollHint()
  }, [expandedId])

  useEffect(() => {
    const node = listRef.current
    if (!node) {
      return undefined
    }

    const frame = requestAnimationFrame(updateScrollHint)
    const observer = new ResizeObserver(updateScrollHint)

    observer.observe(node)
    for (const child of node.children) {
      observer.observe(child)
    }
    node.addEventListener('scroll', updateScrollHint)
    window.addEventListener('resize', updateScrollHint)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      node.removeEventListener('scroll', updateScrollHint)
      window.removeEventListener('resize', updateScrollHint)
    }
  }, [expandedId, id, subId])

  if (!section) {
    return <Navigate to="/" replace />
  }

  if (section.subsections?.length && !subsection) {
    return <Navigate to={`/section/${section.id}/${section.subsections[0].id}`} replace />
  }

  const goPage = (direction) => {
    if (pageIndex < 0) {
      return
    }
    const next = pages[pageIndex + direction]
    if (next) {
      navigate(next.path)
    }
  }

  const scrollMenu = (direction) => {
    const node = listRef.current
    if (!node) {
      return
    }

    const groups = [...node.querySelectorAll('[data-menu-item]')]
    const next = direction > 0
      ? groups.find((group) => group.offsetTop > node.scrollTop + 12)
      : [...groups].reverse().find((group) => group.offsetTop < node.scrollTop - 12)

    node.scrollTo({
      top: next ? next.offsetTop : direction > 0 ? node.scrollHeight : 0,
      behavior: 'smooth',
    })
  }

  const openSection = (item) => {
    if (item.subsections?.length) {
      navigate(`/section/${item.id}/${item.subsections[0].id}`)
      return
    }
    navigate(`/section/${item.id}`)
  }

  return (
    <main
      className={styles.page}
      style={{
        backgroundImage: `image-set(url("${themeImg}") 1x, url("${themeImg4k}") 2x)`,
      }}
    >
      <aside className={styles.sidebar}>
        <div className={styles.scrollSlot}>
          <button
            type="button"
            className={styles.scrollHint}
            aria-label="Прокрутить меню вверх"
            disabled={!canScrollUp}
            onClick={() => scrollMenu(-1)}
          >
            ▲
          </button>
        </div>
        <div className={styles.menu} ref={listRef}>
          {data.sections.map((item) => {
            const hasSubs = Boolean(item.subsections?.length)
            const isExpanded = hasSubs && expandedId === item.id
            const isSectionActive = item.id === section.id

            return (
              <div
                key={item.id}
                data-menu-item={item.id}
                className={`${styles.group} ${isExpanded ? styles.expanded : ''}`}
              >
                {isSectionActive ? <DotRule /> : null}
                <button
                  type="button"
                  className={`${styles.sideButton} ${isSectionActive ? styles.active : ''}`}
                  onClick={() => openSection(item)}
                >
                  {item.shortTitle}
                </button>
                {isExpanded ? (
                  <div className={styles.branch}>
                    <div className={styles.subs}>
                      {item.subsections.map((sub) => {
                        const isSubActive = item.id === section.id && sub.id === subId

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            className={`${styles.sideButton} ${styles.subButton} ${isSubActive ? styles.active : ''}`}
                            onClick={() => navigate(`/section/${item.id}/${sub.id}`)}
                          >
                            {sub.title}
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
          <button
            type="button"
            className={styles.scrollHint}
            aria-label="Прокрутить меню вниз"
            disabled={!canScrollDown}
            onClick={() => scrollMenu(1)}
          >
            ▼
          </button>
        </div>
      </aside>

      <section className={styles.content}>
        <h1 className={styles.title}>{content.title}</h1>
        <div className={styles.doubleLine} aria-hidden="true" />
        {content.subtitle ? <p className={styles.subtitle}>{content.subtitle}</p> : null}
        <div className={styles.texts}>
          {(content.texts ?? []).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <PhotoGallery images={content.images} />
      </section>

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
            onClick={() => goPage(-1)}
            disabled={pageIndex <= 0}
            aria-label="Предыдущий раздел"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goPage(1)}
            disabled={pageIndex < 0 || pageIndex >= pages.length - 1}
            aria-label="Следующий раздел"
          >
            ›
          </button>
        </div>
      </div>
    </main>
  )
}

export default SectionPage
