import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import Navbar from '../components/Navbar'
import {
  ShieldCheck, Edit3, Train, MapPin, Calendar, User, Mail, Phone,
  CreditCard, Bell, ChevronRight, Check, X, AlertCircle, RefreshCw,
  Receipt, ArrowDownCircle, FileText,
} from 'lucide-react'
import { MOCK_BOOKINGS } from '../data/mockData'
import { useWindowSize } from '../hooks/useWindowSize'

// ── Saved travellers ───────────────────────────────────────────────────────
const SAVED_TRAVELERS = [
  { name: 'Adarsh Mohan',  age: 28, gender: 'M', relation: 'Self'   },
  { name: 'Shivam Chandra', age: 26, gender: 'M', relation: 'Friend' },
  { name: 'Ketan Kapoor',   age: 30, gender: 'M', relation: 'Friend' },
]

// ── Mock transactions ──────────────────────────────────────────────────────
const MOCK_TRANSACTIONS = [
  {
    id: 'TXN8823', type: 'booked',
    pnr: '4521873690', train: 'Sampark Kranti', num: '12217',
    from: 'NDLS', to: 'MFP', travelDate: '7 Mar 2026', txnDate: '3 Mar 2026',
    amount: 1485, payMethod: 'UPI', cls: 'SL', passengers: 2,
  },
  {
    id: 'TXN7712', type: 'booked',
    pnr: '7645291083', train: 'Mumbai Rajdhani', num: '12951',
    from: 'NDLS', to: 'MMCT', travelDate: '14 Feb 2026', txnDate: '10 Feb 2026',
    amount: 3920, payMethod: 'Net Banking', cls: '3A', passengers: 2,
  },
  {
    id: 'TXN6601', type: 'booked',
    pnr: '2938472610', train: 'Karnataka Express', num: '12627',
    from: 'NDLS', to: 'SBC', travelDate: '10 Jan 2026', txnDate: '6 Jan 2026',
    amount: 1060, payMethod: 'UPI', cls: 'SL', passengers: 2,
  },
  {
    id: 'TXN8419', type: 'cancelled',
    pnr: '9023847561', train: 'Howrah Rajdhani', num: '12301',
    from: 'NDLS', to: 'HWH', travelDate: '25 Jan 2026', txnDate: '15 Jan 2026',
    cancelledOn: '20 Jan 2026', amount: 2640, refundAmt: 2100,
    refundStatus: 'Processed', payMethod: 'UPI', cls: '2A', passengers: 1,
  },
  {
    id: 'TXN5523', type: 'failed',
    train: 'Rajdhani Express', num: '22691',
    from: 'NDLS', to: 'MMCT', travelDate: '5 Dec 2025', txnDate: '1 Dec 2025',
    amount: 5100, reason: 'Payment gateway timeout. Amount not deducted.',
    payMethod: 'Credit Card', cls: '1A', passengers: 1,
  },
  {
    id: 'TXN4412', type: 'failed',
    train: 'Sampark Kranti', num: '12217',
    from: 'NDLS', to: 'MFP', travelDate: '20 Nov 2025', txnDate: '16 Nov 2025',
    amount: 745, reason: 'Bank server error. Amount refunded within 3–5 business days.',
    payMethod: 'Debit Card', cls: 'SL', passengers: 1,
  },
  {
    id: 'TXN8419-R', type: 'refund',
    pnr: '9023847561', train: 'Howrah Rajdhani',
    from: 'NDLS', to: 'HWH', travelDate: '25 Jan 2026',
    refundAmt: 2100, refundDate: '23 Jan 2026',
    refundTo: 'UPI – adarsh@gpay', status: 'Credited',
  },
  {
    id: 'TXN4412-R', type: 'refund',
    pnr: 'N/A', train: 'Sampark Kranti',
    from: 'NDLS', to: 'MFP', travelDate: '20 Nov 2025',
    refundAmt: 745, refundDate: '19 Nov 2025',
    refundTo: 'Debit Card ****4521', status: 'Credited',
  },
]

