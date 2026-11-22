import { useState, useCallback } from 'react'
import { trayAdd, trayRemove, getTray } from '../services/api'
import { getSession } from '../services/session'

export function useTray() {
  const [trayItems, setTrayItems] = useState([])

  const fetchTray = useCallback(async () => {
    const data = await getTray(getSession())
    setTrayItems(data.items || [])
  }, [])

  const add = useCallback(async (itemId) => {
    await trayAdd(getSession(), itemId)
    await fetchTray()
  }, [fetchTray])

  const remove = useCallback(async (itemId) => {
    await trayRemove(getSession(), itemId)
    await fetchTray()
  }, [fetchTray])

  return { trayItems, add, remove, fetchTray }
}