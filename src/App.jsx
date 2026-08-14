import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SectionPage from './pages/SectionPage.jsx'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить data.json')
        }
        return response.json()
      })
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return <p className="app-status">{error}</p>
  }

  if (!data) {
    return <p className="app-status">Загрузка…</p>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage data={data} />} />
        <Route path="/section/:id/:subId?" element={<SectionPage data={data} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