const MOCK_TDR = [
  {
    id: 'TDR001', pnr: '3847561029', train: 'Rajdhani Express (22691)',
    from: 'NDLS', to: 'MMCT', travelDate: '15 Oct 2025',
    filedOn: '16 Oct 2025', reason: 'Train cancelled by Railways',
    claimedAmt: 5100, refundAmt: 5100, status: 'Approved', processedOn: '20 Oct 2025',
  },
  {
    id: 'TDR002', pnr: '6728394050', train: 'Karnataka Express (12627)',
    from: 'NDLS', to: 'SBC', travelDate: '5 Aug 2025',
    filedOn: '7 Aug 2025', reason: 'Train ran late by more than 3 hours',
    claimedAmt: 1380, refundAmt: null, status: 'Under Review', processedOn: '-',
  },
]

const TXN_TABS = ['All', 'Booked', 'Cancelled', 'Failed', 'Refunds', 'TDR']

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, t, isDark }) {
  return (
    <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'white', border: `1px solid ${t.border}`, borderRadius: 16, padding: '16px 18px', boxShadow: isDark ? 'none' : t.shadow }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Icon size={15} style={{ color }} />
      </div>
      <div style={{ color: t.text, fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ color: t.textMuted, fontSize: 12, marginTop: 2 }}>{label}</div>
    </div>
  )
}

// ── Status badge ───────────────────────────────────────────────────────────
function Badge({ children, color = '#22c55e', bg }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20,
      background: bg || color + '18', color,
      border: `1px solid ${color}30`, whiteSpace: 'nowrap',
      letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  )
}

