import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, MapPin, Calendar, LayoutGrid, Repeat, Train, ShieldCheck, Navigation, X, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { UPCOMING_TRIPS, MOCK_BOOKINGS } from '../data/mockData'
import { useWindowSize } from '../hooks/useWindowSize'

const STATIONS = [
  'New Delhi (NDLS)', 'Mumbai CST (CSTM)', 'Bengaluru (SBC)',
  'Chennai Central (MAS)', 'Kolkata Howrah (HWH)', 'Hyderabad (HYB)',
  'Pune (PUNE)', 'Ahmedabad (ADI)', 'Jaipur (JP)', 'Lucknow (LKO)',
  'Varanasi (BSB)', 'Agra Cantt (AGC)', 'Amritsar (ASR)', 'Bhopal (BPL)',
  'Muzaffarpur (MFP)', 'Mathura (MTJ)', 'Ajmer (AII)', 'Haridwar (HW)',
]

const STATION_COORDS = {
  'New Delhi (NDLS)': { lat: 28.6419, lng: 77.2194 },
  'Mumbai CST (CSTM)': { lat: 18.9401, lng: 72.8355 },
  'Bengaluru (SBC)': { lat: 12.9774, lng: 77.5752 },
  'Chennai Central (MAS)': { lat: 13.0827, lng: 80.2707 },
  'Kolkata Howrah (HWH)': { lat: 22.5837, lng: 88.3426 },
  'Hyderabad (HYB)': { lat: 17.3850, lng: 78.4867 },
  'Pune (PUNE)': { lat: 18.5204, lng: 73.8567 },
  'Ahmedabad (ADI)': { lat: 23.0225, lng: 72.5714 },
  'Jaipur (JP)': { lat: 26.9124, lng: 75.7873 },
  'Lucknow (LKO)': { lat: 26.8467, lng: 80.9462 },
  'Varanasi (BSB)': { lat: 25.3176, lng: 82.9739 },
  'Agra Cantt (AGC)': { lat: 27.1767, lng: 78.0081 },
  'Amritsar (ASR)': { lat: 31.6340, lng: 74.8723 },
  'Bhopal (BPL)': { lat: 23.2599, lng: 77.4126 },
  'Muzaffarpur (MFP)': { lat: 26.1209, lng: 85.3647 },
  'Mathura (MTJ)': { lat: 27.4924, lng: 77.6737 },
  'Ajmer (AII)': { lat: 26.4499, lng: 74.6399 },
  'Haridwar (HW)': { lat: 29.9457, lng: 78.1642 },
}

const getNearestStation = (lat, lng) => {
  let nearest = 'New Delhi (NDLS)', minDist = Infinity
  for (const [name, c] of Object.entries(STATION_COORDS)) {
    const d = Math.sqrt((c.lat - lat) ** 2 + (c.lng - lng) ** 2)
    if (d < minDist) { minDist = d; nearest = name }
  }
  return nearest
}

const FESTIVALS = [
  { id: 'holi-mathura', badge: '🎨 Holi · Mar 14', title: 'Mathura & Vrindavan', tagline: 'Play Holi at the birthplace of Krishna', from: 'New Delhi (NDLS)', to: 'Mathura (MTJ)', seatsLeft: 23, price: 180, daysAway: '10 days away', color: '#f97316', urgency: 'medium' },
  { id: 'holi-pushkar', badge: '🌸 Holi · Mar 14', title: 'Pushkar', tagline: "Rajasthan's wildest & most colorful Holi", from: 'New Delhi (NDLS)', to: 'Ajmer (AII)', seatsLeft: 8, price: 310, daysAway: '10 days away', color: '#ec4899', urgency: 'high' },
  { id: 'ram-navami', badge: '🛕 Ram Navami · Apr 6', title: 'Ayodhya', tagline: 'Grand celebrations at Ram Mandir', from: 'New Delhi (NDLS)', to: 'Varanasi (BSB)', seatsLeft: 15, price: 395, daysAway: '33 days away', color: '#f59e0b', urgency: 'medium' },
  { id: 'baisakhi', badge: '🌾 Baisakhi · Apr 13', title: 'Amritsar', tagline: 'Golden Temple + harvest festival', from: 'New Delhi (NDLS)', to: 'Amritsar (ASR)', seatsLeft: 41, price: 465, daysAway: '40 days away', color: '#f97316', urgency: 'low' },
  { id: 'darjeeling', badge: '🍵 Summer escape', title: 'Darjeeling', tagline: 'Toy train, tea gardens & Himalayan mornings', from: 'Kolkata Howrah (HWH)', to: 'New Jalpaiguri (NJP)', seatsLeft: 12, price: 345, daysAway: 'Book early', color: '#10b981', urgency: 'medium' },
  { id: 'rishikesh', badge: '🏔️ This weekend', title: 'Rishikesh', tagline: 'Rafting, yoga & Ganga aarti', from: 'New Delhi (NDLS)', to: 'Haridwar (HW)', seatsLeft: 6, price: 220, daysAway: '5 days away', color: '#6366f1', urgency: 'high' },
]

