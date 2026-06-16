import { Route, Routes } from 'react-router-dom'
import { LandingPage } from '@/pages/Landing/LandingPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}
