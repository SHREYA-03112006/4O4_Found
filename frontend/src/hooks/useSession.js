import { getSession } from '../services/session'

export function useSession() {
  return getSession()
}