// ── Transaction card ───────────────────────────────────────────────────────
function TxnCard({ tx, t, isDark }) {
  const [open, setOpen] = useState(false)

  if (tx.type === 'booked') {
    return (
      <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 18px', boxShadow: isDark ? 'none' : t.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ color: t.textMuted, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>{tx.id}</span>
              <span style={{ color: t.textMuted, fontSize: 11 }}>·</span>
              <span style={{ color: t.textMuted, fontSize: 11 }}>{tx.txnDate}</span>
              <Badge color="#22c55e">SUCCESS</Badge>
            </div>
            <div style={{ color: t.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
              {tx.train} ({tx.num})
            </div>
            <div style={{ color: t.textSec, fontSize: 13 }}>
              {tx.from} → {tx.to} · {tx.cls} · {tx.passengers} pax · Travel: {tx.travelDate}
            </div>
            <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3 }}>PNR: {tx.pnr} · {tx.payMethod}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: t.accent, fontWeight: 800, fontSize: 18 }}>₹{tx.amount.toLocaleString()}</div>
          </div>
        </div>
      </div>
    )
  }

  if (tx.type === 'cancelled') {
    return (
      <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 18px', boxShadow: isDark ? 'none' : t.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ color: t.textMuted, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>{tx.id}</span>
              <Badge color="#ef4444">CANCELLED</Badge>
              <Badge color="#22c55e">REFUNDED</Badge>
            </div>
            <div style={{ color: t.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{tx.train} ({tx.num})</div>
            <div style={{ color: t.textSec, fontSize: 13 }}>{tx.from} → {tx.to} · {tx.cls} · Travel: {tx.travelDate}</div>
            <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3 }}>
              PNR: {tx.pnr} · Cancelled on {tx.cancelledOn} · {tx.payMethod}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: t.textMuted, fontSize: 13, textDecoration: 'line-through' }}>₹{tx.amount.toLocaleString()}</div>
            <div style={{ color: '#22c55e', fontWeight: 800, fontSize: 18 }}>↩ ₹{tx.refundAmt.toLocaleString()}</div>
            <div style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>Refunded</div>
          </div>
        </div>
      </div>
    )
  }

  if (tx.type === 'failed') {
    return (
      <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 14, padding: '14px 18px', boxShadow: isDark ? 'none' : t.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ color: t.textMuted, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>{tx.id}</span>
              <span style={{ color: t.textMuted, fontSize: 11 }}>· {tx.txnDate}</span>
              <Badge color="#ef4444">FAILED</Badge>
            </div>
            <div style={{ color: t.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{tx.train} ({tx.num})</div>
            <div style={{ color: t.textSec, fontSize: 13 }}>{tx.from} → {tx.to} · {tx.cls} · Travel: {tx.travelDate}</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginTop: 8, padding: '8px 10px', borderRadius: 8, background: isDark ? 'rgba(239,68,68,0.06)' : '#fef2f2', border: '1px solid rgba(239,68,68,0.15)' }}>
              <AlertCircle size={12} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
              <span style={{ color: '#ef4444', fontSize: 12 }}>{tx.reason}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: t.textMuted, fontSize: 18, fontWeight: 800 }}>₹{tx.amount.toLocaleString()}</div>
            <div style={{ color: '#ef4444', fontSize: 11, marginTop: 2 }}>{tx.payMethod}</div>
          </div>
        </div>
      </div>
    )
  }

  if (tx.type === 'refund') {
    return (
      <div style={{ background: isDark ? 'rgba(34,197,94,0.04)' : '#f0fdf4', border: `1px solid rgba(34,197,94,0.25)`, borderRadius: 14, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ color: t.textMuted, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>{tx.id}</span>
              <Badge color="#22c55e">CREDITED</Badge>
            </div>
            <div style={{ color: t.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{tx.train}</div>
            <div style={{ color: t.textSec, fontSize: 13 }}>{tx.from} → {tx.to} · Travel: {tx.travelDate}</div>
            <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3 }}>
              Refund date: {tx.refundDate} · To: {tx.refundTo}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: '#22c55e', fontWeight: 900, fontSize: 20 }}>+₹{tx.refundAmt.toLocaleString()}</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ── TDR card ───────────────────────────────────────────────────────────────
function TdrCard({ tdr, t, isDark }) {
  const approved = tdr.status === 'Approved'
  return (
    <div style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'white', border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 18px', boxShadow: isDark ? 'none' : t.shadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ color: t.textMuted, fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}>{tdr.id}</span>
            <Badge color={approved ? '#22c55e' : '#f59e0b'}>{tdr.status.toUpperCase()}</Badge>
          </div>
          <div style={{ color: t.text, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{tdr.train}</div>
          <div style={{ color: t.textSec, fontSize: 13 }}>{tdr.from} → {tdr.to} · Travel: {tdr.travelDate}</div>
          <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3 }}>PNR: {tdr.pnr} · Filed: {tdr.filedOn}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ color: t.textSec, fontSize: 12, marginBottom: 2 }}>Claimed</div>
          <div style={{ color: t.text, fontWeight: 700, fontSize: 16 }}>₹{tdr.claimedAmt.toLocaleString()}</div>
          {approved && <div style={{ color: '#22c55e', fontSize: 12, marginTop: 2 }}>✓ Refunded ₹{tdr.refundAmt.toLocaleString()}</div>}
        </div>
      </div>
      <div style={{ padding: '8px 12px', borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.03)' : t.bgAlt, border: `1px solid ${t.border}` }}>
        <span style={{ color: t.textMuted, fontSize: 12 }}>Reason: </span>
        <span style={{ color: t.textSec, fontSize: 12 }}>{tdr.reason}</span>
      </div>
      {approved && (
        <div style={{ marginTop: 8, color: t.textMuted, fontSize: 12 }}>
          ✓ Processed on {tdr.processedOn}
        </div>
      )}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function ProfilePage({ user, onLogout }) {
  const { t, isDark } = useTheme()
  const { tl } = useLanguage()
  const { isMobile }  = useWindowSize()

  // Page tabs
  const [activeTab, setActiveTab] = useState('profile')

  // Edit profile
  const [editMode,  setEditMode]  = useState(false)
  const [savedMsg,  setSavedMsg]  = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '9876543210',
    dob: '1998-04-15',
    address: 'Muzaffarpur, Bihar',
  })
  const [editProfile, setEditProfile] = useState({ ...profile })

  // Aadhaar linking
  const [aadhaarLinked,  setAadhaarLinked]  = useState(user?.aadhaarVerified || false)
  const [aadhaarNum,     setAadhaarNum]     = useState('')
  const [aadhaarOtp,     setAadhaarOtp]     = useState('')
  const [aadhaarStep,    setAadhaarStep]    = useState(0) // 0=input, 1=otp
  const [aadhaarError,   setAadhaarError]   = useState('')

  // Transactions
  const [txnTab, setTxnTab] = useState('All')

  // Stats
  const totalBookings = MOCK_BOOKINGS.length
  const upcomingCount = MOCK_BOOKINGS.filter(b => b.upcoming).length
  const totalSpent    = MOCK_BOOKINGS.reduce((s, b) => s + b.amount, 0)
  const destinations  = new Set(MOCK_BOOKINGS.map(b => b.to.split('(')[0].trim())).size

  const handleSave = () => {
    setProfile({ ...editProfile })
    setEditMode(false)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2500)
  }

  const handleSendOtp = () => {
    const clean = aadhaarNum.replace(/\s/g, '')
    if (clean.length !== 12 || !/^\d+$/.test(clean)) {
      setAadhaarError('Enter a valid 12-digit Aadhaar number')
      return
    }
    setAadhaarError('')
    setAadhaarStep(1)
  }

  const handleVerifyOtp = () => {
    if (aadhaarOtp === '123456') {
      setAadhaarLinked(true)
      setAadhaarStep(0)
      setAadhaarNum('')
      setAadhaarOtp('')
      setAadhaarError('')
    } else {
      setAadhaarError('Invalid OTP. Use 123456 for this demo.')
    }
  }

  const formatAadhaar = v => {
    const d = v.replace(/\D/g, '').slice(0, 12)
    return d.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    )
  }

  // Filter transactions
  const filteredTxns = txnTab === 'All'       ? MOCK_TRANSACTIONS
    : txnTab === 'Booked'    ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'booked')
    : txnTab === 'Cancelled' ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'cancelled')
    : txnTab === 'Failed'    ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'failed')
    : txnTab === 'Refunds'   ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'refund')
    : []

  const card = {
    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    border: `1px solid ${t.border}`,
    borderRadius: 20,
    padding: '20px 24px',
    boxShadow: isDark ? 'none' : t.shadow,
    marginBottom: 20,
  }
  const labelSt = {
    color: t.textMuted, fontSize: 10, fontWeight: 700,
    display: 'block', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase',
  }
  const inputSt = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1px solid ${t.inputBorder}`, background: t.input,
    color: t.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bg }}>
      <Navbar user={user} onLogout={onLogout} />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: isMobile ? '16px 12px 60px' : '28px 24px 60px' }}>

        {/* Saved success toast */}
        {savedMsg && (
          <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(52,211,153,0.1)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={14} /> Profile updated successfully
          </div>
        )}

        {/* ── Profile header ── */}
        <div style={{ ...card, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 18, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 68, height: 68, borderRadius: 18, background: t.accentGrad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: 26, flexShrink: 0,
              boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
            }}>
              {profile.name[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ color: t.text, fontSize: isMobile ? 18 : 22, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
                  {profile.name}
                </h1>
                {aadhaarLinked && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, background: isDark ? 'rgba(52,211,153,0.1)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)' }}>
                    <ShieldCheck size={11} style={{ color: '#34d399' }} />
                    <span style={{ color: '#34d399', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>{tl('profile.aadhaarVerified')}</span>
                  </div>
                )}
              </div>
              <div style={{ color: t.textMuted, fontSize: 13, marginTop: 2 }}>@{user?.username || 'rahul.sharma'}</div>
              <div style={{ color: t.textMuted, fontSize: 12, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} /> {profile.address}
              </div>
            </div>
          </div>
          <button onClick={() => { setEditMode(!editMode); setEditProfile({ ...profile }) }} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
            border: `1px solid ${t.border}`, background: 'transparent', color: t.textSec,
            fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
          }}>
            <Edit3 size={13} /> {editMode ? 'Cancel' : tl('profile.editProfile')}
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          <StatCard icon={Train}      label="Total Bookings" value={totalBookings}                        color="#6366f1" t={t} isDark={isDark} />
          <StatCard icon={Calendar}   label="Upcoming Trips"  value={upcomingCount}                        color="#f97316" t={t} isDark={isDark} />
          <StatCard icon={MapPin}     label="Destinations"    value={destinations}                          color="#34d399" t={t} isDark={isDark} />
          <StatCard icon={CreditCard} label="Total Spent"     value={`₹${(totalSpent/1000).toFixed(1)}K`} color="#3b82f6" t={t} isDark={isDark} />
        </div>

        {/* ── Page-level tabs ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', borderRadius: 14, padding: 4, border: `1px solid ${t.border}` }}>
          {[
            { id: 'profile',      label: '👤 Profile'        },
            { id: 'transactions', label: '📋 My Transactions' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === id ? (isDark ? 'rgba(255,255,255,0.08)' : 'white') : 'transparent',
              color: activeTab === id ? t.text : t.textMuted,
              fontWeight: activeTab === id ? 700 : 500,
              fontSize: isMobile ? 12 : 14,
              boxShadow: activeTab === id ? (isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.08)') : 'none',
              transition: 'all 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════ PROFILE TAB ════════════════════ */}
        {activeTab === 'profile' && (
          <>
            {/* ── Personal Info ── */}
            <div style={card}>
              <h2 style={{ color: t.text, fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 20px' }}>{tl('profile.myProfile')}</h2>

              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                    {[
                      ['Full Name', 'name', 'text'],
                      ['Date of Birth', 'dob', 'date'],
                      ['Email', 'email', 'email'],
                      ['Mobile', 'phone', 'tel'],
                    ].map(([lbl, key, type]) => (
                      <div key={key}>
                        <label style={labelSt}>{lbl}</label>
                        <input
                          type={type} value={editProfile[key]}
                          onChange={e => setEditProfile({ ...editProfile, [key]: e.target.value })}
                          style={{ ...inputSt, colorScheme: isDark ? 'dark' : 'light' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={labelSt}>Address</label>
                    <input value={editProfile.address} onChange={e => setEditProfile({ ...editProfile, address: e.target.value })} style={inputSt} />
                  </div>
                  <button onClick={handleSave} style={{ padding: '11px 24px', borderRadius: 12, border: 'none', background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content' }}>
                    <Check size={14} /> Save Changes
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}>
                  {[
                    { icon: User,        label: 'Full Name',     value: profile.name },
                    { icon: Calendar,    label: 'Date of Birth', value: new Date(profile.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { icon: Mail,        label: 'Email',         value: profile.email },
                    { icon: Phone,       label: 'Mobile',        value: `+91 ${profile.phone.slice(0,5)} ${profile.phone.slice(5)}` },
                    { icon: MapPin,      label: 'Address',       value: profile.address },
                    { icon: ShieldCheck, label: 'Aadhaar',       value: aadhaarLinked ? 'XXXX XXXX 1234 ✓' : 'Not linked', aadhaar: true },
                  ].map(({ icon: Icon, label, value, aadhaar }) => (
                    <div key={label} style={{ padding: '13px 0', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.05)' : t.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Icon size={12} style={{ color: t.textMuted }} />
                      </div>
                      <div>
                        <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
                        <div style={{ color: aadhaar && aadhaarLinked ? '#34d399' : t.textSec, fontSize: 14, marginTop: 2, fontWeight: 500 }}>
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Link Aadhaar ── */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: aadhaarLinked ? 'rgba(52,211,153,0.1)' : 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={18} style={{ color: aadhaarLinked ? '#34d399' : '#818cf8' }} />
                </div>
                <div>
                  <h2 style={{ color: t.text, fontSize: 15, fontWeight: 700, margin: 0 }}>
                    Link Aadhaar
                  </h2>
                  <p style={{ color: t.textMuted, fontSize: 12, margin: '3px 0 0' }}>
                    Required for senior citizen concession, ladies quota, and faster KYC
                  </p>
                </div>
              </div>

              {aadhaarLinked ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 12, background: isDark ? 'rgba(52,211,153,0.08)' : '#ecfdf5', border: '1px solid rgba(52,211,153,0.25)' }}>
                    <ShieldCheck size={18} style={{ color: '#34d399' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#34d399', fontWeight: 700, fontSize: 14 }}>Aadhaar Verified</div>
                      <div style={{ color: t.textSec, fontSize: 12, marginTop: 2 }}>XXXX XXXX 1234 · Linked successfully</div>
                    </div>
                    <button onClick={() => setAadhaarLinked(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <X size={12} /> Unlink
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                    {['Faster booking', 'Senior citizen discount', 'Ladies quota', 'KYC verified'].map(b => (
                      <span key={b} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', fontWeight: 600 }}>
                        ✓ {b}
                      </span>
                    ))}
                  </div>

                  {aadhaarStep === 0 && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelSt}>Aadhaar Number</label>
                        <input
                          value={aadhaarNum}
                          onChange={e => { setAadhaarNum(formatAadhaar(e.target.value)); setAadhaarError('') }}
                          placeholder="XXXX XXXX XXXX"
                          maxLength={14}
                          style={{ ...inputSt, borderColor: aadhaarError ? t.red : t.inputBorder, letterSpacing: '0.1em', fontFamily: 'monospace', fontSize: 16 }}
                        />
                        {aadhaarError && <div style={{ color: t.red, fontSize: 11, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={10} /> {aadhaarError}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button onClick={handleSendOtp} style={{ padding: '11px 20px', borderRadius: 10, border: 'none', background: t.accentGrad, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Send OTP
                        </button>
                      </div>
                    </div>
                  )}

                  {aadhaarStep === 1 && (
                    <div>
                      <div style={{ padding: '10px 14px', borderRadius: 10, background: isDark ? 'rgba(99,102,241,0.08)' : '#eef2ff', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 14, fontSize: 13, color: '#6366f1' }}>
                        📱 OTP sent to registered mobile ****7890 · (Demo: use <strong>123456</strong>)
                      </div>
                      <label style={labelSt}>Enter OTP</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input
                          value={aadhaarOtp}
                          onChange={e => { setAadhaarOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setAadhaarError('') }}
                          placeholder="6-digit OTP"
                          maxLength={6}
                          style={{ ...inputSt, letterSpacing: '0.3em', fontFamily: 'monospace', fontSize: 20, borderColor: aadhaarError ? t.red : t.inputBorder }}
                        />
                        <button onClick={handleVerifyOtp} style={{ padding: '11px 20px', borderRadius: 10, border: 'none', background: '#22c55e', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Verify
                        </button>
                      </div>
                      {aadhaarError && <div style={{ color: t.red, fontSize: 11, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={10} /> {aadhaarError}</div>}
                      <button onClick={() => { setAadhaarStep(0); setAadhaarOtp(''); setAadhaarError('') }} style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RefreshCw size={11} /> Resend OTP
                      </button>
                    </div>
                  )}

                  <p style={{ color: t.textMuted, fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
                    🔒 Your Aadhaar data is encrypted and stored securely. IRCTC does not share it with third parties.
                  </p>
                </div>
              )}
            </div>

            {/* ── Saved Travellers ── */}
            <div style={card}>
              <h2 style={{ color: t.text, fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>{tl('profile.savedTravellers')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SAVED_TRAVELERS.map((tr, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.02)' : t.bgAlt, border: `1px solid ${t.border}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: ['linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#f97316,#ef4444)', 'linear-gradient(135deg,#10b981,#06b6d4)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {tr.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{tr.name}</div>
                      <div style={{ color: t.textMuted, fontSize: 12 }}>{tr.relation} · {tr.age} yrs · {tr.gender === 'M' ? tl('booking.male') : tl('booking.female')}</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 4 }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
                <button style={{ width: '100%', padding: '11px', borderRadius: 12, border: `1px dashed ${t.border}`, background: 'transparent', color: t.textMuted, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
                  + {tl('profile.addTraveller')}
                </button>
              </div>
            </div>

            {/* ── Account Settings ── */}
            <div style={card}>
              <h2 style={{ color: t.text, fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>{tl('profile.accountSettings')}</h2>
              {[
                { icon: Bell,       label: tl('profile.notifications'),  sub: 'Booking updates, reminders, offers', color: '#f97316' },
                { icon: ShieldCheck, label: 'Security',                  sub: 'Password, 2FA, linked accounts',    color: '#6366f1' },
                { icon: CreditCard, label: 'Saved Payments',             sub: 'UPI IDs, saved cards',              color: '#3b82f6' },
              ].map(({ icon: Icon, label, sub, color }) => (
                <button key={label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', background: 'none', border: 'none', borderBottom: `1px solid ${t.border}`, cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: t.text, fontSize: 14, fontWeight: 600 }}>{label}</div>
                    <div style={{ color: t.textMuted, fontSize: 12, marginTop: 2 }}>{sub}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: t.textMuted }} />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ════════════════════ TRANSACTIONS TAB ════════════════════ */}
        {activeTab === 'transactions' && (
          <>
            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {TXN_TABS.map(tab => {
                const count = tab === 'All' ? MOCK_TRANSACTIONS.length
                  : tab === 'Booked' ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'booked').length
                  : tab === 'Cancelled' ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'cancelled').length
                  : tab === 'Failed' ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'failed').length
                  : tab === 'Refunds' ? MOCK_TRANSACTIONS.filter(tx => tx.type === 'refund').length
                  : MOCK_TDR.length
                return (
                  <button key={tab} onClick={() => setTxnTab(tab)} style={{
                    padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    background: txnTab === tab ? t.accentGrad : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                    color: txnTab === tab ? 'white' : t.textSec,
                    fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>
                    {tab}
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 10,
                      background: txnTab === tab ? 'rgba(255,255,255,0.25)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                      color: txnTab === tab ? 'white' : t.textMuted,
                    }}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Summary strip */}
            {txnTab === 'All' && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  { icon: Receipt,         label: 'Booked',    value: MOCK_TRANSACTIONS.filter(t=>t.type==='booked').length,    color: '#22c55e' },
                  { icon: X,               label: 'Cancelled',  value: MOCK_TRANSACTIONS.filter(t=>t.type==='cancelled').length, color: '#ef4444' },
                  { icon: AlertCircle,     label: 'Failed',     value: MOCK_TRANSACTIONS.filter(t=>t.type==='failed').length,    color: '#f59e0b' },
                  { icon: ArrowDownCircle, label: 'Refunds',    value: MOCK_TRANSACTIONS.filter(t=>t.type==='refund').length,    color: '#3b82f6' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'white', border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 16px', boxShadow: isDark ? 'none' : t.shadow }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <Icon size={13} style={{ color }} />
                    </div>
                    <div style={{ color: t.text, fontWeight: 800, fontSize: 18 }}>{value}</div>
                    <div style={{ color: t.textMuted, fontSize: 11, marginTop: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* TDR tab */}
            {txnTab === 'TDR' && (
              <div>
                <div style={{ padding: '14px 18px', borderRadius: 14, background: isDark ? 'rgba(245,158,11,0.07)' : '#fffbeb', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 16 }}>
                  <div style={{ color: '#d97706', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>📋 What is TDR?</div>
                  <p style={{ color: t.textSec, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                    Ticket Deposit Receipt (TDR) is a refund claim you can file when your train is cancelled, runs very late, or you're unable to travel due to unavoidable reasons. TDR must be filed within 72 hours of the scheduled departure.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {MOCK_TDR.map(tdr => <TdrCard key={tdr.id} tdr={tdr} t={t} isDark={isDark} />)}
                </div>
              </div>
            )}

            {/* Transaction list */}
            {txnTab !== 'TDR' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredTxns.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                    <div style={{ color: t.textSec, fontWeight: 600, fontSize: 15 }}>No {txnTab.toLowerCase()} transactions</div>
                  </div>
                ) : (
                  filteredTxns.map(tx => <TxnCard key={tx.id} tx={tx} t={t} isDark={isDark} />)
                )}
              </div>
            )}

            {/* Bottom note */}
            <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={14} style={{ color: t.textMuted, flexShrink: 0 }} />
              <span style={{ color: t.textMuted, fontSize: 12, lineHeight: 1.5 }}>
                Showing transactions from the last 12 months. For older records, contact IRCTC customer care at 14646.
              </span>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
