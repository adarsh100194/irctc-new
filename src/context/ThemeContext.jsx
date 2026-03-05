import { createContext, useContext, useState } from 'react'

export const dark = {
  mode: 'dark',
  bg: '#09090f',
  bgAlt: '#0f0f1a',
  surface: 'rgba(255,255,255,0.03)',
  surfaceSolid: '#111118',
  surfaceHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,255,255,0.12)',
  text: '#ffffff',
  textSec: 'rgba(255,255,255,0.45)',
  textMuted: 'rgba(255,255,255,0.2)',
  accent: '#f97316',
  accentDim: 'rgba(249,115,22,0.1)',
  accentGrad: 'linear-gradient(135deg, #f97316, #ea580c)',
  accentBorder: 'rgba(249,115,22,0.25)',
  navBg: 'rgba(9,9,15,0.85)',
  navBorder: 'rgba(255,255,255,0.04)',
  navText: 'rgba(255,255,255,0.4)',
  navTextActive: '#ffffff',
  input: 'rgba(255,255,255,0.05)',
  inputBorder: 'rgba(255,255,255,0.08)',
  inputFocus: 'rgba(249,115,22,0.35)',
  card: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.06)',
  pill: 'rgba(255,255,255,0.07)',
  shadow: '0 20px 60px rgba(0,0,0,0.5)',
  green: '#34d399',
  greenDim: 'rgba(52,211,153,0.1)',
  red: '#f87171',
  redDim: 'rgba(248,113,113,0.1)',
  blue: '#60a5fa',
  blueDim: 'rgba(96,165,250,0.1)',
}

export const light = {
  mode: 'light',
  bg: '#f0f4f8',
  bgAlt: '#ffffff',
  surface: '#ffffff',
  surfaceSolid: '#ffffff',
  surfaceHover: '#f8fafc',
  border: 'rgba(0,53,128,0.1)',
  borderHover: 'rgba(0,53,128,0.25)',
  text: '#0f172a',
  textSec: '#475569',
  textMuted: '#94a3b8',
  accent: '#f97316',
  accentDim: 'rgba(249,115,22,0.08)',
  accentGrad: 'linear-gradient(135deg, #f97316, #ea580c)',
  accentBorder: 'rgba(249,115,22,0.3)',
  navBg: '#003580',
  navBorder: 'transparent',
  navText: 'rgba(255,255,255,0.6)',
  navTextActive: '#ffffff',
  input: '#f8fafc',
  inputBorder: '#e2e8f0',
  inputFocus: '#f97316',
  card: '#ffffff',
  cardBorder: 'rgba(0,53,128,0.08)',
  pill: '#eef2ff',
  shadow: '0 4px 24px rgba(0,53,128,0.08)',
  green: '#059669',
  greenDim: 'rgba(5,150,105,0.08)',
  red: '#dc2626',
  redDim: 'rgba(220,38,38,0.08)',
  blue: '#003580',
  blueDim: 'rgba(0,53,128,0.06)',
}

const ThemeContext = createContext({ t: dark, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const toggle = () => setIsDark(d => !d)
  return (
    <ThemeContext.Provider value={{ t: isDark ? dark : light, toggle, isDark }}>
      <div style={{ background: isDark ? dark.bg : light.bg, minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
