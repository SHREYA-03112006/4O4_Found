import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BrandingProvider } from './context/BrandingContext'
import { I18nContext } from './hooks/useTranslation'
import HomePage from './pages/HomePage'
import TeamPage from './pages/TeamPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ExplorePage from './pages/ExplorePage'
import ReportPage from './pages/ReportPage'
import DashboardPage from './pages/DashboardPage'
import en from './translations/en.json'

function App() {
  return (
    <I18nContext.Provider value={en}>
      <AuthProvider>
        <BrandingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/report/lost" element={<ReportPage type="lost" />} />
              <Route path="/report/found" element={<ReportPage type="found" />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </BrandingProvider>
      </AuthProvider>
    </I18nContext.Provider>
  )
}

export default App
