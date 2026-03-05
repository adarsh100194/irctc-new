import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, ArrowLeft, Sun, Moon, Smartphone, Fingerprint, ShieldCheck, X, Globe } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useWindowSize } from '../hooks/useWindowSize'

const MOCK = { username: 'testuser', password: 'test@123', name: 'Adarsh Mohan' }

const TESTIMONIALS = [
  { quote: "Finally, booking a train doesn't feel like filling a tax return.", name: 'Priya K.', city: 'Mumbai', role: 'Frequent traveller', initial: 'P', grad: 'linear-gradient(135deg,#f97316,#6366f1)' },
  { quote: "The new interface is clean and fast. Booked Rajdhani in under 2 minutes.", name: 'Rajan M.', city: 'Chennai', role: 'Business traveller', initial: 'R', grad: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
  { quote: "Love the dark mode! Booking late-night tickets is so much easier now.", name: 'Sneha D.', city: 'Pune', role: 'Student', initial: 'S', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { quote: "PNR tracking and seat info all in one place. No more confusion!", name: 'Arjun T.', city: 'Kolkata', role: 'Regular commuter', initial: 'A', grad: 'linear-gradient(135deg,#10b981,#0ea5e9)' },
  { quote: "Cancelled a ticket and got refund info instantly. Very impressed.", name: 'Meera B.', city: 'Bengaluru', role: 'Software engineer', initial: 'M', grad: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  { quote: "The festival travel suggestions are spot on. Planned my Durga Puja trip easily.", name: 'Souvik G.', city: 'Bhubaneswar', role: 'Holiday planner', initial: 'S', grad: 'linear-gradient(135deg,#ef4444,#f97316)' },
]

/* ─────────────────────────────────────────────────────
   Simplified Ashoka Lion Capital — India's National Emblem
   (Stylised for web use — not the official artwork)
───────────────────────────────────────────────────── */
function NationalEmblem({ size = 44 }) {
  const chakraAngles = [0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345]
  const cx = 24, cy = 24.75, r1 = 1.0, r2 = 2.9
  return (
    <svg width={size} height={Math.round(size * 1.26)} viewBox="0 0 48 61" fill="white" xmlns="http://www.w3.org/2000/svg">
      {/* ── Three lion heads (front view of Lion Capital) ── */}
      {/* Left lion */}
      <circle cx="11" cy="15" r="7.5" />
      <polygon points="7.2,8.8 9.2,4 11,8.8" />
      <polygon points="11,8.8 12.8,4 14.8,8.8" />
      {/* Right lion */}
      <circle cx="37" cy="15" r="7.5" />
      <polygon points="33.2,8.8 35.2,4 37,8.8" />
      <polygon points="37,8.8 38.8,4 40.8,8.8" />
      {/* Centre lion */}
      <circle cx="24" cy="12" r="7.5" />
      <polygon points="20.2,5.8 22.2,1 24,5.8" />
      <polygon points="24,5.8 25.8,1 27.8,5.8" />
      {/* ── Abacus / capital band ── */}
      <rect x="5" y="22.5" width="38" height="5.5" rx="1.5" opacity="0.9" />
      {/* ── Ashoka Chakra on abacus (24 spokes) ── */}
      <circle cx={cx} cy={cy} r="3.2" fill="none" stroke="#001840" strokeWidth="1.3" />
      <circle cx={cx} cy={cy} r="1.0" fill="#001840" />
      {chakraAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <line
            key={i}
            x1={cx + r1 * Math.sin(rad)} y1={cy - r1 * Math.cos(rad)}
            x2={cx + r2 * Math.sin(rad)} y2={cy - r2 * Math.cos(rad)}
            stroke="#001840" strokeWidth="0.55"
          />
        )
      })}
      {/* ── Pillar shaft ── */}
      <rect x="18.5" y="28" width="11" height="24" rx="2.5" opacity="0.85" />
      {/* ── Lotus base ── */}
      <ellipse cx="24" cy="55" rx="21" ry="4.5" opacity="0.7" />
      <path d="M9,55 Q14,47.5 19,55"  fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>
      <path d="M18,55 Q24,46.5 30,55" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>
      <path d="M29,55 Q34,47.5 39,55" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────
   LoginPage
───────────────────────────────────────────────────── */
export default function LoginPage({ onLogin }) {
  const [tab, setTab]         = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm]       = useState({ username: '', password: '' })
  const [reg,  setReg]        = useState({ name: '', email: '', username: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [done,  setDone]      = useState(false)
  const navigate  = useNavigate()
  const { t, toggle, isDark } = useTheme()
  const { tl, lang, setLang, languages } = useLanguage()
  const { isMobile } = useWindowSize()
  const [langOpen, setLangOpen] = useState(false)

  /* Testimonials carousel */
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const testimonialTimer = useRef(null)
  const resetTestimonialTimer = (idx) => {
    clearInterval(testimonialTimer.current)
    testimonialTimer.current = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4500)
    if (idx !== undefined) setTestimonialIdx(idx)
  }
  useEffect(() => {
    testimonialTimer.current = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4500)
    return () => clearInterval(testimonialTimer.current)
  }, [])

  /* Auth method: 'credentials' | 'otp' */
  /* Demo credentials toast */
  const [showDemoToast, setShowDemoToast] = useState(true)

  const [authMethod, setAuthMethod] = useState('credentials')

  /* OTP sub-type: 'mobile' | 'aadhaar' | 'vid' */
  const [otpType, setOtpType] = useState('mobile')

  /* Mobile OTP */
  const [mobile, setMobile]             = useState('')
  const [mobileOtp, setMobileOtp]       = useState('')
  const [mobileOtpSent, setMobileOtpSent] = useState(false)

  /* Aadhaar OTP */
  const [aadhaar, setAadhaar]               = useState('')
  const [aadhaarOtp, setAadhaarOtp]         = useState('')
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false)

  /* Virtual ID OTP */
  const [vid, setVid]               = useState('')
  const [vidOtp, setVidOtp]         = useState('')
  const [vidOtpSent, setVidOtpSent] = useState(false)

  const resetAlt = () => {
    setAuthMethod('credentials'); setError(''); setOtpType('mobile')
    setMobile(''); setMobileOtp(''); setMobileOtpSent(false)
    setAadhaar(''); setAadhaarOtp(''); setAadhaarOtpSent(false)
    setVid(''); setVidOtp(''); setVidOtpSent(false)
  }

  /* helper: reset only the OTP-sent state when switching sub-type */
  const switchOtpType = (type) => {
    setOtpType(type); setError('')
    setMobileOtpSent(false); setAadhaarOtpSent(false); setVidOtpSent(false)
  }

  /* ── Credential login ── */
  const login = (e) => {
    e.preventDefault()
    if (form.username === MOCK.username && form.password === MOCK.password) {
      onLogin({ name: MOCK.name, username: form.username }); navigate('/home')
    } else setError('Wrong credentials — try testuser / test@123')
  }

  /* ── Signup ── */
  const signup = (e) => {
    e.preventDefault()
    if (reg.password !== reg.confirm) return setError("Passwords don't match")
    setDone(true)
    setTimeout(() => { setTab('login'); setDone(false); resetAlt() }, 1800)
  }

  /* ── Mobile OTP ── */
  const sendMobileOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setError('Enter a valid 10-digit mobile number'); return }
    setError(''); setMobileOtpSent(true)
  }
  const verifyMobileOtp = () => {
    if (mobileOtp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    onLogin({ name: MOCK.name, username: 'testuser' }); navigate('/home')
  }

  /* ── Aadhaar OTP ── */
  const fmtAadhaar = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 12)
    return d.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  const sendAadhaarOtp = () => {
    if (aadhaar.replace(/\s/g, '').length !== 12) { setError('Enter a valid 12-digit Aadhaar number'); return }
    setError(''); setAadhaarOtpSent(true)
  }
  const verifyAadhaarOtp = () => {
    if (aadhaarOtp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    onLogin({ name: MOCK.name, username: 'testuser' }); navigate('/home')
  }

  /* ── Virtual ID OTP ── */
  const fmtVid = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 16)
    return d.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  const sendVidOtp = () => {
    if (vid.replace(/\s/g, '').length !== 16) { setError('Enter a valid 16-digit Virtual ID'); return }
    setError(''); setVidOtpSent(true)
  }
  const verifyVidOtp = () => {
    if (vidOtp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    onLogin({ name: MOCK.name, username: 'testuser' }); navigate('/home')
  }

  /* ── DigiLocker ── */
  const loginDigiLocker = () => { onLogin({ name: MOCK.name, username: 'testuser' }); navigate('/home') }

  const iStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: `1px solid ${t.inputBorder}`, background: t.input,
    color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }
  const btnPrimary = {
    width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer',
    background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: 15,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  }
  const labelSt = {
    color: t.textMuted, fontSize: 11, fontWeight: 700, display: 'block',
    marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: t.bg }}>

      {/* ═══════════════════════════════════════════════════════
          Government of India Official Header Strip
      ═══════════════════════════════════════════════════════ */}
      <div style={{
        background: '#002060',
        borderBottom: '3px solid #f97316',
        padding: isMobile ? '8px 14px' : '10px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        flexShrink: 0,
      }}>
        {/* Left: emblem + government text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14 }}>
          <NationalEmblem size={isMobile ? 30 : 40} />
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: isMobile ? 10.5 : 13, letterSpacing: '0.025em' }}>
              भारत सरकार &nbsp;|&nbsp; Government of India
            </div>
            <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: isMobile ? 9 : 11, marginTop: 2, letterSpacing: '0.02em' }}>
              रेल मंत्रालय &nbsp;|&nbsp; Ministry of Railways
            </div>
          </div>
        </div>

        {/* Centre: certification badges — desktop only */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {[['🔒', 'ISO 27001:2013'], ['💳', 'PCI DSS Compliant'], ['🇮🇳', 'Official Portal']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11 }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.52)', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Right: language picker + theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Language picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{ height: 30, borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, paddingInline: 8, color: 'rgba(255,255,255,0.75)' }}
            >
              <Globe size={12} />
              {!isMobile && <span style={{ fontSize: 11, fontWeight: 600 }}>{languages.find(l => l.code === lang)?.nativeName}</span>}
            </button>
            {langOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setLangOpen(false)} />
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', width: 252, background: '#0a1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, zIndex: 99, boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                  <div style={{ padding: '9px 13px 7px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tl('lang.select')}</span>
                  </div>
                  <div style={{ padding: 7, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                    {languages.map(l => (
                      <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                        style={{ textAlign: 'left', padding: '7px 9px', borderRadius: 8, border: lang === l.code ? '1px solid rgba(249,115,22,0.5)' : '1px solid transparent', cursor: 'pointer', background: lang === l.code ? 'rgba(249,115,22,0.15)' : 'transparent' }}
                        onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                        onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
                      >
                        <div style={{ color: lang === l.code ? '#f97316' : 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: lang === l.code ? 700 : 400 }}>{l.nativeName}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{l.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <button onClick={toggle} title={isDark ? 'Light mode' : 'Dark mode'} style={{ width: 30, height: 30, borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.75)' }}>
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Main layout (two-column on desktop, single on mobile)
      ═══════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>

        {/* ── Left: Brand panel (desktop only) ── */}
        {!isMobile && (
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            padding: '44px 52px',
            background: isDark ? 'rgba(255,255,255,0.01)' : '#003580',
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'transparent'}`,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative glow */}
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            {/* IRCTC logo + full official name */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: isDark ? t.accentGrad : 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: 'white', fontSize: 14, letterSpacing: '-0.5px',
                }}>IR</div>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 900, fontSize: 21, letterSpacing: '-0.5px', lineHeight: 1 }}>IRCTC</div>
                  <div style={{ color: 'rgba(255,255,255,0.52)', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1.5 }}>
                    Indian Railway Catering and Tourism Corporation
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', marginTop: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 10, fontWeight: 600 }}>{tl('login.govEnterprise')}</span>
              </div>
            </div>

            {/* Hero tagline */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 36, paddingBottom: 28 }}>
              <p style={{ color: isDark ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.52)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
                {tl('login.connecting')}
              </p>
              <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 16 }}>
                {tl('login.tagline1')}<br />
                <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.52)' }}>{tl('login.tagline2')}</span>
              </h1>
              <p style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.62)', fontSize: 14.5, lineHeight: 1.75, maxWidth: 340 }}>
                Book 13,000+ trains across every corner of India. Fast, secure, and officially powered by the Ministry of Railways.
              </p>

              {/* Key stats */}
              <div style={{ display: 'flex', gap: 28, marginTop: 30 }}>
                {[['13,000+', 'Trains daily'], ['2.3 Cr', 'Passengers'], ['7,335', 'Stations']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>{v}</div>
                    <div style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust credentials + testimonial */}
            <div>
              {/* Certification badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'ISO 27001:2013',   color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)' },
                  { label: 'PCI DSS',           color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
                  { label: 'Govt. Certified',   color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)' },
                  { label: 'DigiLocker Ready',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
                ].map(({ label, color, bg, border }) => (
                  <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, background: bg, border: `1px solid ${border}` }}>
                    <ShieldCheck size={9} style={{ color }} />
                    <span style={{ color, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Testimonials carousel */}
              <div style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.22)'}`, borderRadius: 16, padding: '16px 20px' }}>
                {/* Animated testimonial body */}
                <div key={testimonialIdx} style={{ animation: 'fadeIn 0.4s ease' }}>
                  <p style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.75)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 10 }}>
                    "{tl(`login.testimonial${testimonialIdx}.quote`)}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: TESTIMONIALS[testimonialIdx].grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {TESTIMONIALS[testimonialIdx].initial}
                    </div>
                    <div>
                      <div style={{ color: isDark ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.88)', fontSize: 13, fontWeight: 600 }}>{TESTIMONIALS[testimonialIdx].name}</div>
                      <div style={{ color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.52)', fontSize: 11 }}>{tl(`login.testimonial${testimonialIdx}.role`)} · {tl(`login.testimonial${testimonialIdx}.city`)}</div>
                    </div>
                  </div>
                </div>
                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: 5, marginTop: 12, justifyContent: 'center' }}>
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => resetTestimonialTimer(i)}
                      style={{
                        width: i === testimonialIdx ? 16 : 6,
                        height: 6, borderRadius: 3,
                        background: i === testimonialIdx
                          ? (isDark ? 'rgba(249,115,22,0.8)' : 'rgba(255,255,255,0.85)')
                          : (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.4)'),
                        border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'width 0.3s ease, background 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Right: Auth form ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile ? '28px 20px 32px' : '44px 64px',
          position: 'relative', background: t.bg, overflowY: 'auto',
        }}>

          {/* Mobile: compact IRCTC identity header */}
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 13 }}>IR</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: t.text, fontWeight: 900, fontSize: 18, lineHeight: 1 }}>IRCTC</div>
                  <div style={{ color: t.textMuted, fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.5 }}>Ministry of Railways, Govt. of India</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ maxWidth: 380, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 32, background: t.surface, borderRadius: 14, padding: 5, border: `1px solid ${t.border}` }}>
              {[['login', tl('login.signIn')], ['signup', tl('login.createAccount')]].map(([t2, l]) => (
                <button key={t2} onClick={() => { setTab(t2); setError(''); resetAlt() }} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  background: tab === t2 ? t.accent : 'transparent',
                  color: tab === t2 ? 'white' : t.textSec,
                }}>{l}</button>
              ))}
            </div>

            {tab === 'login' ? (
              <>
                {/* ── CREDENTIALS ── */}
                {authMethod === 'credentials' && (
                  <form onSubmit={login}>
                    <h2 style={{ color: t.text, fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{tl('login.welcomeBack')}</h2>
                    <p style={{ color: t.textSec, fontSize: 14, marginBottom: 28 }}>{tl('login.signInSubtitle')}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <label style={labelSt}>{tl('login.userId')}</label>
                        <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="testuser" required style={iStyle} autoComplete="username" />
                      </div>
                      <div>
                        <label style={labelSt}>{tl('login.password')}</label>
                        <div style={{ position: 'relative' }}>
                          <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required style={iStyle} autoComplete="current-password" />
                          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 0 }}>
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0 22px' }}>
                      <a href="#" style={{ color: t.accent, fontSize: 13, textDecoration: 'none' }}>{tl('login.forgotPassword')}</a>
                    </div>

                    {error && <ErrBox msg={error} t={t} />}

                    <button type="submit" style={btnPrimary}>{tl('login.signIn')} <ArrowRight size={14} /></button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 16px' }}>
                      <div style={{ flex: 1, height: 1, background: t.border }} />
                      <span style={{ color: t.textMuted, fontSize: 12, fontWeight: 600 }}>{tl('login.orSignInWith')}</span>
                      <div style={{ flex: 1, height: 1, background: t.border }} />
                    </div>

                    {/* Alt auth buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                      {/* Combined OTP button */}
                      <button type="button" onClick={() => { setAuthMethod('otp'); setError('') }} style={{
                        width: '100%', padding: '11px 16px', borderRadius: 12,
                        border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', transition: 'border-color 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1' + '70'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                      >
                        {/* Two overlapping icons */}
                        <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Smartphone size={15} style={{ color: '#6366f1' }} />
                          </div>
                          <div style={{ position: 'absolute', bottom: -3, right: -4, width: 18, height: 18, borderRadius: 6, background: isDark ? 'rgba(52,211,153,0.2)' : '#ecfdf5', border: `2px solid ${t.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Fingerprint size={10} style={{ color: '#34d399' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ color: t.text, fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{tl('login.otpSignIn')}</div>
                          <div style={{ color: t.textMuted, fontSize: 11 }}>{tl('login.mobileTab')} · {tl('login.aadhaarTab')} · {tl('login.vidTab')}</div>
                        </div>
                        <ArrowRight size={12} style={{ color: t.textMuted, marginLeft: 'auto' }} />
                      </button>

                      {/* DigiLocker */}
                      <button type="button" onClick={loginDigiLocker} style={{
                        width: '100%', padding: '11px 16px', borderRadius: 12,
                        border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', transition: 'border-color 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316' + '60'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                      >
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: isDark ? 'rgba(249,115,22,0.12)' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ShieldCheck size={15} style={{ color: '#f97316' }} />
                        </div>
                        <div>
                          <div style={{ color: t.text, fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>DigiLocker</div>
                          <div style={{ color: t.textMuted, fontSize: 11 }}>Instant govt. ID verification</div>
                        </div>
                        <div style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(249,115,22,0.15)' : '#fff7ed', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', fontSize: 10, fontWeight: 700 }}>INSTANT</div>
                      </button>
                    </div>
                  </form>
                )}

                {/* ── COMBINED OTP PANEL ── */}
                {authMethod === 'otp' && (
                  <div>
                    <BackBtn onClick={resetAlt} t={t} />
                    <h2 style={{ color: t.text, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{tl('login.otpSignIn')}</h2>
                    <p style={{ color: t.textSec, fontSize: 13, marginBottom: 20 }}>{tl('login.chooseMethod')}</p>

                    {/* ── 3-tab type switcher ── */}
                    <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: t.surface, borderRadius: 12, padding: 4, border: `1px solid ${t.border}` }}>
                      {[
                        { key: 'mobile',  label: tl('login.mobileTab'),  Icon: Smartphone },
                        { key: 'aadhaar', label: tl('login.aadhaarTab'), Icon: Fingerprint },
                        { key: 'vid',     label: tl('login.vidTab'),     Icon: ShieldCheck },
                      ].map(({ key, label, Icon }) => (
                        <button key={key} type="button" onClick={() => switchOtpType(key)} style={{
                          flex: 1, padding: '8px 4px', borderRadius: 9, border: 'none', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                          background: otpType === key ? (isDark ? 'rgba(255,255,255,0.1)' : 'white') : 'transparent',
                          color: otpType === key ? t.text : t.textMuted,
                          boxShadow: otpType === key ? (isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.1)') : 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        }}>
                          <Icon size={12} /> {label}
                        </button>
                      ))}
                    </div>

                    {/* ── Mobile tab ── */}
                    {otpType === 'mobile' && (
                      !mobileOtpSent ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <label style={labelSt}>{tl('login.mobileNum')}</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <div style={{ padding: '12px 14px', borderRadius: 12, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.textSec, fontSize: 14, whiteSpace: 'nowrap', flexShrink: 0 }}>🇮🇳 +91</div>
                              <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210" style={{ ...iStyle, flex: 1 }} inputMode="numeric" />
                            </div>
                          </div>
                          {error && <ErrBox msg={error} t={t} />}
                          <button type="button" onClick={sendMobileOtp} style={btnPrimary}>{tl('login.sendOtp')} <ArrowRight size={14} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(52,211,153,0.08)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', fontSize: 13 }}>
                            ✓ OTP sent to +91 {mobile.slice(0, 5)}•••••
                          </div>
                          <div>
                            <label style={labelSt}>{tl('login.enterOtp')}</label>
                            <input value={mobileOtp} onChange={e => setMobileOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit OTP" style={iStyle} inputMode="numeric" />
                          </div>
                          {error && <ErrBox msg={error} t={t} />}
                          <button type="button" onClick={verifyMobileOtp} style={btnPrimary}>{tl('login.verifyOtp')} <ArrowRight size={14} /></button>
                          <button type="button" onClick={() => { setMobileOtpSent(false); setError('') }} style={{ background: 'none', border: 'none', color: t.accent, fontSize: 13, cursor: 'pointer', textAlign: 'center', padding: '4px 0' }}>
                            Change number or resend OTP
                          </button>
                        </div>
                      )
                    )}

                    {/* ── Aadhaar tab ── */}
                    {otpType === 'aadhaar' && (
                      !aadhaarOtpSent ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <label style={labelSt}>{tl('login.aadhaarNum')}</label>
                            <input value={aadhaar} onChange={e => setAadhaar(fmtAadhaar(e.target.value))} placeholder="XXXX XXXX XXXX" style={iStyle} maxLength={14} inputMode="numeric" />
                            <div style={{ color: t.textMuted, fontSize: 11, marginTop: 6 }}>🔒 Encrypted end-to-end · Never stored on our servers</div>
                          </div>
                          {error && <ErrBox msg={error} t={t} />}
                          <button type="button" onClick={sendAadhaarOtp} style={btnPrimary}>{tl('login.sendOtp')} to linked mobile <ArrowRight size={14} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(52,211,153,0.08)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', fontSize: 13 }}>
                            ✓ OTP sent to mobile linked with Aadhaar {aadhaar.slice(0, 4)} ••••
                          </div>
                          <div>
                            <label style={labelSt}>{tl('login.enterOtp')}</label>
                            <input value={aadhaarOtp} onChange={e => setAadhaarOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit OTP" style={iStyle} inputMode="numeric" />
                          </div>
                          {error && <ErrBox msg={error} t={t} />}
                          <button type="button" onClick={verifyAadhaarOtp} style={btnPrimary}>{tl('login.verifyOtp')} <ArrowRight size={14} /></button>
                          <button type="button" onClick={() => { setAadhaarOtpSent(false); setError('') }} style={{ background: 'none', border: 'none', color: t.accent, fontSize: 13, cursor: 'pointer', textAlign: 'center', padding: '4px 0' }}>
                            Change Aadhaar or resend OTP
                          </button>
                        </div>
                      )
                    )}

                    {/* ── Virtual ID tab ── */}
                    {otpType === 'vid' && (
                      !vidOtpSent ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div>
                            <label style={labelSt}>{tl('login.vidLabel')}</label>
                            <input value={vid} onChange={e => setVid(fmtVid(e.target.value))} placeholder="XXXX XXXX XXXX XXXX" style={iStyle} maxLength={19} inputMode="numeric" />
                            <div style={{ color: t.textMuted, fontSize: 11, marginTop: 6 }}>16-digit VID generated from UIDAI · Replaces Aadhaar number</div>
                          </div>
                          {error && <ErrBox msg={error} t={t} />}
                          <button type="button" onClick={sendVidOtp} style={btnPrimary}>{tl('login.sendOtp')} to linked mobile <ArrowRight size={14} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(52,211,153,0.08)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', fontSize: 13 }}>
                            ✓ OTP sent to mobile linked with VID {vid.slice(0, 4)} ••••
                          </div>
                          <div>
                            <label style={labelSt}>{tl('login.enterOtp')}</label>
                            <input value={vidOtp} onChange={e => setVidOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit OTP" style={iStyle} inputMode="numeric" />
                          </div>
                          {error && <ErrBox msg={error} t={t} />}
                          <button type="button" onClick={verifyVidOtp} style={btnPrimary}>{tl('login.verifyOtp')} <ArrowRight size={14} /></button>
                          <button type="button" onClick={() => { setVidOtpSent(false); setError('') }} style={{ background: 'none', border: 'none', color: t.accent, fontSize: 13, cursor: 'pointer', textAlign: 'center', padding: '4px 0' }}>
                            Change VID or resend OTP
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              /* ── SIGNUP ── */
              <form onSubmit={signup}>
                <h2 style={{ color: t.text, fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Create account</h2>
                <p style={{ color: t.textSec, fontSize: 14, marginBottom: 28 }}>Join 230 million IRCTC travellers</p>
                {done ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                    <div style={{ color: t.green, fontWeight: 600 }}>Account created!</div>
                    <div style={{ color: t.textSec, fontSize: 13, marginTop: 6 }}>Redirecting…</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[['Full Name', 'name', 'text', 'Rahul Sharma'], ['Email', 'email', 'email', 'rahul@example.com'], ['Username', 'username', 'text', 'Choose a username']].map(([lbl, key, type, ph]) => (
                      <Field key={key} label={lbl} value={reg[key]} onChange={v => setReg({ ...reg, [key]: v })} placeholder={ph} type={type} t={t} iStyle={iStyle} />
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Field label="Password" value={reg.password} onChange={v => setReg({ ...reg, password: v })} placeholder="••••••" type="password" t={t} iStyle={iStyle} />
                      <Field label="Confirm"  value={reg.confirm}  onChange={v => setReg({ ...reg, confirm: v })}  placeholder="••••••" type="password" t={t} iStyle={iStyle} />
                    </div>
                    {error && <ErrBox msg={error} t={t} />}
                    <button type="submit" style={{ ...btnPrimary, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', marginTop: 4 }}>Create account <ArrowRight size={14} /></button>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* ── Official footer ── */}
          <div style={{ maxWidth: 380, width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${t.border}` }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: t.textMuted, fontSize: 10, letterSpacing: '0.01em', lineHeight: 1.9 }}>
                © 2025 IRCTC Ltd. &nbsp;·&nbsp; A Government of India Enterprise
              </div>
              <div style={{ color: t.textMuted, fontSize: 10, marginBottom: 10 }}>
                Powered by Ministry of Railways, Government of India
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Citizen Charter', 'Help'].map(link => (
                  <a key={link} href="#" style={{ color: t.accent, fontSize: 10, textDecoration: 'none' }}>{link}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ── Floating demo credentials toast ── */}
      {showDemoToast && tab === 'login' && authMethod === 'credentials' && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 500,
          background: isDark ? '#1a1a2e' : 'white',
          border: `1px solid ${t.accentBorder}`,
          borderRadius: 16,
          padding: '14px 16px',
          boxShadow: isDark
            ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.15)'
            : '0 8px 40px rgba(0,53,128,0.18)',
          minWidth: isMobile ? 0 : 260,
          width: isMobile ? 'calc(100vw - 32px)' : 'auto',
          animation: 'slideUp 0.3s ease',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🔑</span>
              <span style={{ color: t.textMuted, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{tl('login.demoCredentials')}</span>
            </div>
            <button onClick={() => setShowDemoToast(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 2, display: 'flex', borderRadius: 6 }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <X size={14} />
            </button>
          </div>

          {/* Credentials */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div>
              <div style={{ color: t.textMuted, fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{tl('login.userId')}</div>
              <div style={{ color: t.text, fontWeight: 800, fontSize: 15, fontFamily: 'monospace', letterSpacing: '0.02em' }}>testuser</div>
            </div>
            <div style={{ width: 1, background: t.border, alignSelf: 'stretch' }} />
            <div>
              <div style={{ color: t.textMuted, fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{tl('login.password')}</div>
              <div style={{ color: t.text, fontWeight: 800, fontSize: 15, fontFamily: 'monospace', letterSpacing: '0.02em' }}>test@123</div>
            </div>
          </div>

          {/* Auto-fill CTA */}
          <button
            onClick={() => { setForm({ username: 'testuser', password: 'test@123' }); setShowDemoToast(false) }}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 10,
              border: `1px solid ${t.accentBorder}`, background: t.accentDim,
              color: t.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(249,115,22,0.2)' : '#fed7aa'}
            onMouseLeave={e => e.currentTarget.style.background = t.accentDim}
          >
            ⚡ {tl('login.autofill')}
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ── */
function Field({ label, value, onChange, placeholder, type = 'text', t, iStyle }) {
  return (
    <div>
      <label style={{ color: t.textMuted, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required style={iStyle} />
    </div>
  )
}

function ErrBox({ msg, t }) {
  return (
    <div style={{ background: t.redDim, border: `1px solid ${t.red}30`, borderRadius: 10, padding: '10px 14px', color: t.red, fontSize: 13, marginBottom: 4 }}>{msg}</div>
  )
}

function BackBtn({ onClick, t }) {
  return (
    <button type="button" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: t.textSec, cursor: 'pointer', fontSize: 13, marginBottom: 24, padding: 0 }}>
      <ArrowLeft size={14} /> Back to sign in
    </button>
  )
}
