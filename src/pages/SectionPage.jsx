import { Navigate, useParams } from 'react-router-dom'
import SectionContent from '../components/section/SectionContent.jsx'
import SectionFooter from '../components/section/SectionFooter.jsx'
import SectionSidebar from '../components/section/SectionSidebar.jsx'
import styles from '../components/section/section.module.css'
import { useSectionMenu } from '../hooks/useSectionMenu.js'
import { useSectionNav } from '../hooks/useSectionNav.js'
import { getPages } from '../utils/sectionNavigation.js'
import themeImg from '../assets/section_theme_img.jpg'
import themeImg4k from '../assets/section_theme_img-4k.jpg'

function SectionPage({ data }) {
  const { id, subId } = useParams()

  const section = data.sections.find((item) => item.id === id)
  const flowPage = section?.pages?.find((page) => page.id === subId)
  const subsection = subId
    ? section?.subsections?.find((item) => item.id === subId)
    : null
  const content = flowPage ?? subsection ?? section
  const isPeopleLayout =
    content?.layout === 'people' ||
    Boolean(content?.people?.length || content?.groups?.length)

  const pages = getPages(data.sections)
  const pageIndex = pages.findIndex(
    (page) => page.sectionId === id && page.subId === (subId ?? null),
  )

  const menu = useSectionMenu(
    data.sections,
    id,
    Boolean(section?.subsections?.length),
  )

  const nav = useSectionNav({
    sections: data.sections,
    section,
    flowPage,
    pageIndex,
  })

  if (!section) {
    return <Navigate to="/" replace />
  }

  if (section.pages?.length && !flowPage) {
    return <Navigate to={`/section/${section.id}/${section.pages[0].id}`} replace />
  }

  if (section.subsections?.length && !subsection) {
    return <Navigate to={`/section/${section.id}/${section.subsections[0].id}`} replace />
  }

  return (
    <main
      className={styles.page}
      style={{
        backgroundImage: `image-set(url("${themeImg}") 1x, url("${themeImg4k}") 2x)`,
      }}
    >
      <SectionSidebar
        sections={data.sections}
        section={section}
        subId={subId}
        expandedId={menu.expandedId}
        visibleSections={menu.visibleSections}
        canScrollUp={menu.canScrollUp}
        canScrollDown={menu.canScrollDown}
        onScrollMenu={menu.scrollMenu}
      />

      <SectionContent
        content={content}
        section={section}
        layout={content?.layout ?? 'default'}
        exhibitPage={nav.exhibitPage}
        exhibitPages={nav.exhibitPages}
        exhibitPageSize={nav.exhibitPageSize}
        exhibitItems={nav.exhibitItems}
        canGoPrev={nav.canGoPrev}
        canGoNext={nav.canGoNext}
        onPrevSection={() => nav.goPage(-1)}
        onNextSection={() => nav.goPage(1)}
      />

      {isPeopleLayout ? null : (
        <SectionFooter
          canGoPrev={nav.canGoPrev}
          canGoNext={nav.canGoNext}
          onPrev={() => nav.goPage(-1)}
          onNext={() => nav.goPage(1)}
        />
      )}
    </main>
  )
}

export default SectionPage
