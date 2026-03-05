import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import { Train, ArrowRight, Calendar, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Download } from 'lucide-react'
import { MOCK_BOOKINGS } from '../data/mockData'

const TAB_FILTERS = ['All', 'Upcoming', 'Past', 'Cancelled']

const STATUS_CONFIG = {
  Confirmed: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', Icon: CheckCircle },
  Cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', Icon: XCircle },
  WaitList: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', Icon: Clock },
}

export default function BookingsPage({ user, onLogout }) {
  const { t, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = MOCK_BOOKINGS.filter(b => {
    if (activeTab === 'Upcoming') return b.upcoming && b.status !== 'Cancelled'
    if (activeTab === 'Past') return !b.upcoming && b.status !== 'Cancelled'
    if (activeTab === 'Cancelled') return b.status === 'Cancelled'
    return true
  })

  const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const card = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: isDark ? 'none' : t.shadow,
    marginBottom: 14,
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg }}>
      <Navbar user={user} onLogout={onLogout} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: t.text, fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 4 }}>My Bookings</h1>
          <p style={{ color: t.textSec, fontSize: 14 }}>{MOCK_BOOKINGS.length} bookings · {MOCK_BOOKINGS.filter(b => b.upcoming).length} upcoming</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: isDark ? 'rgba(255,255,255,0.03)' : t.bgAlt, borderRadius: 14, padding: 5, border: `1px solid ${t.border}` }}>
          {TAB_FILTERS.map(tab => {
            const count = tab === 'All' ? MOCK_BOOKINGS.length
              : tab === 'Upcoming' ? MOCK_BOOKINGS.filter(b => b.upcoming && b.status !== 'Cancelled').length
              : tab === 'Past' ? MOCK_BOOKINGS.filter(b => !b.upcoming && b.status !== 'Cancelled').length
              : MOCK_BOOKINGS.filter(b => b.status === 'Cancelled').length
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                background: activeTab === tab ? (isDark ? 'rgba(249,115,22,0.2)' : t.accent) : 'transparent',
                color: activeTab === tab ? (isDark ? '#f97316' : 'white') : t.textSec,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {tab}
                <span style={{
                  padding: '1px 7px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: activeTab === tab ? (isDark ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.25)') : (isDark ? 'rgba(255,255,255,0.06)' : t.pill),
                  color: activeTab === tab ? (isDark ? '#f97316' : 'white') : t.textMuted,
                }}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Booking cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: t.textMuted }}>
            <Train size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No bookings here</div>
            <div style={{ fontSize: 13 }}>Your {activeTab.toLowerCase()} bookings will appear here</div>
          </div>
        ) : (
          filtered.map(booking => {
            const { color, bg, border: bdr, Icon: StatusIcon } = STATUS_CONFIG[booking.status] || STATUS_CONFIG.Confirmed
            const isExpanded = expanded === booking.pnr

            return (
              <div key={booking.pnr} style={{ ...card, borderColor: isExpanded ? (isDark ? 'rgba(249,115,22,0.3)' : '#f97316' + '40') : t.border }}>

                {/* Card header — always visible */}
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      {/* Train name + status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Train size={13} style={{ color: 'white' }} />
                          </div>
                          <span style={{ color: t.text, fontWeight: 700, fontSize: 15 }}>{booking.trainName}</span>
                          <span style={{ color: t.textMuted, fontSize: 12 }}>#{booking.trainNum}</span>
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: bg, border: `1px solid ${bdr}` }}>
                          <StatusIcon size={10} style={{ color }} />
                          <span style={{ color, fontSize: 11, fontWeight: 700 }}>{booking.status}</span>
                        </div>
                        {booking.upcoming && booking.status !== 'Cancelled' && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: isDark ? 'rgba(249,115,22,0.12)' : '#fff7ed', border: '1px solid rgba(249,115,22,0.3)' }}>
                            <span style={{ color: '#f97316', fontSize: 11, fontWeight: 700 }}>UPCOMING</span>
                          </div>
                        )}
                      </div>

                      {/* Route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div>
                          <div style={{ color: t.text, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1 }}>{booking.dep}</div>
                          <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3 }}>{booking.from.split('(')[0].trim()}</div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 8px' }}>
                          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ flex: 1, height: 1, background: t.border }} />
                            <ArrowRight size={12} style={{ color: t.textMuted }} />
                            <div style={{ flex: 1, height: 1, background: t.border }} />
                          </div>
                          <div style={{ color: t.textMuted, fontSize: 11 }}>{booking.cls}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: t.text, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1 }}>{booking.arr}</div>
                          <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3 }}>{booking.to.split('(')[0].trim()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: 'right', marginLeft: 16 }}>
                      <div style={{ color: t.accent, fontWeight: 900, fontSize: 18 }}>₹{booking.amount}</div>
                      <div style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>{booking.passengers.length} pax</div>
                    </div>
                  </div>

                  {/* Date + PNR + expand */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: t.textMuted, fontSize: 12 }}>
                      <Calendar size={11} /> {fmtDate(booking.date)}
                    </div>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: t.border }} />
                    <div style={{ color: t.textMuted, fontSize: 12, fontFamily: 'monospace' }}>PNR: {booking.pnr}</div>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: t.border }} />
                    <div style={{ color: t.textMuted, fontSize: 12 }}>{booking.coach}</div>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : booking.pnr)}
                      style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: t.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '4px 0' }}
                    >
                      {isExpanded ? 'Hide details' : 'View details'}
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : t.bgAlt, borderTop: `1px solid ${t.border}`, padding: '18px 22px' }}>
                    {/* Passenger list */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ color: t.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Passengers</div>
                      {booking.passengers.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${t.border}` }}>
                          <div>
                            <span style={{ color: t.textSec, fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                            <span style={{ color: t.textMuted, fontSize: 12 }}> · {p.age}y · {p.gender}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: t.textMuted, fontSize: 12 }}>{p.berth}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: p.status === 'CNF' ? bg : 'rgba(251,191,36,0.1)', color: p.status === 'CNF' ? color : '#fbbf24', border: `1px solid ${p.status === 'CNF' ? bdr : 'rgba(251,191,36,0.25)'}` }}>
                              {p.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${t.border}`, background: 'transparent', color: t.textSec, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        <Download size={12} /> Download Ticket
                      </button>
                      {booking.upcoming && booking.status !== 'Cancelled' && (
                        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${t.red}30`, background: t.redDim, color: t.red, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
