import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import MuseumPage from './pages/MuseumPage.jsx'
import EditMemoryPage from './pages/EditMemoryPage.jsx'
import AddMuseumPage from './pages/AddMuseumPage.jsx'
import Layout from './components/Layout.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/museum/:id" element={<MuseumPage />} />
          <Route path="/museum/:id/edit" element={<EditMemoryPage />} />
          <Route path="/add" element={<AddMuseumPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
