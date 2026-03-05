import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Wifi, Coffee, GitBranch } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useWindowSize } from '../hooks/useWindowSize'

const TRAINS = [
  {
    id: '12951', name: 'Mumbai Rajdhani', dep: '16:25', arr: '08:15', depMins: 985,
    arrMins: 495 + 1440, duration: 950, type: 'Rajdhani',
    avail: { SL: { type: 'AVL', count: 125 }, '3A': { type: 'AVL', count: 42 }, '2A': { type: 'WL', count: 12 }, '1A': { type: 'AVL', count: 6 } },
    price: { SL: 745, '3A': 1960, '2A': 2810, '1A': 4680 },
    tatkalPrice: { SL: 220, '3A': 400, '2A': 500, '1A': 700 },
    rating: 4.7, tags: ['wifi', 'food'], days: 'Daily',
  },
  {
    id: '12301', name: 'Howrah Rajdhani', dep: '14:05', arr: '09:55', depMins: 845,
    arrMins: 595 + 1440, duration: 1190, type: 'Rajdhani',
    avail: { SL: { type: 'REGRET', count: 0 }, '3A': { type: 'AVL', count: 68 }, '2A': { type: 'AVL', count: 24 }, '1A': { type: 'WL', count: 3 } },
    price: { SL: 695, '3A': 1840, '2A': 2640, '1A': 4400 },
    tatkalPrice: { SL: 200, '3A': 380, '2A': 460, '1A': 650 },
    rating: 4.5, tags: ['food'], days: 'M W F S',
  },
  {
    id: '22691', name: 'Rajdhani Express', dep: '20:00', arr: '10:30', depMins: 1200,
    arrMins: 630 + 1440, duration: 870, type: 'Rajdhani',
    avail: { SL: { type: 'AVL', count: 210 }, '3A': { type: 'AVL', count: 96 }, '2A': { type: 'RAC', count: 8 }, '1A': { type: 'AVL', count: 10 } },
    price: { SL: 810, '3A': 2100, '2A': 3020, '1A': 5100 },
    tatkalPrice: { SL: 240, '3A': 440, '2A': 540, '1A': 760 },
    rating: 4.6, tags: ['wifi', 'food'], days: 'T T S S',
  },
  {
    id: '12627', name: 'Karnataka Express', dep: '21:30', arr: '09:45', depMins: 1290,
    arrMins: 585 + 1440, duration: 1335, type: 'Superfast',
    avail: { SL: { type: 'AVL', count: 340 }, '3A': { type: 'AVL', count: 112 }, '2A': { type: 'WL', count: 18 }, '1A': { type: 'NA', count: 0 } },
    price: { SL: 530, '3A': 1380, '2A': 2010, '1A': 0 },
    tatkalPrice: { SL: 175, '3A': 310, '2A': 410, '1A': 0 },
    rating: 4.2, tags: [], days: 'Daily',
  },
  {
    id: '16506', name: 'Gandhidham Exp', dep: '09:45', arr: '11:30', depMins: 585,
    arrMins: 690 + 1440, duration: 1545, type: 'Express',
    avail: { SL: { type: 'AVL', count: 56 }, '3A': { type: 'REGRET', count: 0 }, '2A': { type: 'RAC', count: 4 }, '1A': { type: 'NA', count: 0 } },
    price: { SL: 460, '3A': 0, '2A': 1710, '1A': 0 },
    tatkalPrice: { SL: 150, '3A': 0, '2A': 350, '1A': 0 },
    rating: 3.9, tags: [], days: 'M W S',
  },
  {
    id: '12217', name: 'Sampark Kranti', dep: '06:20', arr: '22:50', depMins: 380,
    arrMins: 1370, duration: 990, type: 'Superfast',
    avail: { SL: { type: 'AVL', count: 88 }, '3A': { type: 'WL', count: 5 }, '2A': { type: 'AVL', count: 14 }, '1A': { type: 'AVL', count: 4 } },
    price: { SL: 620, '3A': 1610, '2A': 2330, '1A': 3890 },
    tatkalPrice: { SL: 190, '3A': 360, '2A': 470, '1A': 590 },
    rating: 4.3, tags: [], days: 'T F S',
  },
]

