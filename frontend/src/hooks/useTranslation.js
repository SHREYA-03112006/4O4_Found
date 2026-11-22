import { createContext, useContext } from 'react'
import en from '../translations/en.json'

const I18nContext = createContext(en)

export function useTranslation() {
  const strings = useContext(I18nContext)
  return function t(key) {
    const keys = key.split('.')
    let val = strings
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k]
      } else {
        return key
      }
    }
    return typeof val === 'string' ? val : key
  }
}

export { I18nContext }