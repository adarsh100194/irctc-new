import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Lock, Plus, Minus, CheckCircle, Smartphone, CreditCard, Building2, Info, Wallet } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { useWindowSize } from '../hooks/useWindowSize'

const TRAINS = {
  '12951': { name: 'Mumbai Rajdhani', dep: '16:25', arr: '08:15+1', num: '12951' },
  '12301': { name: 'Howrah Rajdhani', dep: '14:05', arr: '09:55+1', num: '12301' },
  '22691': { name: 'Rajdhani Express', dep: '20:00', arr: '10:30+1', num: '22691' },
  '12627': { name: 'Karnataka Express', dep: '21:30', arr: '09:45+2', num: '12627' },
  '16506': { name: 'Gandhidham Exp',    dep: '09:45', arr: '11:30+1', num: '16506' },
  '12217': { name: 'Sampark Kranti',   dep: '06:20', arr: '22:50',   num: '12217' },
}
const BASE_PRICES = { SL: 745, '3A': 1960, '2A': 2810, '1A': 4680, All: 745 }

const MEAL_OPTIONS = [
  { id: 'none',   label: 'No Preference', icon: '—' },
  { id: 'veg',    label: 'Veg',           icon: '🥗' },
  { id: 'nonveg', label: 'Non-Veg',       icon: '🍖' },
  { id: 'jain',   label: 'Jain',          icon: '🌿' },
]

const EWALLET_BALANCE = 843

const PAYMENT_METHODS = [
  { id: 'ewallet',    label: 'Train Wallet',       sub: `Balance: ₹${EWALLET_BALANCE}`, icon: Wallet },
  { id: 'upi',        label: 'UPI',                sub: 'GPay · PhonePe · Paytm · BHIM', icon: Smartphone },
  { id: 'card',       label: 'Credit / Debit Card', sub: 'Visa · Mastercard · RuPay',    icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking',         sub: 'All major banks',               icon: Building2 },
]

const INSURANCE_COVERS = [
  'Trip cancellation — up to ₹10,000',
  'Train delay > 3 hours — ₹500 compensation',
  'Accidental death / disability — ₹10 lakh',
  'Lost / damaged baggage — up to ₹5,000',
]

// ── Pseudo-QR SVG ──────────────────────────────────────────────────────────
function PseudoQR({ pnr, size = 120 }) {
  const N = 21
  const grid = Array(N).fill(null).map(() => Array(N).fill(false))
  const drawFinder = (r0, c0) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        grid[r0 + r][c0 + c] = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
      }
  }
  drawFinder(0, 0); drawFinder(0, N - 7); drawFinder(N - 7, 0)
  for (let i = 8; i < N - 8; i++) { grid[6][i] = i % 2 === 0; grid[i][6] = i % 2 === 0 }
  let seed = (parseInt(pnr, 10) || 0) % 1000000007
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed & 1 }
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++)
      if (!(r < 8 && c < 8) && !(r < 8 && c >= N - 8) && !(r >= N - 8 && c < 8) && r !== 6 && c !== 6)
        grid[r][c] = rng() === 1
  const cell = size / N
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', borderRadius: 8 }}>
      <rect width={size} height={size} fill="white" />
      {grid.flatMap((row, r) => row.map((on, c) =>
        on ? <rect key={`${r}_${c}`} x={c * cell} y={r * cell} width={cell + 0.3} height={cell + 0.3} fill="#111" /> : null
      ))}
    </svg>
  )
}

// ── Toggle switch ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description, t, isDark }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${t.border}` }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ color: t.textSec, fontSize: 13, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>{description}</div>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} style={{
        width: 42, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
        background: checked ? '#3b82f6' : (isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db'),
        position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 18, height: 18, borderRadius: '50%', background: 'white',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}

