import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPages } from '../utils/sectionNavigation.js'

export function useSectionNav({ sections, section, flowPage, pageIndex }) {
  const navigate = useNavigate()
  const [exhibitPage, setExhibitPage] = useState(0)
  const pages = useMemo(() => getPages(sections), [sections])

  const exhibitPageSize = flowPage?.pageSize ?? 8
  const exhibitItems = flowPage?.items ?? []
  const exhibitPages = Math.max(1, Math.ceil(exhibitItems.length / exhibitPageSize))
  const isExhibits = flowPage?.layout === 'exhibits'

  useEffect(() => {
    setExhibitPage(0)
  }, [section?.id, flowPage?.id])

  const goPage = (direction) => {
    if (isExhibits) {
      if (direction > 0 && exhibitPage < exhibitPages - 1) {
        setExhibitPage((page) => page + 1)
        return
      }

      if (direction < 0 && exhibitPage > 0) {
        setExhibitPage((page) => page - 1)
        return
      }
    }

    if (pageIndex < 0) {
      return
    }

    const next = pages[pageIndex + direction]
    if (next) {
      navigate(next.path)
    }
  }

  const canGoPrev = isExhibits
    ? exhibitPage > 0 || pageIndex > 0
    : pageIndex > 0
  const canGoNext = isExhibits
    ? exhibitPage < exhibitPages - 1 || pageIndex < pages.length - 1
    : pageIndex >= 0 && pageIndex < pages.length - 1

  return {
    goPage,
    canGoPrev,
    canGoNext,
    exhibitPage,
    exhibitPages,
    exhibitPageSize,
    exhibitItems,
  }
}
