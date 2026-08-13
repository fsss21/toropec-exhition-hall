import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import styles from './App.module.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.page}>
      <section className={styles.center}>
        <div className={styles.logos}>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className={styles.logo} alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img
              src={reactLogo}
              className={`${styles.logo} ${styles.logoReact}`}
              alt="React logo"
            />
          </a>
        </div>
        <div>
          <h1 className={styles.title}>Vite + React</h1>
          <p className={styles.hint}>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className={styles.counter}
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className={styles.ticks} />

      <section className={styles.nextSteps}>
        <div className={styles.docs}>
          <svg className={styles.icon} role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon" />
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul className={styles.linkList}>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className={styles.linkLogo} src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className={styles.buttonIcon} src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.social}>
          <svg className={styles.icon} role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon" />
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul className={styles.linkList}>
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className={styles.buttonIcon}
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon" />
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                <svg
                  className={styles.buttonIcon}
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon" />
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                <svg
                  className={styles.buttonIcon}
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon" />
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className={styles.buttonIcon}
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon" />
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className={styles.ticks} />
      <section className={styles.spacer} />
    </div>
  )
}

export default App
