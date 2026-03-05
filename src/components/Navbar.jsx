import { Bell, ChevronDown, LogOut, Sun, Moon, User, BookOpen, ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useWindowSize } from '../hooks/useWindowSize'

const NAV_LINKS = ['Trains', 'Hotels', 'Flights', 'Holidays']
const NAV_ICONS = { Trains: '🚂', Hotels: '🏨', Flights: '✈️', Holidays: '🌴' }

export default function Navbar({ user, onLogout }) {
  const [drop,       setDrop]       = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate  = useNavigate()
  const { t, toggle, isDark } = useTheme()
  const { isMobile } = useWindowSize()

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: 56,
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '0 14px' : '0 24px', gap: 0,
        background: t.navBg,
        backdropFilter: isDark ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${t.navBorder}`,
        boxShadow: isDark ? 'none' : '0 1px 12px rgba(0,53,128,0.15)',
      }}>

        {/* Logo */}
        <button onClick={() => navigate('/home')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          marginRight: isMobile ? 'auto' : 28,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: 11 }}>
            IR
          </div>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>IRCTC</span>
        </button>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, flex: 1 }}>
            {NAV_LINKS.map(l => (
              <button key={l} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, color: t.navText, background: 'transparent', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = t.navTextActive}
                onMouseLeave={e => e.target.style.color = t.navText}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Theme toggle */}
          <button onClick={toggle} title={isDark ? 'Light mode' : 'Dark mode'} style={{
            width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Bell (desktop only) */}
          {!isMobile && (
            <button style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.navText, position: 'relative' }}>
              <Bell size={15} />
              <span style={{ position: 'absolute', top: 8, right: 8, width: 5, height: 5, borderRadius: '50%', background: t.accent }} />
            </button>
          )}

          {/* Desktop user dropdown */}
          {!isMobile && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDrop(!drop)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px 5px 7px',
                borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)'}`,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)', cursor: 'pointer',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 800 }}>
                  {user?.name?.[0]}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>{user?.name?.split(' ')[0]}</span>
                  {user?.aadhaarVerified && (
                    <span style={{ color: '#34d399', fontSize: 8, fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1 }}>✓ AADHAAR</span>
                  )}
                </div>
                <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.5)', transform: drop ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {drop && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setDrop(false)} />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 210,
                    background: t.surfaceSolid, border: `1px solid ${t.border}`,
                    borderRadius: 14, overflow: 'hidden', zIndex: 50, boxShadow: t.shadow,
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${t.border}` }}>
                      <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                      <div style={{ color: t.textMuted, fontSize: 12, marginTop: 1 }}>@{user?.username}</div>
                      {user?.aadhaarVerified && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 7, padding: '3px 9px', borderRadius: 20, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}>
                          <ShieldCheck size={10} style={{ color: '#34d399' }} />
                          <span style={{ color: '#34d399', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>AADHAAR VERIFIED</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 6 }}>
                      {[
                        { label: 'My Profile',  icon: User,     path: '/profile'  },
                        { label: 'My Bookings', icon: BookOpen,  path: '/bookings' },
                      ].map(({ label, icon: Icon, path }) => (
                        <button key={label} onClick={() => { setDrop(false); navigate(path) }} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: t.textSec, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                          onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Icon size={13} style={{ color: t.textMuted }} /> {label}
                        </button>
                      ))}
                      <div style={{ borderTop: `1px solid ${t.border}`, margin: '4px 0' }} />
                      <button onClick={() => { setDrop(false); onLogout(); navigate('/') }} style={{ width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: t.red, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                        onMouseEnter={e => e.currentTarget.style.background = t.redDim}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{
              width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: mobileOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', transition: 'background 0.15s',
            }}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      {isMobile && mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, top: 56, zIndex: 39, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={closeMobile}
          />

          {/* Menu panel */}
          <div style={{
            position: 'fixed', top: 56, left: 0, right: 0, zIndex: 40,
            background: t.navBg,
            backdropFilter: isDark ? 'blur(24px)' : 'none',
            borderBottom: `1px solid ${t.navBorder}`,
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}>
            {/* User identity strip */}
            <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                {user?.name?.[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#ffffff', fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 1 }}>@{user?.username}</div>
              </div>
              {user?.aadhaarVerified && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 20, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', flexShrink: 0 }}>
                  <ShieldCheck size={10} style={{ color: '#34d399' }} />
                  <span style={{ color: '#34d399', fontSize: 9, fontWeight: 700 }}>VERIFIED</span>
                </div>
              )}
            </div>

            {/* Nav links */}
            <div style={{ padding: '8px 8px 4px' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '6px 10px 4px' }}>
                Services
              </div>
              {NAV_LINKS.map(link => (
                <button key={link} onClick={() => { closeMobile(); navigate('/home') }} style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: '#ffffff', fontSize: 14, fontWeight: 500,
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{NAV_ICONS[link]}</span>
                  {link}
                </button>
              ))}
            </div>

            {/* Account links */}
            <div style={{ padding: '4px 8px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '10px 10px 4px' }}>
                Account
              </div>
              {[
                { label: 'My Profile',  icon: User,     path: '/profile'  },
                { label: 'My Bookings', icon: BookOpen,  path: '/bookings' },
              ].map(({ label, icon: Icon, path }) => (
                <button key={label} onClick={() => { closeMobile(); navigate(path) }} style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: '#ffffff', fontSize: 14, fontWeight: 500,
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </span>
                  {label}
                </button>
              ))}
              <button onClick={() => { closeMobile(); onLogout(); navigate('/') }} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#ef4444', fontSize: 14, fontWeight: 500,
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                  <LogOut size={16} style={{ color: '#ef4444' }} />
                </span>
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
