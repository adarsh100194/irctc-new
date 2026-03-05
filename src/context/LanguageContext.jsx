import { createContext, useContext, useState, useEffect } from 'react'
import { LANGUAGES, TRANSLATIONS } from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  const setLang = (code) => {
    setLangState(code)
    // Apply RTL direction for Urdu
    const isRtl = LANGUAGES.find(l => l.code === code)?.rtl ?? false
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  }

  // Resolve direction on mount
  useEffect(() => {
    document.documentElement.dir = 'ltr'
  }, [])

  /** Translate a key. Falls back to English, then to the key itself. */
  const tl = (key) => {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, languages: LANGUAGES, tl }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
