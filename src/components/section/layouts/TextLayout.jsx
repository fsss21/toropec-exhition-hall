import ScrollableTexts from '../ScrollableTexts.jsx'
import styles from '../section.module.css'

function TextLayout({ title, subtitle, texts = [] }) {
  return (
    <div className={styles.textRoot}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <ScrollableTexts texts={texts} />
    </div>
  )
}

export default TextLayout