// ── Standalone feature toggle card ─────────────────────────────────────────
function FeatureToggle({ emoji, title, subtitle, checked, onChange, accent = '#f97316', children, t, isDark }) {
  return (
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
      border: `1px solid ${checked ? accent + '50' : t.border}`,
      borderRadius: 16, boxShadow: isDark ? 'none' : t.shadow,
      transition: 'border-color 0.2s',
    }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: checked ? accent + '18' : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
          border: `1px solid ${checked ? accent + '30' : t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          transition: 'all 0.2s',
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: t.text, fontSize: 14, fontWeight: 700 }}>{title}</div>
          <div style={{ color: t.textMuted, fontSize: 12, marginTop: 2 }}>{subtitle}</div>
        </div>
        <button type="button" onClick={() => onChange(!checked)} style={{
          width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          background: checked ? accent : (isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db'),
          position: 'relative', transition: 'background 0.2s',
        }}>
          <div style={{
            position: 'absolute', top: 3, left: checked ? 21 : 3,
            width: 20, height: 20, borderRadius: '50%', background: 'white',
            transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>
      {checked && children && (
        <div style={{ padding: '0 20px 16px', borderTop: `1px solid ${t.border}` }}>
          <div style={{ paddingTop: 14 }}>{children}</div>
        </div>
      )}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function BookingPage({ user, onLogout }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t, isDark } = useTheme()
  const { isMobile } = useWindowSize()

  const trainId = params.get('trainId') || '12951'
  const from    = params.get('from')    || 'New Delhi'
  const to      = params.get('to')      || 'Mumbai'
  const date    = params.get('date')    || new Date().toISOString().split('T')[0]
  const cls     = params.get('class')   || 'SL'
  const train   = TRAINS[trainId] || TRAINS['12951']
  const price   = BASE_PRICES[cls] || 745

  const [step, setStep]     = useState(1)
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'M', meal: 'none' }])
  const [fieldErrors, setFieldErrors] = useState({})
  const [selectedBerths, setSelectedBerths] = useState([])
  const [payMethod, setPayMethod] = useState('upi')
  const [upiId, setUpiId]   = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [pnr] = useState(() => Math.floor(1000000000 + Math.random() * 9000000000).toString())

  // Booking preferences
  const [prefCoach,    setPrefCoach]    = useState('')
  const [confirmOnly,  setConfirmOnly]  = useState(false)
  const [sameCoach,    setSameCoach]    = useState(false)
  const [autoUpgrade,  setAutoUpgrade]  = useState(false)

  // New add-ons
  const [eCatering,    setECatering]    = useState(false)
  const [addInsurance, setAddInsurance] = useState(false)

  // ── Validation ──
  const validatePassengers = () => {
    const errors = {}
    passengers.forEach((p, i) => {
      if (!p.name.trim()) {
        errors[`name_${i}`] = 'Name is required'
      } else if (!/^[a-zA-Z\s]+$/.test(p.name.trim())) {
        errors[`name_${i}`] = 'Only letters allowed — no numbers or symbols'
      }
      if (!p.age && p.age !== 0) {
        errors[`age_${i}`] = 'Age is required'
      } else {
        const age = parseInt(p.age)
        if (isNaN(age) || age < 1 || age > 150) {
          errors[`age_${i}`] = 'Age must be 1–150'
        }
      }
    })
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const updateP = (i, f, v) => {
    setPassengers(passengers.map((p, idx) => idx === i ? { ...p, [f]: v } : p))
    if (fieldErrors[`${f}_${i}`]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[`${f}_${i}`]; return n })
    }
  }

  const addP = () =>
    passengers.length < 6 &&
    setPassengers([...passengers, { name: '', age: '', gender: 'M', meal: 'none' }])

  const removeP = i => {
    setPassengers(passengers.filter((_, idx) => idx !== i))
    setSelectedBerths(selectedBerths.filter((_, idx) => idx !== i))
  }

  const toggleBerth = id =>
    setSelectedBerths(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) :
      prev.length < passengers.length ? [...prev, id] : prev
    )

  const handleContinue = () => { if (validatePassengers()) setStep(2) }

  // ── Fare calculation ──
  const base         = price * passengers.length
  const reservFee    = 60
  const taxes        = Math.round(base * 0.05)
  const serviceFee   = 15
  const insuranceFee = addInsurance ? 35 * passengers.length : 0
  const total        = base + reservFee + taxes + serviceFee + insuranceFee

  const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const labelStyle = {
    color: t.textMuted, fontSize: 10, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    display: 'block', marginBottom: 8,
  }
  const inputSt = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1px solid ${t.inputBorder}`, background: t.input,
    color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  // ────────────────────────────────────────────────────────────────────────
  // CONFIRMATION SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', background: t.bg }}>
        <Navbar user={user} onLogout={onLogout} />
        <div style={{ maxWidth: 600, margin: '40px auto', padding: isMobile ? '0 14px' : '0 24px' }}>

          {/* Success header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              marginBottom: 16, boxShadow: '0 8px 32px rgba(52,211,153,0.4)',
            }}>
              <CheckCircle size={34} style={{ color: 'white' }} />
            </div>
            <h2 style={{ color: t.text, fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 6 }}>
              You're all set!
            </h2>
            <p style={{ color: t.textSec, fontSize: 15 }}>Booking confirmed · Ticket sent to email</p>
          </div>

          {/* Boarding pass */}
          <div style={{ borderRadius: 24, overflow: 'hidden', border: `1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 8px 40px rgba(0,0,0,0.12)' }}>

            {/* Header strip */}
            <div style={{
              background: isDark
                ? 'linear-gradient(135deg, #1a1025, #0f0a1e)'
                : 'linear-gradient(135deg, #003580, #0052cc)',
              padding: '24px 28px',
              borderBottom: `1px dashed ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>PNR Number</div>
                  <div style={{ color: 'white', fontWeight: 900, fontSize: 20, letterSpacing: '0.08em', fontFamily: 'monospace' }}>{pnr}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 20,
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    color: 'white', fontSize: 12, fontWeight: 800,
                    letterSpacing: '0.08em', boxShadow: '0 4px 14px rgba(52,211,153,0.45)',
                  }}>
                    <CheckCircle size={13} /> CONFIRMED
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{train.name} · {train.num}</div>
                </div>
              </div>

              {/* Route */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div>
                  <div style={{ color: '#f97316', fontWeight: 900, fontSize: isMobile ? 26 : 32, letterSpacing: '-0.04em', lineHeight: 1 }}>{train.dep}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{from.split('(')[0].trim()}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{fmtDate(date)}</div>
                  <div style={{ width: '100%', height: 1, borderTop: '1px dashed rgba(255,255,255,0.15)', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: 16 }}>🚂</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{cls} Class</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f97316', fontWeight: 900, fontSize: isMobile ? 26 : 32, letterSpacing: '-0.04em', lineHeight: 1 }}>{train.arr}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{to.split('(')[0].trim()}</div>
                </div>
              </div>
            </div>

            {/* Passenger list */}
            <div style={{ background: isDark ? '#0d0d18' : '#f8fafc', padding: '20px 26px' }}>
              <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Passengers</div>
              {passengers.map((p, i) => {
                const mealInfo = MEAL_OPTIONS.find(m => m.id === p.meal)
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${t.border}`, flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      <span style={{ color: t.textSec, fontSize: 14 }}>
                        {p.name} · {p.age}y · {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}
                      </span>
                      {p.meal !== 'none' && (
                        <span style={{ color: t.textMuted, fontSize: 12 }}> · {mealInfo?.icon} {mealInfo?.label}</span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: isDark ? 'rgba(52,211,153,0.12)' : '#ecfdf5',
                      color: '#34d399', border: '1px solid rgba(52,211,153,0.25)',
                    }}>
                      CNF · S{i + 1}/{Math.floor(Math.random() * 60) + 1}
                    </span>
                  </div>
                )
              })}

              {/* Add-ons badges */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {eCatering && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: isDark ? 'rgba(249,115,22,0.1)' : '#fff7ed', border: '1px solid rgba(249,115,22,0.25)' }}>
                    <span style={{ fontSize: 13 }}>🍱</span>
                    <span style={{ color: '#f97316', fontSize: 11, fontWeight: 700 }}>E-Catering Active</span>
                  </div>
                )}
                {addInsurance && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: isDark ? 'rgba(52,211,153,0.1)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)' }}>
                    <span style={{ fontSize: 13 }}>🛡️</span>
                    <span style={{ color: '#34d399', fontSize: 11, fontWeight: 700 }}>
                      Travel Insurance · ₹{35 * passengers.length}
                    </span>
                  </div>
                )}
              </div>

              {/* QR code */}
              <div style={{ marginTop: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ border: `2px solid ${t.border}`, borderRadius: 12, padding: 6, background: 'white', flexShrink: 0 }}>
                  <PseudoQR pnr={pnr} size={96} />
                </div>
                <div>
                  <div style={{ color: t.text, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Show this QR at the station</div>
                  <div style={{ color: t.textMuted, fontSize: 12, marginBottom: 6 }}>Valid for travel on {fmtDate(date)}</div>
                  <div style={{ color: t.textMuted, fontSize: 11, lineHeight: 1.6 }}>
                    Show to TTE for verification.<br />
                    E-ticket also sent to your email.
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: t.textMuted, fontSize: 13 }}>Total paid</span>
                <span style={{ color: t.accent, fontWeight: 900, fontSize: 20 }}>₹{total}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <button onClick={() => navigate('/home')} style={{ padding: '13px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.textSec, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Back to Home
            </button>
            <button style={{ padding: '13px', borderRadius: 12, border: 'none', background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Download Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────────────────
  // BOOKING FLOW
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: t.bg }}>
      <Navbar user={user} onLogout={onLogout} />

      {/* Journey bar */}
      <div style={{
        borderBottom: `1px solid ${t.border}`,
        padding: isMobile ? '10px 14px' : '12px 24px',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: isDark ? 'rgba(255,255,255,0.01)' : 'white',
        position: 'sticky', top: 56, zIndex: 10,
      }}>
        <span style={{ color: t.textSec, fontSize: isMobile ? 13 : 14, fontWeight: 600 }}>{from.split('(')[0].trim()}</span>
        <ArrowRight size={12} style={{ color: t.textMuted }} />
        <span style={{ color: t.textSec, fontSize: isMobile ? 13 : 14, fontWeight: 600 }}>{to.split('(')[0].trim()}</span>
        {!isMobile && (
          <span style={{ color: t.textMuted, fontSize: 13 }}>· {train.name} · {cls} · {fmtDate(date)}</span>
        )}

        {/* Step indicator */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Passengers', 'Payment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, transition: 'all 0.2s',
                background: step > i + 1 ? (isDark ? 'rgba(52,211,153,0.15)' : '#ecfdf5')
                          : step === i + 1 ? t.accentGrad
                          : (isDark ? 'rgba(255,255,255,0.04)' : t.pill),
                color: step > i + 1 ? '#34d399' : step === i + 1 ? 'white' : t.textMuted,
                border: step > i + 1 ? '1px solid rgba(52,211,153,0.3)' : 'none',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              {!isMobile && (
                <span style={{ color: step === i + 1 ? t.text : t.textMuted, fontSize: 12, fontWeight: 500 }}>{s}</span>
              )}
              {i === 0 && <div style={{ width: isMobile ? 14 : 20, height: 1, background: t.border, margin: '0 2px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Content grid ── */}
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        padding: isMobile ? '16px 12px 60px' : '32px 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
        gap: 24,
        alignItems: 'start',
      }}>

        {/* ════════════════════════════════════ LEFT ════════════════════════ */}
        <div>

          {/* ── Step 1: Passengers, Berths, Add-ons, Preferences ── */}
          {step === 1 && (
            <>
              {/* ── Travellers ── */}
              <section style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ color: t.text, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Travellers</h2>
                  {passengers.length < 6 && (
                    <button onClick={addP} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
                      border: `1px solid ${t.border}`, background: 'transparent',
                      color: t.textSec, fontSize: 13, cursor: 'pointer',
                    }}>
                      <Plus size={13} /> Add traveller
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {passengers.map((p, i) => (
                    <div key={i} style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                      border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px 20px',
                      boxShadow: isDark ? 'none' : t.shadow,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span style={{ color: t.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Traveller {i + 1}
                        </span>
                        {i > 0 && (
                          <button onClick={() => removeP(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.red, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Minus size={11} /> Remove
                          </button>
                        )}
                      </div>

                      {/* Name + Age + Gender */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr',
                        gap: 12,
                      }}>
                        {/* Name — full width on mobile */}
                        <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
                          <label style={labelStyle}>Full Name</label>
                          <input
                            value={p.name}
                            onChange={e => updateP(i, 'name', e.target.value)}
                            placeholder="As on ID proof"
                            style={{ ...inputSt, borderColor: fieldErrors[`name_${i}`] ? t.red : t.inputBorder }}
                          />
                          {fieldErrors[`name_${i}`] && (
                            <div style={{ color: t.red, fontSize: 11, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Info size={10} /> {fieldErrors[`name_${i}`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={labelStyle}>Age</label>
                          <input
                            type="number" value={p.age}
                            onChange={e => updateP(i, 'age', e.target.value)}
                            placeholder="1–150" min="1" max="150"
                            style={{ ...inputSt, borderColor: fieldErrors[`age_${i}`] ? t.red : t.inputBorder, colorScheme: isDark ? 'dark' : 'light' }}
                          />
                          {fieldErrors[`age_${i}`] && (
                            <div style={{ color: t.red, fontSize: 11, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Info size={10} /> {fieldErrors[`age_${i}`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={labelStyle}>Gender</label>
                          <select value={p.gender} onChange={e => updateP(i, 'gender', e.target.value)}
                            style={{ ...inputSt, colorScheme: isDark ? 'dark' : 'light', cursor: 'pointer' }}
                          >
                            <option style={{ background: isDark ? '#111' : '#fff' }} value="M">Male</option>
                            <option style={{ background: isDark ? '#111' : '#fff' }} value="F">Female</option>
                            <option style={{ background: isDark ? '#111' : '#fff' }} value="O">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Meal preference */}
                      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
                        <label style={{ ...labelStyle, marginBottom: 10 }}>Meal Preference</label>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {MEAL_OPTIONS.map(({ id, label, icon }) => (
                            <button key={id} type="button" onClick={() => updateP(i, 'meal', id)} style={{
                              padding: '6px 13px', borderRadius: 20, cursor: 'pointer',
                              border: `1px solid ${p.meal === id ? t.accentBorder : t.border}`,
                              background: p.meal === id ? t.accentDim : 'transparent',
                              color: p.meal === id ? t.accent : t.textSec,
                              fontSize: 12, fontWeight: 600,
                              display: 'flex', alignItems: 'center', gap: 5,
                              transition: 'all 0.15s',
                            }}>
                              <span style={{ fontSize: 12 }}>{icon}</span> {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Berth selector ── */}
              <section style={{ marginBottom: 20 }}>
                <h2 style={{ color: t.text, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Pick your berths</h2>
                <p style={{ color: t.textMuted, fontSize: 13, marginBottom: 14 }}>
                  Select {passengers.length} berth{passengers.length > 1 ? 's' : ''} · {selectedBerths.length} selected
                </p>

                <div style={{
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
                  border: `1px solid ${t.border}`, borderRadius: 16, padding: 20,
                  display: 'flex', gap: 20, boxShadow: isDark ? 'none' : t.shadow,
                  flexWrap: 'wrap',
                }}>
                  {/* Main berths */}
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Main</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[0, 1, 2].map(row => (
                        <div key={row} style={{ display: 'flex', gap: 6 }}>
                          {['LB', 'MB', 'UB'].map(type => {
                            const id = `${type}${row + 1}`
                            const sel = selectedBerths.includes(id)
                            const disabled = !sel && selectedBerths.length >= passengers.length
                            return (
                              <button key={id} onClick={() => toggleBerth(id)} disabled={disabled} style={{
                                flex: 1, padding: '8px 4px', borderRadius: 8,
                                border: `1px solid ${sel ? t.accent : t.border}`,
                                background: sel ? t.accentDim : disabled ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : t.bgAlt),
                                color: sel ? t.accent : disabled ? t.textMuted : t.textSec,
                                fontSize: 11, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                              }}>{type}</button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: 1, background: t.border }} />

                  {/* Side berths */}
                  <div style={{ width: 100 }}>
                    <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Side</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[0, 1].map(row => (
                        <div key={row} style={{ display: 'flex', gap: 6 }}>
                          {['SL', 'SU'].map(type => {
                            const id = `${type}${row + 1}`
                            const sel = selectedBerths.includes(id)
                            const disabled = !sel && selectedBerths.length >= passengers.length
                            return (
                              <button key={id} onClick={() => toggleBerth(id)} disabled={disabled} style={{
                                flex: 1, padding: '8px 4px', borderRadius: 8,
                                border: `1px solid ${sel ? t.accent : t.border}`,
                                background: sel ? t.accentDim : disabled ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : t.bgAlt),
                                color: sel ? t.accent : disabled ? t.textMuted : t.textSec,
                                fontSize: 11, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.15s',
                              }}>{type}</button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ color: t.textMuted, fontSize: 11, marginTop: 8 }}>LB = Lower · MB = Middle · UB = Upper · SL = Side Lower · SU = Side Upper</p>
              </section>

              {/* ── E-Catering ── */}
              <section style={{ marginBottom: 16 }}>
                <FeatureToggle
                  emoji="🍱"
                  title="E-Catering / Order Food"
                  subtitle="Freshly cooked meals delivered to your seat at selected stations — IRCTC Food Service"
                  checked={eCatering}
                  onChange={setECatering}
                  accent="#f97316"
                  t={t} isDark={isDark}
                >
                  <p style={{ color: t.textSec, fontSize: 13, margin: 0 }}>
                    You can select your meal at the next step. Food will be delivered by our partner at the station of your choice during the journey.
                  </p>
                </FeatureToggle>
              </section>

              {/* ── Travel Insurance ── */}
              <section style={{ marginBottom: 24 }}>
                <FeatureToggle
                  emoji="🛡️"
                  title="Travel Insurance"
                  subtitle={`₹35 per traveller · ₹${35 * passengers.length} total · Powered by IRCTC Insurance`}
                  checked={addInsurance}
                  onChange={setAddInsurance}
                  accent="#34d399"
                  t={t} isDark={isDark}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {INSURANCE_COVERS.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <span style={{ color: '#34d399', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ color: t.textSec, fontSize: 12 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </FeatureToggle>
              </section>

              {/* ── Booking Preferences ── */}
              <section style={{ marginBottom: 28 }}>
                <h2 style={{ color: t.text, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>Booking Preferences</h2>
                <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px 20px', boxShadow: isDark ? 'none' : t.shadow }}>
                  <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${t.border}` }}>
                    <label style={labelStyle}>Preferred Coach (optional)</label>
                    <input
                      value={prefCoach}
                      onChange={e => setPrefCoach(e.target.value.toUpperCase().slice(0, 4))}
                      placeholder="e.g. S4, B2, A1"
                      style={inputSt}
                    />
                    <div style={{ color: t.textMuted, fontSize: 11, marginTop: 6 }}>We'll try to allot a berth in this coach. Not guaranteed.</div>
                  </div>
                  <Toggle checked={confirmOnly} onChange={setConfirmOnly} label="Book only if ticket is confirmed" description="Don't book if only waitlist or RAC is available" t={t} isDark={isDark} />
                  <Toggle checked={sameCoach} onChange={setSameCoach} label="All passengers in same coach" description="Required for groups travelling together" t={t} isDark={isDark} />
                  <div style={{ paddingTop: 2 }}>
                    <Toggle checked={autoUpgrade} onChange={setAutoUpgrade} label="Consider for auto-upgrade" description="Get a free upgrade to a higher class if available" t={t} isDark={isDark} />
                  </div>
                </div>
              </section>

              <button onClick={handleContinue} style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: 15, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Continue to Payment →
              </button>
            </>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <>
              <h2 style={{ color: t.text, fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20 }}>
                How would you like to pay?
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
                  <label key={id} onClick={() => setPayMethod(id)} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, cursor: 'pointer',
                    border: `1px solid ${payMethod === id ? t.accentBorder : t.border}`,
                    background: payMethod === id ? t.accentDim : (isDark ? 'rgba(255,255,255,0.02)' : 'white'),
                    transition: 'all 0.15s', boxShadow: isDark ? 'none' : t.shadow,
                  }}>
                    <input type="radio" name="pay" value={id} checked={payMethod === id} onChange={() => setPayMethod(id)} style={{ accentColor: t.accent, flexShrink: 0 }} />
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: payMethod === id ? t.accentDim : (isDark ? 'rgba(255,255,255,0.05)' : t.bgAlt), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color: payMethod === id ? t.accent : t.textMuted }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: payMethod === id ? t.text : t.textSec, fontWeight: 600, fontSize: 14 }}>{label}</div>
                      <div style={{ color: t.textMuted, fontSize: 12, marginTop: 2 }}>{sub}</div>
                    </div>
                    {id === 'ewallet' && (
                      <div style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: total <= EWALLET_BALANCE ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)', color: total <= EWALLET_BALANCE ? '#22c55e' : '#ef4444' }}>
                        {total <= EWALLET_BALANCE ? '✓ Sufficient' : '⚠ Low'}
                      </div>
                    )}
                  </label>
                ))}
              </div>

              {/* UPI input */}
              {payMethod === 'upi' && (
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@paytm · @gpay · @upi" style={inputSt} />
                </div>
              )}

              {/* eWallet panel */}
              {payMethod === 'ewallet' && (
                <div style={{ marginBottom: 20, padding: '16px 18px', borderRadius: 14, background: isDark ? 'rgba(52,211,153,0.05)' : '#f0fdf4', border: `1px solid ${total <= EWALLET_BALANCE ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: t.textSec, fontSize: 14, fontWeight: 600 }}>Train Wallet Balance</span>
                    <span style={{ color: '#22c55e', fontWeight: 900, fontSize: 20 }}>₹{EWALLET_BALANCE}</span>
                  </div>
                  {total <= EWALLET_BALANCE ? (
                    <>
                      <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 600 }}>✓ ₹{total} will be deducted from your wallet</div>
                      <div style={{ color: t.textMuted, fontSize: 12, marginTop: 4 }}>Remaining balance after payment: ₹{EWALLET_BALANCE - total}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>⚠ Insufficient balance (need ₹{total - EWALLET_BALANCE} more)</div>
                      <button style={{ marginTop: 10, padding: '7px 16px', borderRadius: 8, border: 'none', background: t.accentGrad, color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                        Recharge Wallet
                      </button>
                    </>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: `1px solid ${t.border}`, background: 'transparent', color: t.textSec, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  ← Back
                </button>
                <button
                  onClick={() => setConfirmed(true)}
                  disabled={payMethod === 'ewallet' && total > EWALLET_BALANCE}
                  style={{
                    flex: 2, padding: '13px', borderRadius: 12, border: 'none',
                    background: payMethod === 'ewallet' && total > EWALLET_BALANCE ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : t.accentGrad,
                    color: payMethod === 'ewallet' && total > EWALLET_BALANCE ? t.textMuted : 'white',
                    fontWeight: 700, fontSize: 15, cursor: payMethod === 'ewallet' && total > EWALLET_BALANCE ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <Lock size={14} /> Pay ₹{total}
                </button>
              </div>
              <p style={{ color: t.textMuted, fontSize: 12, textAlign: 'center', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Lock size={10} /> 256-bit SSL · PCI DSS Compliant
              </p>
            </>
          )}
        </div>

        {/* ════════════════════════════════════ RIGHT (Fare summary) ════════ */}
        <div style={isMobile ? {} : { position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid ${t.border}`, borderRadius: 20, padding: '20px 24px', boxShadow: isDark ? 'none' : t.shadow }}>

            {/* Train info */}
            <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${t.border}` }}>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{train.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.textMuted, fontSize: 13 }}>
                <span>{from.split('(')[0].trim()}</span>
                <ArrowRight size={11} />
                <span>{to.split('(')[0].trim()}</span>
              </div>
              <div style={{ color: t.textMuted, fontSize: 12, marginTop: 4 }}>{cls} · {fmtDate(date)}</div>
            </div>

            {/* Fare breakdown */}
            {[
              [`Base × ${passengers.length}`, `₹${base}`],
              ['Reservation charge', `₹${reservFee}`],
              ['GST & taxes (5%)', `₹${taxes}`],
              ['Service fee', `₹${serviceFee}`],
              ...(addInsurance ? [[`Insurance × ${passengers.length}`, `₹${insuranceFee}`]] : []),
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: t.textSec, fontSize: 13 }}>{l}</span>
                <span style={{ color: t.textSec, fontSize: 13 }}>{v}</span>
              </div>
            ))}

            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: t.text, fontWeight: 700, fontSize: 15 }}>Total</span>
              <span style={{ color: t.accent, fontWeight: 900, fontSize: 22 }}>₹{total}</span>
            </div>

            {/* Cancellation note */}
            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, background: isDark ? 'rgba(52,211,153,0.08)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontSize: 12 }}>
              ✓ Free cancellation before 24h departure
            </div>

            {/* Add-ons summary */}
            {(eCatering || addInsurance) && (
              <div style={{ marginTop: 10 }}>
                {eCatering && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: isDark ? 'rgba(249,115,22,0.08)' : '#fff7ed', border: '1px solid rgba(249,115,22,0.2)', marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>🍱</span>
                    <span style={{ color: '#f97316', fontSize: 12, fontWeight: 600 }}>E-Catering enabled</span>
                  </div>
                )}
                {addInsurance && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: isDark ? 'rgba(52,211,153,0.06)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.2)' }}>
                    <span style={{ fontSize: 13 }}>🛡️</span>
                    <span style={{ color: '#34d399', fontSize: 12, fontWeight: 600 }}>Travel insurance added</span>
                  </div>
                )}
              </div>
            )}

            {/* Preference summary */}
            {(confirmOnly || sameCoach || autoUpgrade || prefCoach) && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 12, background: isDark ? 'rgba(99,102,241,0.08)' : '#eef2ff', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ color: '#6366f1', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Preferences</div>
                {prefCoach && <div style={{ color: t.textSec, fontSize: 12, marginBottom: 2 }}>Coach: {prefCoach}</div>}
                {confirmOnly && <div style={{ color: t.textSec, fontSize: 12, marginBottom: 2 }}>✓ Confirmed only</div>}
                {sameCoach  && <div style={{ color: t.textSec, fontSize: 12, marginBottom: 2 }}>✓ Same coach</div>}
                {autoUpgrade && <div style={{ color: t.textSec, fontSize: 12 }}>✓ Auto-upgrade</div>}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