const FREQUENT_ROUTES = [
  { from: 'New Delhi (NDLS)', to: 'Muzaffarpur (MFP)', lastTraveled: '2 weeks ago', price: 620, count: 12 },
  { from: 'Muzaffarpur (MFP)', to: 'New Delhi (NDLS)', lastTraveled: '1 month ago', price: 620, count: 11 },
]

const CLASSES = ['All Classes', 'SL', '3A', '2A', '1A']

// Mock PNR lookup
const PNR_MOCK = {
  '4521873690': { train: 'Sampark Kranti (12217)', from: 'New Delhi (NDLS)', to: 'Muzaffarpur (MFP)', date: '7 Mar 2026', dep: '06:20', cls: 'SL', coach: 'S4', passengers: [{ name: 'Rahul Sharma', berth: 'S4/32', status: 'CNF' }] },
  '6789012345': { train: 'Rajdhani Express (22691)', from: 'New Delhi (NDLS)', to: 'Mathura (MTJ)', date: '14 Mar 2026', dep: '20:00', cls: '3A', coach: 'B3', passengers: [{ name: 'Rahul Sharma', berth: 'B3/45', status: 'CNF' }] },
  '3456789012': { train: 'Howrah Rajdhani (12301)', from: 'New Delhi (NDLS)', to: 'Amritsar (ASR)', date: '13 Apr 2026', dep: '14:05', cls: '2A', coach: 'A1', passengers: [{ name: 'Rahul Sharma', berth: 'A1/8', status: 'CNF' }] },
}

// Mock live train status
const TRAIN_STATUS = {
  '12217': { name: 'Sampark Kranti', number: '12217', status: '🟡 Running 15 min late', current: 'Kanpur Central (CNB)', platform: '3', lastUpdated: '2 min ago', nextStation: 'Lucknow Jn (LKO)', arrNext: '14:35', delay: '+15 min' },
  '22691': { name: 'Rajdhani Express', number: '22691', status: '🟢 On Time', current: 'Mathura Jn (MTJ)', platform: '2', lastUpdated: '5 min ago', nextStation: 'New Delhi (NDLS)', arrNext: '21:45', delay: 'On time' },
  '12951': { name: 'Mumbai Rajdhani', number: '12951', status: '🔴 Running 45 min late', current: 'Vadodara Jn (BRC)', platform: '1', lastUpdated: '8 min ago', nextStation: 'Surat (ST)', arrNext: '03:10', delay: '+45 min' },
  '12301': { name: 'Howrah Rajdhani', number: '12301', status: '🟢 On Time', current: 'Allahabad Jn (ALD)', platform: '4', lastUpdated: '1 min ago', nextStation: 'Kanpur Central (CNB)', arrNext: '23:50', delay: 'On time' },
}

/* ─────────────────────────────────────────────────────
   Indian Railways — verified statistics
   Sources: Indian Railways Annual Report, Railway Board,
            Guinness World Records, Ministry of Railways
───────────────────────────────────────────────────── */
const RAILWAY_FACTS = [
  {
    value: '2.3 Crore',
    label: 'Daily Passengers',
    sub: '23 million journeys every single day',
    icon: '👥',
    color: '#6366f1',
  },
  {
    value: '13,000+',
    label: 'Trains Daily',
    sub: 'Covering every corner of India',
    icon: '🚆',
    color: '#f97316',
  },
  {
    value: '67,500+ km',
    label: 'Route Network',
    sub: '4th largest railway network in the world',
    icon: '🗺️',
    color: '#10b981',
  },
  {
    value: '7,335',
    label: 'Stations',
    sub: 'Cities, towns & villages connected',
    icon: '🚉',
    color: '#3b82f6',
  },
  {
    value: '14 Lakh+',
    label: 'Employees',
    sub: "One of the world's largest employers",
    icon: '👷',
    color: '#8b5cf6',
  },
  {
    value: '1,366 m',
    label: 'Longest Platform',
    sub: 'Gorakhpur Jn — Guinness World Record',
    icon: '🏆',
    color: '#f59e0b',
  },
  {
    value: '170+ Years',
    label: 'Of Service',
    sub: 'First train ran on 16 April 1853',
    icon: '🚂',
    color: '#ec4899',
  },
  {
    value: '~2 Billion km',
    label: 'Annually',
    sub: 'Total distance covered by all trains per year',
    icon: '🌏',
    color: '#14b8a6',
  },
]

