import { useEffect, useState } from 'react'
import { clampStart, getVisibleCount } from '../utils/sectionNavigation.js'

export function useSectionMenu(sections, sectionId, hasSubsections) {
  const [expandedId, setExpandedId] = useState(() => (hasSubsections ? sectionId : null))
  const [startIndex, setStartIndex] = useState(0)

  const isExpanded = Boolean(hasSubsections && expandedId === sectionId)
  const visibleCount = getVisibleCount(sections, isExpanded ? sectionId : null)
  const total = sections.length
  const safeStart = clampStart(startIndex, total, visibleCount)
  const visibleSections = sections.slice(safeStart, safeStart + visibleCount)
  const maxStart = Math.max(0, total - visibleCount)

  useEffect(() => {
    const nextExpanded = hasSubsections ? sectionId : null
    setExpandedId(nextExpanded)

    const activeIndex = sections.findIndex((item) => item.id === sectionId)
    if (activeIndex < 0) {
      return
    }

    const nextVisible = getVisibleCount(sections, nextExpanded)

    setStartIndex((current) => {
      const fitted = clampStart(current, sections.length, nextVisible)

      if (activeIndex >= fitted && activeIndex < fitted + nextVisible) {
        return fitted
      }

      if (activeIndex < fitted) {
        return activeIndex
      }

      return clampStart(activeIndex - nextVisible + 1, sections.length, nextVisible)
    })
  }, [sectionId, hasSubsections, sections])

  const scrollMenu = (direction) => {
    setStartIndex((current) => clampStart(current + direction, total, visibleCount))
  }

  return {
    expandedId,
    visibleSections,
    canScrollUp: safeStart > 0,
    canScrollDown: safeStart < maxStart,
    scrollMenu,
  }
}
