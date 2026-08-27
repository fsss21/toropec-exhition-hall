import DefaultLayout from './layouts/DefaultLayout.jsx'
import ExhibitsLayout from './layouts/ExhibitsLayout.jsx'
import GalleryLayout from './layouts/GalleryLayout.jsx'
import PeopleLayout from './layouts/PeopleLayout.jsx'
import TextGalleryLayout from './layouts/TextGalleryLayout.jsx'
import TextLayout from './layouts/TextLayout.jsx'
import styles from './section.module.css'

const LAYOUTS = new Set(['text', 'text-gallery', 'gallery', 'exhibits', 'people', 'default'])

function resolveLayout(layout, content) {
  if (content?.people?.length || content?.groups?.length) {
    return 'people'
  }
  if (LAYOUTS.has(layout)) {
    return layout
  }
  return 'default'
}

function SectionContent({
  content,
  section,
  layout = 'default',
  exhibitPage = 0,
  exhibitPages = 1,
  exhibitPageSize = 8,
  exhibitItems = [],
  canGoPrev = false,
  canGoNext = false,
  onPrevSection,
  onNextSection,
}) {
  const title = content.title ?? section.title
  const subtitle = content.subtitle
  const texts = content.texts ?? []
  const images = content.images ?? []
  const resolvedLayout = resolveLayout(layout, content)

  return (
    <section className={styles.content}>
      {resolvedLayout === 'text' ? (
        <TextLayout title={title} subtitle={subtitle} texts={texts} />
      ) : null}

      {resolvedLayout === 'text-gallery' ? (
        <TextGalleryLayout
          title={title}
          subtitle={subtitle}
          texts={texts}
          images={images}
        />
      ) : null}

      {resolvedLayout === 'gallery' ? (
        <GalleryLayout title={title} subtitle={subtitle} images={images} />
      ) : null}

      {resolvedLayout === 'exhibits' ? (
        <ExhibitsLayout
          title={title}
          subtitle={subtitle}
          items={exhibitItems}
          pageSize={exhibitPageSize}
          pageIndex={exhibitPage}
          pageCount={exhibitPages}
        />
      ) : null}

      {resolvedLayout === 'people' ? (
        <PeopleLayout
          key={content.id}
          title={title}
          subtitle={subtitle}
          people={content.people ?? []}
          groups={content.groups ?? []}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrevSection={onPrevSection}
          onNextSection={onNextSection}
          hideFooterArrowsOnPerson={section.id === 'sailors' || content.id === 'sailors'}
        />
      ) : null}

      {resolvedLayout === 'default' ? (
        <DefaultLayout
          title={title}
          subtitle={subtitle}
          texts={texts}
          images={images}
        />
      ) : null}
    </section>
  )
}

export default SectionContent