const fomoBadge = (seatsLeft, urgency) => {
  if (urgency === 'high' || seatsLeft <= 10) return { text: `🔥 Only ${seatsLeft} seats left!`, color: '#ef4444' }
  if (urgency === 'medium' || seatsLeft <= 25) return { text: `⚡ ${seatsLeft} seats left`, color: '#f97316' }
  return { text: 'Filling fast!', color: '#f59e0b' }
}

const getCountdown = (dateStr, depTime, now) => {
  const target = new Date(`${dateStr}T${depTime}:00`)
  const diff = target - now
  if (diff <= 0) return { text: 'Departed', urgent: false, color: '#94a3b8' }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const urgent = days < 2
  const parts = []
  if (days > 0) parts.push(`${days}d`)
  parts.push(`${hours}h`)
  return { text: parts.join(' '), urgent, color: days === 0 ? '#ef4444' : days < 3 ? '#f97316' : '#34d399' }
}

const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

export default function HomePage({ user, onLogout }) {
  const navigate = useNavigate()
  const { t, isDark } = useTheme()
  const { tl } = useLanguage()
  const { isMobile, isTablet } = useWindowSize()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [cls, setCls] = useState('All Classes')
  const [fromSugg, setFromSugg] = useState([])
  const [toSugg, setToSugg] = useState([])
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [now, setNow] = useState(new Date())

  // Modal states
  const [showPnr, setShowPnr] = useState(false)
  const [pnrInput, setPnrInput] = useState('')
  const [pnrResult, setPnrResult] = useState(null)
  const [showTrack, setShowTrack] = useState(false)
  const [trainNumInput, setTrainNumInput] = useState('')
  const [trackResult, setTrackResult] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const filter = q => STATIONS.filter(s => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6)

  const search = (e) => {
    e.preventDefault()
    if (!from || !to) return
    navigate(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&class=${encodeURIComponent(cls)}`)
  }

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp) }

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setGeoError('Geolocation not supported'); return }
    setGeoLoading(true); setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => { setFrom(getNearestStation(pos.coords.latitude, pos.coords.longitude)); setGeoLoading(false) },
      () => { setFrom('New Delhi (NDLS)'); setGeoError('Using nearest major station'); setGeoLoading(false); setTimeout(() => setGeoError(''), 2500) },
      { timeout: 5000 }
    )
  }

  const checkPnr = () => {
    const found = PNR_MOCK[pnrInput.trim()] || MOCK_BOOKINGS.find(b => b.pnr === pnrInput.trim())
    setPnrResult(found ? PNR_MOCK[pnrInput.trim()] || { train: found.trainName, from: found.from, to: found.to, date: found.date, dep: found.dep, cls: found.cls, coach: found.coach, passengers: found.passengers } : 'not_found')
  }

  const checkTrack = () => {
    const num = trainNumInput.trim().replace(/\D/g, '')
    setTrackResult(TRAIN_STATUS[num] || 'not_found')
  }

  // Upcoming trips section — shared between mobile (top) and desktop (right column)
  const upcomingSection = UPCOMING_TRIPS.length > 0 && (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ color: t.text, fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>{tl('home.upcomingTrips')}</h2>
        <p style={{ color: t.textSec, fontSize: 12 }}>{tl('home.liveCountdown')}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {UPCOMING_TRIPS.map((trip) => {
          const cd = getCountdown(trip.date, trip.dep, now)
          return (
            <button key={trip.pnr} onClick={() => navigate('/bookings')} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              background: isDark ? t.surface : 'white',
              border: `1px solid ${cd.urgent ? t.accent + '40' : t.border}`,
              borderRadius: 14, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s', outline: 'none',
              boxShadow: isDark ? (cd.urgent ? '0 0 0 1px ' + t.accent + '20' : 'none') : t.shadow,
              width: '100%',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accentBorder}
              onMouseLeave={e => e.currentTarget.style.borderColor = cd.urgent ? t.accent + '40' : t.border}
            >
              <div style={{ width: 36, height: 36, borderRadius: 11, background: cd.urgent ? t.accentDim : (isDark ? 'rgba(255,255,255,0.04)' : t.bgAlt), border: `1px solid ${cd.urgent ? t.accentBorder : t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Train size={15} style={{ color: cd.urgent ? t.accent : t.textMuted }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ color: t.text, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.from.split('(')[0].trim()}</span>
                  <ArrowRight size={10} style={{ color: t.textMuted, flexShrink: 0 }} />
                  <span style={{ color: t.text, fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.to.split('(')[0].trim()}</span>
                </div>
                <div style={{ color: t.textMuted, fontSize: 11 }}>{fmtDate(trip.date)} · {trip.dep}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: cd.color, fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{cd.text}</div>
                <div style={{ color: t.textMuted, fontSize: 10, marginTop: 1 }}>{tl('home.remaining')}</div>
              </div>
            </button>
          )
        })}
      </div>
      <button onClick={() => navigate('/bookings')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%', marginTop: 10, padding: '8px', borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.textSec, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        {tl('home.viewAllBookings')} <ChevronRight size={12} />
      </button>
    </div>
  )

  const QUICK_TOOLS = [
    { icon: '🔍', label: tl('home.pnrStatus'), sub: tl('home.enterPnr'), color: '#6366f1', bg: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', onClick: () => { setShowPnr(true); setPnrResult(null); setPnrInput('') } },
    { icon: '📡', label: tl('home.trainRunning'), sub: tl('home.enterTrainNum'), color: '#10b981', bg: isDark ? 'rgba(52,211,153,0.08)' : '#ecfdf5', onClick: () => { setShowTrack(true); setTrackResult(null); setTrainNumInput('') } },
    { icon: '🗓️', label: tl('home.timetable'), sub: 'Timings & stops', color: '#f97316', bg: isDark ? 'rgba(249,115,22,0.1)' : '#fff7ed', onClick: () => navigate('/search?from=New Delhi (NDLS)&to=Mumbai CST (CSTM)&date=' + date + '&class=All Classes') },
    { icon: '❌', label: tl('home.refundStatus'), sub: 'E-cancellation', color: '#f87171', bg: isDark ? 'rgba(248,113,113,0.08)' : '#fef2f2', onClick: () => navigate('/bookings') },
    { icon: '🍱', label: 'Order Food', sub: 'E-Catering', color: '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', onClick: () => navigate('/bookings') },
    { icon: '💳', label: 'eWallet', sub: 'IRCTC Wallet', color: '#3b82f6', bg: isDark ? 'rgba(59,130,246,0.08)' : '#eff6ff', onClick: () => navigate('/profile') },
  ]

  const cardSt = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    border: `1px solid ${t.border}`,
    borderRadius: 18,
    padding: '20px 22px',
    boxShadow: isDark ? 'none' : t.shadow,
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg }}>
      <Navbar user={user} onLogout={onLogout} />

      {/* ── Hero ── */}
      <div style={{ position: 'relative', paddingTop: 48, paddingBottom: 40, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-40%', left: '20%', width: 700, height: 700, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(0,53,128,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '-30%', right: '15%', width: 600, height: 600, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px', textAlign: 'center', position: 'relative' }}>
          {/* Welcome strip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: t.textSec, fontSize: 14, fontWeight: 500 }}>
              Welcome back, <strong style={{ color: t.text }}>{user?.name?.split(' ')[0]}</strong> 👋
            </span>
            {user?.aadhaarVerified && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', fontSize: 10, fontWeight: 700 }}>
                <ShieldCheck size={10} /> AADHAAR VERIFIED
              </span>
            )}
          </div>

          <h1 style={{ fontSize: isMobile ? '2rem' : 'clamp(2.4rem, 6vw, 3.8rem)', fontWeight: 900, color: t.text, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 10 }}>
            Where are you<br />going next?
          </h1>
          <p style={{ color: t.textSec, fontSize: 14, marginBottom: 28 }}>Book 13,000+ daily trains across India</p>

          {/* ── Search form ── */}
          <form onSubmit={search}>
            <div style={{
              display: 'flex', alignItems: isMobile ? 'stretch' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
              border: `1px solid ${t.border}`,
              borderRadius: 20, padding: isMobile ? '12px' : '8px 8px 8px 16px',
              boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,53,128,0.08)',
              gap: isMobile ? 10 : 0,
            }}>
              {/* FROM */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '4px 0' : 0 }}>
                  <button type="button" onClick={handleGeolocate} title="Use my location" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0, color: geoLoading ? t.accent : t.accent }}>
                    {geoLoading ? <Navigation size={13} /> : <MapPin size={13} />}
                  </button>
                  <input value={from} onChange={e => { setFrom(e.target.value); setFromSugg(e.target.value.length > 1 ? filter(e.target.value) : []) }}
                    onBlur={() => setTimeout(() => setFromSugg([]), 150)} placeholder={tl('home.from')}
                    style={{ background: 'none', border: 'none', outline: 'none', color: t.text, fontSize: 14, fontWeight: 600, width: '100%', padding: '8px 0', minWidth: 0 }} />
                </div>
                {geoError && <div style={{ position: 'absolute', top: '100%', left: 0, fontSize: 11, color: t.textSec, background: t.surfaceSolid, padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 10, border: `1px solid ${t.border}` }}>{geoError}</div>}
                {fromSugg.length > 0 && <Dropdown items={fromSugg} onSelect={v => { setFrom(v); setFromSugg([]) }} t={t} />}
              </div>

              {/* Swap */}
              {!isMobile && <button type="button" onClick={swap} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${t.border}`, background: isDark ? 'rgba(255,255,255,0.05)' : t.pill, cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, margin: '0 6px', fontSize: 14 }}>⇄</button>}

              {/* Separator */}
              {!isMobile && <div style={{ width: 1, height: 20, background: t.border, margin: '0 2px' }} />}

              {/* TO */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '4px 0' : 0 }}>
                  <MapPin size={13} style={{ color: t.textMuted, flexShrink: 0 }} />
                  <input value={to} onChange={e => { setTo(e.target.value); setToSugg(e.target.value.length > 1 ? filter(e.target.value) : []) }}
                    onBlur={() => setTimeout(() => setToSugg([]), 150)} placeholder={tl('home.to')}
                    style={{ background: 'none', border: 'none', outline: 'none', color: t.text, fontSize: 14, fontWeight: 600, width: '100%', padding: '8px 0', minWidth: 0 }} />
                </div>
                {toSugg.length > 0 && <Dropdown items={toSugg} onSelect={v => { setTo(v); setToSugg([]) }} t={t} />}
              </div>

              {!isMobile && <div style={{ width: 1, height: 20, background: t.border, margin: '0 10px' }} />}

              {/* DATE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '4px 0' : 0 }}>
                <Calendar size={13} style={{ color: t.textMuted }} />
                <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)}
                  style={{ background: 'none', border: 'none', outline: 'none', color: t.textSec, fontSize: 14, fontWeight: 600, cursor: 'pointer', colorScheme: isDark ? 'dark' : 'light', width: isMobile ? '100%' : 'auto', maxWidth: 128 }} />
              </div>

              {!isMobile && <div style={{ width: 1, height: 20, background: t.border, margin: '0 10px' }} />}

              {/* CLASS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '4px 0' : 0 }}>
                <LayoutGrid size={13} style={{ color: t.textMuted }} />
                <select value={cls} onChange={e => setCls(e.target.value)} style={{ background: isMobile ? t.input : 'none', border: isMobile ? `1px solid ${t.inputBorder}` : 'none', borderRadius: isMobile ? 8 : 0, outline: 'none', color: t.textSec, fontSize: 14, fontWeight: 600, cursor: 'pointer', colorScheme: isDark ? 'dark' : 'light', padding: isMobile ? '4px 8px' : 0 }}>
                  {CLASSES.map(c => <option key={c} style={{ background: isDark ? '#111' : '#fff' }}>{c}</option>)}
                </select>
              </div>

              <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px 22px', borderRadius: 14, border: 'none', cursor: 'pointer', background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0, marginLeft: isMobile ? 0 : 8, whiteSpace: 'nowrap' }}>
                <Search size={15} /> {tl('home.searchBtn')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Quick Tools ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 3 : 6}, 1fr)`, gap: 8 }}>
          {QUICK_TOOLS.map(tool => (
            <button key={tool.label} onClick={tool.onClick} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 8px', borderRadius: 14, border: `1px solid ${t.border}`,
              background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: isDark ? 'none' : t.shadow,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = tool.color + '50'; e.currentTarget.style.background = tool.bg }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'white' }}
            >
              <span style={{ fontSize: isMobile ? 18 : 20 }}>{tool.icon}</span>
              <div style={{ color: t.text, fontWeight: 600, fontSize: isMobile ? 10 : 11, textAlign: 'center', lineHeight: 1.2 }}>{tool.label}</div>
              {!isMobile && <div style={{ color: t.textMuted, fontSize: 10 }}>{tool.sub}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content — two column ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 300px' : '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div>
          {/* Upcoming trips — mobile only (shown first) */}
          {isMobile && UPCOMING_TRIPS.length > 0 && (
            <div style={{ ...cardSt, marginBottom: 20 }}>
              {upcomingSection}
            </div>
          )}

          {/* Frequent routes */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ color: t.text, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>Your frequent routes</h2>
              <p style={{ color: t.textSec, fontSize: 12 }}>Based on your past bookings</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FREQUENT_ROUTES.map((r, i) => (
                <button key={i} onClick={() => navigate(`/search?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}&date=${date}&class=All Classes`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: isDark ? t.surface : 'white', border: `1px solid ${t.border}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s', outline: 'none', boxShadow: isDark ? 'none' : t.shadow }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = t.accentBorder}
                  onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: t.accentDim, border: `1px solid ${t.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Repeat size={15} style={{ color: t.accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ color: t.text, fontWeight: 700, fontSize: 14 }}>{r.from.split('(')[0].trim()}</span>
                      <ArrowRight size={12} style={{ color: t.textMuted }} />
                      <span style={{ color: t.text, fontWeight: 700, fontSize: 14 }}>{r.to.split('(')[0].trim()}</span>
                    </div>
                    <div style={{ color: t.textMuted, fontSize: 12 }}>Last traveled {r.lastTraveled} · {r.count}× booked</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: t.accent, fontWeight: 800, fontSize: 15 }}>₹{r.price}+</div>
                    <div style={{ color: t.textMuted, fontSize: 11, marginTop: 1 }}>onwards</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Festivals */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: t.text, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>{tl('home.festivals')}</h2>
              <p style={{ color: t.textSec, fontSize: 12 }}>{tl('home.festivalSubtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {FESTIVALS.map((d) => {
                const fomo = fomoBadge(d.seatsLeft, d.urgency)
                return (
                  <button key={d.id} onClick={() => navigate(`/search?from=${encodeURIComponent(d.from)}&to=${encodeURIComponent(d.to)}&date=${date}&class=All Classes`)}
                    style={{ background: isDark ? d.color + '0D' : 'white', border: `1px solid ${isDark ? d.color + '25' : t.cardBorder}`, borderRadius: 18, padding: '18px 20px', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.15s, border-color 0.15s', outline: 'none', boxShadow: isDark ? 'none' : t.shadow }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = d.color + '55' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = isDark ? d.color + '25' : t.cardBorder }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: d.color, background: d.color + '18', padding: '3px 8px', borderRadius: 20, border: `1px solid ${d.color}28` }}>{d.badge}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: fomo.color }}>{fomo.text}</span>
                    </div>
                    <div style={{ color: t.text, fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', marginBottom: 4 }}>{d.title}</div>
                    <div style={{ color: t.textSec, fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{d.tagline}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: t.textMuted, fontSize: 11 }}>{d.daysAway}</span>
                      <span style={{ color: d.color, fontWeight: 800, fontSize: 14 }}>₹{d.price}<span style={{ color: t.textMuted, fontSize: 10, fontWeight: 400 }}> onwards</span></span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Indian Railways: By the Numbers ── */}
          <div style={{ marginBottom: 28 }}>
            {/* Section header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 20, background: isDark ? 'rgba(249,115,22,0.1)' : '#fff7ed', border: isDark ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(249,115,22,0.25)', marginBottom: 10 }}>
                <span style={{ fontSize: 11 }}>🇮🇳</span>
                <span style={{ color: '#f97316', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ministry of Railways, Government of India</span>
              </div>
              <h2 style={{ color: t.text, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>{tl('home.irByNumbers')}</h2>
              <p style={{ color: t.textSec, fontSize: 12 }}>{tl('home.irSubtitle')}</p>
            </div>

            {/* Stats grid — 2-col on mobile, 4-col when space permits */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: isMobile ? 8 : 10 }}>
              {RAILWAY_FACTS.map((fact) => (
                <div key={fact.label} style={{
                  padding: isMobile ? '12px 10px 10px' : '16px 14px 14px',
                  background: isDark ? `${fact.color}0D` : 'white',
                  border: `1px solid ${isDark ? fact.color + '22' : t.border}`,
                  borderRadius: 14, textAlign: 'center',
                  boxShadow: isDark ? 'none' : t.shadow,
                  transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isDark ? `0 4px 20px ${fact.color}18` : '0 8px 24px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isDark ? 'none' : t.shadow }}
                >
                  <div style={{ fontSize: isMobile ? 20 : 24, lineHeight: 1, marginBottom: 6 }}>{fact.icon}</div>
                  <div style={{ color: fact.color, fontWeight: 900, fontSize: isMobile ? 13 : 16, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 3 }}>{fact.value}</div>
                  <div style={{ color: t.text, fontWeight: 700, fontSize: isMobile ? 9 : 10, marginBottom: isMobile ? 0 : 2, letterSpacing: '-0.01em' }}>{fact.label}</div>
                  {!isMobile && <div style={{ color: t.textMuted, fontSize: 9, lineHeight: 1.4 }}>{fact.sub}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Book with confidence */}
          <div style={{ padding: '20px 22px', background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: isDark ? 'none' : t.shadow }}>
            <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 14 }}>{tl('home.bookWithConfidence')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {[
                { icon: '🔒', label: 'ISO 27001:2013 Certified', sub: 'Bank-grade data security', color: '#34d399' },
                { icon: '💳', label: 'PCI DSS Compliant',        sub: 'Safe payment processing',  color: '#60a5fa' },
                { icon: '🛡️', label: 'Govt. Certified Portal',   sub: 'Official IRCTC platform',  color: '#f97316' },
                { icon: '↩️', label: 'Easy Cancellations',       sub: 'Quick refund processing',  color: '#a78bfa' },
              ].map(({ icon, label, sub, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ color: t.text, fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{label}</div>
                    <div style={{ color: t.textMuted, fontSize: 10, marginTop: 1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '9px 14px', borderRadius: 10, background: t.accentDim, border: `1px solid ${t.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: t.textSec, fontSize: 12 }}>Use code for 10% off</span>
              <span style={{ color: t.accent, fontSize: 13, fontWeight: 800, letterSpacing: '0.04em' }}>IRCTC10</span>
            </div>
          </div>
        </div>

        {/* ── Right column: Upcoming trips (desktop only) ── */}
        {!isMobile && UPCOMING_TRIPS.length > 0 && (
          <div style={{ position: 'sticky', top: 72 }}>
            <div style={{ ...cardSt }}>
              {upcomingSection}
            </div>

            {/* eWallet balance teaser */}
            <div style={{ marginTop: 12, padding: '14px 18px', background: isDark ? 'rgba(59,130,246,0.06)' : '#eff6ff', border: `1px solid ${isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.2)'}`, borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: t.textSec, fontSize: 12, fontWeight: 600 }}>💳 IRCTC eWallet</span>
                <span style={{ color: '#3b82f6', fontSize: 12, fontWeight: 700 }}>₹2,450</span>
              </div>
              <div style={{ color: t.textMuted, fontSize: 11 }}>Available balance · <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Add money</span></div>
            </div>

            {/* Insurance promo */}
            <div style={{ marginTop: 10, padding: '14px 18px', background: isDark ? 'rgba(52,211,153,0.05)' : '#ecfdf5', border: `1px solid ${isDark ? 'rgba(52,211,153,0.12)' : 'rgba(52,211,153,0.2)'}`, borderRadius: 14 }}>
              <div style={{ color: '#34d399', fontSize: 11, fontWeight: 700, marginBottom: 3 }}>🛡️ TRAVEL INSURANCE</div>
              <div style={{ color: t.textSec, fontSize: 12 }}>Cover your next trip for just <strong style={{ color: t.text }}>₹35/person</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* ── PNR Enquiry Modal ── */}
      {showPnr && (
        <Modal title={tl('home.pnrStatus')} onClose={() => setShowPnr(false)} t={t} isDark={isDark}>
          <p style={{ color: t.textSec, fontSize: 13, marginBottom: 16 }}>Enter your 10-digit PNR number to check booking status.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input value={pnrInput} onChange={e => setPnrInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={tl('home.enterPnr')} inputMode="numeric"
              style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14, outline: 'none' }} />
            <button onClick={checkPnr} disabled={pnrInput.length !== 10} style={{ padding: '11px 18px', borderRadius: 10, border: 'none', background: pnrInput.length === 10 ? t.accentGrad : (isDark ? 'rgba(255,255,255,0.06)' : t.pill), color: pnrInput.length === 10 ? 'white' : t.textMuted, fontWeight: 700, fontSize: 13, cursor: pnrInput.length === 10 ? 'pointer' : 'not-allowed' }}>
              {tl('home.checkStatus')}
            </button>
          </div>
          <div style={{ color: t.textMuted, fontSize: 11, marginBottom: 16 }}>
            Try: 4521873690 · 6789012345 · 3456789012
          </div>
          {pnrResult === 'not_found' && (
            <div style={{ padding: '12px', borderRadius: 10, background: isDark ? 'rgba(248,113,113,0.08)' : '#fef2f2', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', fontSize: 13 }}>
              ⚠️ PNR not found. Please check and try again.
            </div>
          )}
          {pnrResult && pnrResult !== 'not_found' && (
            <div style={{ background: isDark ? 'rgba(52,211,153,0.06)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ color: '#34d399', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }}>✓ CONFIRMED</div>
                <div style={{ color: t.textMuted, fontSize: 12 }}>PNR: {pnrInput}</div>
              </div>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{pnrResult.train}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: t.textSec, fontSize: 13 }}>{pnrResult.from?.split('(')[0].trim()}</span>
                <ArrowRight size={12} style={{ color: t.textMuted }} />
                <span style={{ color: t.textSec, fontSize: 13 }}>{pnrResult.to?.split('(')[0].trim()}</span>
              </div>
              <div style={{ color: t.textMuted, fontSize: 12, marginBottom: 12 }}>{typeof pnrResult.date === 'string' && pnrResult.date.length > 7 ? new Date(pnrResult.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : pnrResult.date} · {pnrResult.dep} · {pnrResult.cls} · {pnrResult.coach}</div>
              {pnrResult.passengers?.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${isDark ? 'rgba(52,211,153,0.1)' : 'rgba(52,211,153,0.15)'}` }}>
                  <span style={{ color: t.textSec, fontSize: 13 }}>{p.name || p}</span>
                  <span style={{ color: '#34d399', fontWeight: 700, fontSize: 12, padding: '2px 8px', borderRadius: 20, background: 'rgba(52,211,153,0.1)' }}>{p.berth || p.status || 'CNF'}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* ── Track Train Modal ── */}
      {showTrack && (
        <Modal title={tl('home.trainRunning')} onClose={() => setShowTrack(false)} t={t} isDark={isDark}>
          <p style={{ color: t.textSec, fontSize: 13, marginBottom: 16 }}>Enter train number to see live running status.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input value={trainNumInput} onChange={e => setTrainNumInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder={tl('home.enterTrainNum')} inputMode="numeric"
              style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: `1px solid ${t.inputBorder}`, background: t.input, color: t.text, fontSize: 14, outline: 'none' }} />
            <button onClick={checkTrack} disabled={trainNumInput.length < 4} style={{ padding: '11px 18px', borderRadius: 10, border: 'none', background: trainNumInput.length >= 4 ? t.accentGrad : (isDark ? 'rgba(255,255,255,0.06)' : t.pill), color: trainNumInput.length >= 4 ? 'white' : t.textMuted, fontWeight: 700, fontSize: 13, cursor: trainNumInput.length >= 4 ? 'pointer' : 'not-allowed' }}>
              {tl('home.trackTrain')}
            </button>
          </div>
          <div style={{ color: t.textMuted, fontSize: 11, marginBottom: 16 }}>Try: 12217 · 22691 · 12951 · 12301</div>
          {trackResult === 'not_found' && (
            <div style={{ padding: '12px', borderRadius: 10, background: isDark ? 'rgba(248,113,113,0.08)' : '#fef2f2', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', fontSize: 13 }}>
              ⚠️ Train not found. Please check the train number.
            </div>
          )}
          {trackResult && trackResult !== 'not_found' && (
            <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : t.bgAlt, border: `1px solid ${t.border}`, borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ color: t.text, fontWeight: 700, fontSize: 15 }}>{trackResult.name}</div>
                  <div style={{ color: t.textMuted, fontSize: 12 }}>#{trackResult.number}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: trackResult.delay === 'On time' ? '#34d399' : '#f97316' }}>{trackResult.status}</div>
              </div>
              {[
                ['📍 Current Station', trackResult.current],
                ['🚉 Platform', trackResult.platform],
                ['🔜 Next Station', trackResult.nextStation],
                ['🕐 ETA (Next)', trackResult.arrNext],
                ['⏱ Delay', trackResult.delay],
                ['🔄 Updated', trackResult.lastUpdated],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ color: t.textMuted, fontSize: 12 }}>{label}</span>
                  <span style={{ color: t.textSec, fontSize: 12, fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, onClose, t, isDark, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 201, background: isDark ? '#111118' : 'white', border: `1px solid ${t.border}`, borderRadius: 20, padding: '24px', width: '100%', maxWidth: 480, boxShadow: isDark ? '0 24px 80px rgba(0,0,0,0.8)' : '0 24px 80px rgba(0,53,128,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ color: t.text, fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 4, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Dropdown({ items, onSelect, t }) {
  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: -16, right: 0, background: t.surfaceSolid, border: `1px solid ${t.border}`, borderRadius: 14, overflow: 'hidden', zIndex: 100, boxShadow: t.shadow, minWidth: 220 }}>
      {items.map(s => (
        <div key={s} onClick={() => onSelect(s)} style={{ padding: '10px 16px', fontSize: 13, color: t.textSec, cursor: 'pointer', transition: 'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >{s}</div>
      ))}
    </div>
  )
}
