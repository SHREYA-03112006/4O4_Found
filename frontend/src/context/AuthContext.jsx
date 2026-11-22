import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getMe, storeTokens, clearTokens, getStoredAccessToken } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async (token) => {
    try {
      const data = await getMe(token)
      setUser(data)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const token = getStoredAccessToken()
    if (token) {
      fetchUser(token).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchUser])

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password)
    storeTokens(data.access_token, data.refresh_token)
    localStorage.setItem('org_id', data.org_id)
    localStorage.setItem('member_id', data.member_id)
    localStorage.setItem('role', data.role)
    await fetchUser(data.access_token)
    return data
  }, [fetchUser])

  const register = useCallback(async (data) => {
    const result = await apiRegister(data)
    return result
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}