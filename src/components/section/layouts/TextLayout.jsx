import styles from '../section.module.css'

function TextLayout({ title, subtitle, texts = [] }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.doubleLine} aria-hidden="true" />
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <div className={styles.texts}>
        {texts.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </>
  )
}

export default TextLayout
