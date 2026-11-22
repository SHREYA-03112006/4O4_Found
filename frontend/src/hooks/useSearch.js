import { useState, useCallback } from 'react'
import { searchItems } from '../services/api'

export function useSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState(null)
  const [totalEstimate, setTotalEstimate] = useState(0)
  const [error, setError] = useState(null)
  const [confidenceMin, setConfidenceMin] = useState(0.0)

  const performSearch = useCallback(async (params, append = false) => {
    setLoading(true)
    setError(null)
    try {
      const body = { ...params, confidence_min: confidenceMin }
      if (append && nextCursor) {
        const seen = results.map(r => r.item_id)
        body.cursor = `${nextCursor}:${JSON.stringify(seen)}`
      }
      const data = await searchItems(body)
      if (append) {
        setResults(prev => [...prev, ...data.matches])
      } else {
        setResults(data.matches)
      }
      setNextCursor(data.next_cursor)
      setTotalEstimate(data.total_estimate)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [confidenceMin, nextCursor, results])

  const loadMore = useCallback(() => {
    if (nextCursor && !loading) {
      performSearch({}, true)
    }
  }, [nextCursor, loading, performSearch])

  const reset = useCallback(() => {
    setResults([])
    setNextCursor(null)
    setTotalEstimate(0)
    setError(null)
  }, [])

  return { results, loading, error, nextCursor, totalEstimate, confidenceMin, setConfidenceMin, performSearch, loadMore, reset }
}