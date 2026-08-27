import { useEffect, useRef, useState } from 'react'
import styles from './section.module.css'

function ScrollableTexts({ texts = [] }) {
  const paneRef = useRef(null)
  const [overflow, setOverflow] = useState(false)
  const [canUp, setCanUp] = useState(false)
  const [canDown, setCanDown] = useState(false)

  const updateState = () => {
    const pane = paneRef.current
    if (!pane) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = pane
    const hasOverflow = scrollHeight > clientHeight + 2
    setOverflow(hasOverflow)
    setCanUp(hasOverflow && scrollTop > 2)
    setCanDown(hasOverflow && scrollTop + clientHeight < scrollHeight - 2)
  }

  useEffect(() => {
    const pane = paneRef.current
    if (!pane) {
      return undefined
    }

    pane.scrollTop = 0
    updateState()

    const onScroll = () => updateState()
    pane.addEventListener('scroll', onScroll)

    const observer = new ResizeObserver(() => updateState())
    observer.observe(pane)

    return () => {
      pane.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [texts])

  const scrollByPage = (direction) => {
    const pane = paneRef.current
    if (!pane) {
      return
    }
    pane.scrollBy({
      top: direction * pane.clientHeight * 0.85,
      behavior: 'smooth',
    })
  }

  return (
    <div className={styles.textsScroll}>
      {overflow ? (
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollByPage(-1)}
          disabled={!canUp}
          aria-label="Прокрутить текст вверх"
        >
          ▲
        </button>
      ) : null}

      <div className={styles.textsPane} ref={paneRef}>
        <div className={styles.texts}>
          {texts.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {overflow ? (
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollByPage(1)}
          disabled={!canDown}
          aria-label="Прокрутить текст вниз"
        >
          ▼
        </button>
      ) : null}
    </div>
  )
}

export default ScrollableTexts