const ALT_ROUTES = [
  {
    via: 'Kota Jn',
    leg1: { train: 'Rajdhani Express', dep: '16:00', arr: '22:30', price: 340, duration: '6h 30m', avail: 28 },
    leg2: { train: 'Avantika Express', dep: '23:15', arr: '10:20', price: 280, duration: '11h 5m', avail: 64 },
    totalPrice: 620, totalTime: '18h 20m',
    note: 'Transfer at Kota Jn · 45 min layover',
  },
  {
    via: 'Vadodara',
    leg1: { train: 'Gujarat Mail', dep: '22:50', arr: '14:10', price: 490, duration: '15h 20m', avail: 112 },
    leg2: { train: 'Intercity Express', dep: '15:30', arr: '19:00', price: 150, duration: '3h 30m', avail: 200 },
    totalPrice: 640, totalTime: '20h 10m',
    note: 'Transfer at Vadodara · 1h 20m layover',
  },
]

const TYPE_COLOR = { Rajdhani: '#818cf8', Superfast: '#a78bfa', Express: '#34d399' }

const AVAIL_CONFIG = {
  AVL:    { color: '#22c55e', label: 'AVL',    bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)' },
  WL:     { color: '#f59e0b', label: 'WL',     bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  RAC:    { color: '#3b82f6', label: 'RAC',    bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  REGRET: { color: '#ef4444', label: 'Regret', bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.2)' },
  NA:     { color: '#6b7280', label: 'N/A',    bg: 'transparent',           border: 'transparent' },
}

const QUOTAS = ['General', 'Tatkal', 'Premium Tatkal', 'Ladies', 'Senior Citizen']

const TIME_FILTERS = [
  { label: 'All',       icon: '',   min: -1,   max: 9999 },
  { label: 'Morning',   icon: '🌅', min: 360,  max: 720,  sub: '06–12' },
  { label: 'Afternoon', icon: '☀️', min: 720,  max: 1080, sub: '12–18' },
  { label: 'Evening',   icon: '🌆', min: 1080, max: 1440, sub: '18–24' },
  { label: 'Night',     icon: '🌙', min: 0,    max: 360,  sub: '00–06' },
]

function addDays(dateStr, n) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

export default function SearchResults({ user, onLogout }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { t, isDark } = useTheme()
  const { tl } = useLanguage()
  const { isMobile } = useWindowSize()

  const from = params.get('from') || 'New Delhi'
  const to   = params.get('to')   || 'Mumbai'
  const initialDate = params.get('date') || new Date().toISOString().split('T')[0]

  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [cls,         setCls]         = useState('All')
  const [quota,       setQuota]       = useState('General')
  const [sort,        setSort]        = useState('departure')
  const [timeFilter,  setTimeFilter]  = useState('All')

  const today = new Date().toISOString().split('T')[0]
  const isPastDate = selectedDate <= today

  // ---------- filtering / sorting ----------
  const trains = TRAINS
    .filter(tr => {
      // class filter
      const classOk = cls === 'All' || (tr.avail[cls] && tr.avail[cls].type !== 'NA')
      // time filter
      const tf = TIME_FILTERS.find(f => f.label === timeFilter)
      const timeOk = timeFilter === 'All' || (tf && tr.depMins >= tf.min && tr.depMins < tf.max)
      return classOk && timeOk
    })
    .sort((a, b) => {
      const refCls = cls === 'All' ? 'SL' : cls
      const effA = quota === 'Tatkal' ? (a.price[refCls] || 0) + (a.tatkalPrice[refCls] || 0)
                 : quota === 'Premium Tatkal' ? Math.round((a.price[refCls] || 0) * 1.4)
                 : quota === 'Senior Citizen' ? Math.round((a.price[refCls] || 0) * 0.6)
                 : (a.price[refCls] || 9999)
      const effB = quota === 'Tatkal' ? (b.price[refCls] || 0) + (b.tatkalPrice[refCls] || 0)
                 : quota === 'Premium Tatkal' ? Math.round((b.price[refCls] || 0) * 1.4)
                 : quota === 'Senior Citizen' ? Math.round((b.price[refCls] || 0) * 0.6)
                 : (b.price[refCls] || 9999)
      if (sort === 'departure') return a.depMins - b.depMins
      if (sort === 'price')     return effA - effB
      if (sort === 'duration')  return a.duration - b.duration
      if (sort === 'rating')    return b.rating - a.rating
      return 0
    })

  // smart picks
  const fastest  = [...TRAINS].sort((a, b) => a.duration - b.duration)[0]
  const cheapest = [...TRAINS].filter(tr => tr.price.SL > 0).sort((a, b) => a.price.SL - b.price.SL)[0]
  const topRated = [...TRAINS].sort((a, b) => b.rating - a.rating)[0]

  const fmtDate     = d => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const fmtDuration = m => `${Math.floor(m / 60)}h ${m % 60}m`

  const goBook = trainId =>
    navigate(`/booking?trainId=${trainId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${selectedDate}&class=${cls}`)

  return (
    <div style={{ minHeight: '100vh', background: t.bg }}>
      <Navbar user={user} onLogout={onLogout} />

      {/* ── Search summary + date navigation bar ── */}
      <div style={{
        borderBottom: `1px solid ${t.border}`,
        padding: isMobile ? '10px 14px' : '12px 24px',
        background: isDark ? 'rgba(255,255,255,0.01)' : 'white',
        position: 'sticky', top: 56, zIndex: 10,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
            <span style={{ color: t.text, fontWeight: 700, fontSize: isMobile ? 14 : 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {from.split('(')[0].trim()}
            </span>
            <ArrowRight size={13} style={{ color: t.textMuted, flexShrink: 0 }} />
            <span style={{ color: t.text, fontWeight: 700, fontSize: isMobile ? 14 : 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {to.split('(')[0].trim()}
            </span>
          </div>

          {/* Date navigation */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: isDark ? 'rgba(255,255,255,0.04)' : t.bgAlt,
            border: `1px solid ${t.border}`, borderRadius: 10, padding: 3,
          }}>
            <button
              onClick={() => !isPastDate && setSelectedDate(addDays(selectedDate, -1))}
              disabled={isPastDate}
              style={{
                width: 28, height: 28, borderRadius: 7, border: 'none', cursor: isPastDate ? 'not-allowed' : 'pointer',
                background: 'transparent', color: isPastDate ? t.textMuted : t.textSec,
                display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isPastDate ? 0.35 : 1,
              }}
            >
              <ChevronLeft size={13} />
            </button>
            <span style={{
              color: t.text, fontSize: 12, fontWeight: 700, padding: '0 10px',
              minWidth: isMobile ? 78 : 104, textAlign: 'center', whiteSpace: 'nowrap',
            }}>
              {fmtDate(selectedDate)}
            </span>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              style={{
                width: 28, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: 'transparent', color: t.textSec,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>

          <button onClick={() => navigate('/home')} style={{
            padding: '6px 14px', borderRadius: 8, border: `1px solid ${t.border}`,
            background: 'transparent', color: t.textSec, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {tl('search.modifySearch')}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: isMobile ? '16px 12px 60px' : '24px 24px 60px' }}>

        {/* ── Smart Picks ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{tl('search.smartPicks')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: tl('search.fastest'),   icon: '⚡', train: fastest,  sub: fmtDuration(fastest.duration), accent: '#f97316' },
              { label: tl('search.cheapest'),  icon: '💰', train: cheapest, sub: `₹${cheapest.price.SL}`,       accent: '#10b981' },
              { label: tl('search.topRated'),  icon: '⭐', train: topRated, sub: `${topRated.rating}/5`,        accent: '#6366f1' },
            ].map(({ label, icon, train, sub, accent }) => (
              <button key={label} onClick={() => goBook(train.id)} style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 16, padding: isMobile ? '10px 12px' : '14px 16px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'border-color 0.15s', boxShadow: isDark ? 'none' : t.shadow,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = accent + '50'}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.cardBorder}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <span style={{ fontSize: 11 }}>{icon}</span>
                  <span style={{ color: accent, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                </div>
                <div style={{ color: t.text, fontWeight: 700, fontSize: isMobile ? 11 : 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {train.name}
                </div>
                <div style={{ color: t.textSec, fontSize: isMobile ? 11 : 12 }}>{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Quota selector ── */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            overflowX: 'auto', paddingBottom: 4,
          }}>
            <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>QUOTA</span>
            {QUOTAS.map(q => (
              <button key={q} onClick={() => setQuota(q)} style={{
                padding: '5px 13px', borderRadius: 20, cursor: 'pointer',
                border: quota === q ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
                background: quota === q ? t.accentDim : 'transparent',
                color: quota === q ? t.accent : t.textSec,
                fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.15s',
              }}>{q}</button>
            ))}
          </div>
          {/* Quota context note */}
          {(quota === 'Tatkal' || quota === 'Premium Tatkal') && (
            <div style={{ marginTop: 8, padding: '7px 12px', borderRadius: 8, background: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>⚡</span>
              <span style={{ color: '#d97706', fontSize: 12, fontWeight: 600 }}>
                {quota} quota opens 1 day before journey. Surcharge added to base fare.
              </span>
            </div>
          )}
          {quota === 'Ladies' && (
            <div style={{ marginTop: 8, padding: '7px 12px', borderRadius: 8, background: isDark ? 'rgba(236,72,153,0.08)' : '#fdf2f8', border: '1px solid rgba(236,72,153,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>👩</span>
              <span style={{ color: '#be185d', fontSize: 12, fontWeight: 600 }}>Reserved for women passengers only. Male passengers not eligible.</span>
            </div>
          )}
          {quota === 'Senior Citizen' && (
            <div style={{ marginTop: 8, padding: '7px 12px', borderRadius: 8, background: isDark ? 'rgba(99,102,241,0.08)' : '#eef2ff', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>🧓</span>
              <span style={{ color: '#4338ca', fontSize: 12, fontWeight: 600 }}>40% concession on base fare for men 60+, women 58+.</span>
            </div>
          )}
        </div>

        {/* ── Class + Sort filters ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>CLASS</span>
          {['All', 'SL', '3A', '2A', '1A'].map(c => (
            <button key={c} onClick={() => setCls(c)} style={{
              padding: '5px 13px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: cls === c ? t.accentGrad : isDark ? 'rgba(255,255,255,0.05)' : t.pill,
              color: cls === c ? 'white' : t.textSec,
              transition: 'all 0.15s',
            }}>{c}</button>
          ))}

          <div style={{ width: 1, height: 16, background: t.border, margin: '0 2px' }} />

          <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>SORT</span>
          {[['departure', tl('search.earliest')], ['duration', tl('search.fastest')], ['price', tl('search.cheapest')], ['rating', tl('search.rating')]].map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)} style={{
              padding: '5px 13px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              background: sort === v ? (isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff') : (isDark ? 'rgba(255,255,255,0.03)' : t.pill),
              color: sort === v ? '#818cf8' : t.textSec,
              transition: 'all 0.15s',
            }}>{l}</button>
          ))}

          <span style={{ marginLeft: 'auto', color: t.textMuted, fontSize: 12, whiteSpace: 'nowrap' }}>{trains.length} trains</span>
        </div>

        {/* ── Departure time filter ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>DEPARTS</span>
          {TIME_FILTERS.map(({ label, icon, sub }) => (
            <button key={label} onClick={() => setTimeFilter(label)} style={{
              padding: '5px 13px', borderRadius: 20, cursor: 'pointer',
              border: timeFilter === label ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
              background: timeFilter === label ? t.accentDim : 'transparent',
              color: timeFilter === label ? t.accent : t.textSec,
              fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}>
              {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
              {label}
              {sub && <span style={{ color: timeFilter === label ? t.accent : t.textMuted, fontSize: 10, opacity: 0.8 }}>{sub}</span>}
            </button>
          ))}
        </div>

        {/* ── Train list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {trains.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: t.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>🚂</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: t.textSec }}>{tl('search.noTrains')}</div>
              <div style={{ fontSize: 13 }}>{tl('search.tryDifferentFilters')}</div>
            </div>
          ) : (
            trains.map(tr => (
              <TrainCard
                key={tr.id} train={tr} cls={cls} quota={quota}
                fmtDuration={fmtDuration} onBook={() => goBook(tr.id)}
                t={t} isDark={isDark} isMobile={isMobile}
              />
            ))
          )}
        </div>

        {/* ── Split journey alternatives ── */}
        <div style={{ marginTop: 48 }}>
          <div style={{
            padding: '16px 20px', marginBottom: 14,
            background: isDark ? 'rgba(99,102,241,0.06)' : '#eef2ff',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.2)'}`,
            borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GitBranch size={16} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Try a split journey</div>
              <div style={{ color: t.textSec, fontSize: 13, lineHeight: 1.5 }}>
                No direct seats? These 2-leg routes cover the same journey — often with more availability and sometimes at lower cost.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ALT_ROUTES.map((r, i) => (
              <AltRouteCard key={i} route={r} from={from.split('(')[0].trim()} to={to.split('(')[0].trim()} t={t} isDark={isDark} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Train Card ──────────────────────────────────────────────────────────────
function TrainCard({ train, cls, quota, fmtDuration, onBook, t, isDark, isMobile }) {
  const [expanded, setExpanded] = useState(false)
  const { tl } = useLanguage()
  const typeColor = TYPE_COLOR[train.type] || '#34d399'

  // classes to display (exclude NA)
  const displayCls = cls === 'All'
    ? Object.entries(train.price).filter(([c, p]) => p > 0 && train.avail[c] && train.avail[c].type !== 'NA')
    : (train.price[cls] && train.avail[cls] && train.avail[cls].type !== 'NA' ? [[cls, train.price[cls]]] : [])

  const getEffPrice = (c, base) => {
    if (quota === 'Tatkal')         return base + (train.tatkalPrice[c] || 0)
    if (quota === 'Premium Tatkal') return Math.round(base * 1.4)
    if (quota === 'Senior Citizen') return Math.round(base * 0.6)
    return base
  }

  // cheapest bookable price (exclude REGRET)
  const bookableEntries = displayCls.filter(([c]) => train.avail[c] && train.avail[c].type !== 'REGRET')
  const cheapestPrice = bookableEntries.length
    ? Math.min(...bookableEntries.map(([c, p]) => getEffPrice(c, p)))
    : Math.min(...displayCls.map(([c, p]) => getEffPrice(c, p)))

  return (
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.15s',
      boxShadow: isDark ? 'none' : t.shadow,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = t.borderHover}
      onMouseLeave={e => e.currentTarget.style.borderColor = t.cardBorder}
    >
      <div style={{ padding: isMobile ? '14px 16px' : '20px 24px' }}>

        {/* Row 1: name + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ color: t.text, fontWeight: 700, fontSize: isMobile ? 14 : 16 }}>{train.name}</span>
              <span style={{ fontSize: 11, color: t.textMuted }}>#{train.id}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: typeColor, background: typeColor + '18' }}>
                {train.type}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {train.tags.includes('wifi') && (
                <span style={{ color: t.textMuted, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Wifi size={10} /> {tl('search.wifi')}
                </span>
              )}
              {train.tags.includes('food') && (
                <span style={{ color: t.textMuted, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Coffee size={10} /> {tl('search.pantry')}
                </span>
              )}
              <span style={{ color: t.textMuted, fontSize: 11 }}>{train.days}</span>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 8, flexShrink: 0,
            background: isDark ? 'rgba(251,191,36,0.08)' : '#fffbeb',
            border: `1px solid ${isDark ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.3)'}`,
          }}>
            <span style={{ fontSize: 11 }}>⭐</span>
            <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>{train.rating}</span>
          </div>
        </div>

        {/* Row 2: Timeline */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ color: t.text, fontWeight: 800, fontSize: isMobile ? 22 : 26, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {train.dep}
            </div>
            <div style={{ color: t.textMuted, fontSize: 11, marginTop: 3 }}>{tl('search.departure')}</div>
          </div>
          <div style={{ flex: 1, margin: '0 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{ color: t.textSec, fontSize: 11 }}>{fmtDuration(train.duration)}</span>
            <div style={{ width: '100%', height: 2, background: t.border, borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: t.accent }} />
              <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: t.accent }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: t.text, fontWeight: 800, fontSize: isMobile ? 22 : 26, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {train.arr}
            </div>
            <div style={{ color: t.textMuted, fontSize: 11, marginTop: 3 }}>{tl('search.arrival')}</div>
          </div>
        </div>

        {/* Row 3: Class chips + Book button */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 8, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
            {displayCls.map(([c, basePrice]) => {
              const avInfo = train.avail[c] || { type: 'NA', count: 0 }
              const { type, count } = avInfo
              if (type === 'NA') return null
              const cfg = AVAIL_CONFIG[type] || AVAIL_CONFIG.NA
              const effPrice = getEffPrice(c, basePrice)
              const surcharge = quota === 'Tatkal' ? train.tatkalPrice[c]
                              : quota === 'Premium Tatkal' ? Math.round(basePrice * 0.4)
                              : quota === 'Senior Citizen' ? -Math.round(basePrice * 0.4)
                              : 0

              return (
                <div key={c} style={{
                  padding: '7px 11px', borderRadius: 10, minWidth: 56,
                  background: type === 'REGRET' ? 'transparent' : isDark ? 'rgba(255,255,255,0.04)' : t.bgAlt,
                  border: `1px solid ${type === 'REGRET' ? t.border : t.cardBorder}`,
                  opacity: type === 'REGRET' ? 0.55 : 1,
                }}>
                  <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, marginBottom: 2 }}>{c}</div>
                  <div style={{ color: type === 'REGRET' ? t.textMuted : t.text, fontWeight: 700, fontSize: isMobile ? 12 : 14 }}>
                    {type === 'REGRET' ? '—' : `₹${effPrice}`}
                  </div>
                  {/* AVL / WL / RAC badge */}
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 8,
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                    }}>
                      {cfg.label}{type !== 'REGRET' && count > 0 ? ` ${count}` : ''}
                    </span>
                  </div>
                  {/* Quota surcharge / discount label */}
                  {surcharge !== 0 && type !== 'REGRET' && (
                    <div style={{ fontSize: 9, marginTop: 2, color: surcharge > 0 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>
                      {surcharge > 0 ? `+₹${surcharge}` : `-₹${Math.abs(surcharge)}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: 6, flexShrink: 0 }}>
            <button onClick={onBook} style={{
              padding: isMobile ? '9px 16px' : '10px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: isMobile ? 13 : 14,
              whiteSpace: 'nowrap', transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {tl('search.bookNow')} · ₹{cheapestPrice}+
            </button>
            <button onClick={() => setExpanded(!expanded)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: t.textMuted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
              padding: '2px 0',
            }}>
              {expanded ? tl('search.hide') : tl('search.runsDays')}
              <ChevronDown size={11} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Schedule panel ── */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${t.border}`, padding: isMobile ? '14px 16px' : '16px 24px', background: isDark ? 'rgba(255,255,255,0.01)' : t.bgAlt }}>
          <p style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>{tl('search.route')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['New Delhi', '--', train.dep, 'Day 1'],
              ['Mathura Jn', '18:20', '18:25', 'Day 1'],
              ['Kota Jn', '22:00', '22:10', 'Day 1'],
              ['Vadodara', '05:15', '05:25', 'Day 2'],
              ['Destination', train.arr, '--', 'Day 2'],
            ].map(([s, a, d, day], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: (i === 0 || i === 4) ? t.accent : t.border, flexShrink: 0 }} />
                <span style={{ color: t.textSec, fontSize: isMobile ? 12 : 13, flex: 1 }}>{s}</span>
                <span style={{ color: t.textMuted, fontSize: 12, width: isMobile ? 36 : 44, textAlign: 'right' }}>{a}</span>
                <span style={{ color: t.textMuted, fontSize: 12, width: isMobile ? 36 : 44, textAlign: 'right' }}>{d}</span>
                <span style={{ color: t.textMuted, fontSize: 11, width: isMobile ? 30 : 36, textAlign: 'right' }}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Alt Route Card ──────────────────────────────────────────────────────────
function AltRouteCard({ route, from, to, t, isDark, isMobile }) {
  const legs = [
    { num: '1', leg: route.leg1, start: from, end: route.via, accent: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
    { num: '2', leg: route.leg2, start: route.via, end: to,   accent: '#818cf8', bg: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', border: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.25)' },
  ]

  return (
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.02)' : 'white',
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 18, padding: isMobile ? '16px' : '20px 24px',
      boxShadow: isDark ? 'none' : t.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', padding: '3px 10px', borderRadius: 20, border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.25)'}` }}>
            via {route.via}
          </span>
          <span style={{ color: t.textMuted, fontSize: 12 }}>{route.note}</span>
        </div>
        <div>
          <span style={{ color: t.accent, fontWeight: 800, fontSize: 18 }}>₹{route.totalPrice}</span>
          <span style={{ color: t.textMuted, fontSize: 12 }}> · {route.totalTime}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {legs.map(({ num, leg, start, end, accent, bg, border }, i) => (
          <div key={i}>
            {i === 1 && (
              <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 16, marginBottom: 6 }}>
                <div style={{ width: 1, height: 14, background: t.border, marginLeft: 10 }} />
                <span style={{ color: t.textMuted, fontSize: 11, marginLeft: 8 }}>Change trains at {route.via}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.03)' : t.bgAlt, border: `1px solid ${t.border}` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                {num}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: t.text, fontWeight: 600, fontSize: 13 }}>{leg.train}</div>
                <div style={{ color: t.textMuted, fontSize: 12 }}>{start} → {end} · {leg.duration}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 13 }}>{leg.dep} – {leg.arr}</div>
                <div style={{ color: t.green, fontSize: 12 }}>{leg.avail} seats · ₹{leg.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
