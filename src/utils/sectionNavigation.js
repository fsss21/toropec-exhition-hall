const VISIBLE_DEFAULT = 7

export function getPages(sections) {
  return sections.flatMap((section) => {
    if (section.pages?.length) {
      return section.pages.map((page) => ({
        sectionId: section.id,
        subId: page.id,
        path: `/section/${section.id}/${page.id}`,
        flow: true,
      }))
    }

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

export function clampStart(start, total, visible) {
  return Math.max(0, Math.min(start, Math.max(0, total - visible)))
}

export function getVisibleCount(sections, expandedId) {
  if (!expandedId) {
    return VISIBLE_DEFAULT
  }

  const expanded = sections.find((item) => item.id === expandedId)
  const subCount = expanded?.subsections?.length ?? 0
  return Math.max(2, VISIBLE_DEFAULT - subCount)
}

export function getSectionPath(item) {
  if (item.pages?.length) {
    return `/section/${item.id}/${item.pages[0].id}`
  }

  if (item.subsections?.length) {
    return `/section/${item.id}/${item.subsections[0].id}`
  }

  return `/section/${item.id}`
}
