# 🚂 IRCTC Redesign — Modern Rail Booking UI

A pixel-perfect, production-quality redesign of India's IRCTC rail booking platform built with **React 19 + Vite 7**. Features a dark/light theme system, full mobile responsiveness, and a rich set of real-world booking workflows — all with zero CSS framework dependency (100% inline styles).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or later
- **npm** v9 or later (comes with Node.js)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/irctc-new.git
cd irctc-new

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

> If your app is configured with `base: '/irctc-new/'`, open:
> **http://localhost:5173/irctc-new/**

### Build for production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

---

## 🔑 Demo Credentials

The app uses a simple mock auth system. The working credential set is:

| Username   | Password   | Aadhaar Verified |
|------------|------------|-----------------|
| `testuser` | `test@123` | Yes (after KYC) |

Alternatively, log in instantly via **Mobile OTP**, **Aadhaar OTP**, or **DigiLocker** — all accept any valid-format input.

> **Aadhaar Demo:** In Profile → Link Aadhaar, enter any 12-digit number and use OTP **`123456`** to verify.

> **Demo PNRs:** `4521873690` · `7645291083` · `2938472610` · `9023847561`

> **Demo Train Numbers (Track):** `12217` · `12951` · `12301` · `22691`

---

## ✨ Full Feature List

### 🏠 Home Page
- **Feature Tutorial (Post Login)** — 5-step guided onboarding with **Next / Skip** flow
- **Spotlight Walkthrough** — Highlights only the active control/section while dimming the rest of the UI
- **Mobile-Friendly Tutorial** — Dedicated mobile targets (theme, language, menu, search, quick tools)
- **Smart Search** — Station autocomplete with recent searches, swap from/to, date picker, class selector
- **Quick Tools Row** — PNR Status, Track Train, Train Schedule, Cancel Ticket, Order Food, eWallet tiles
- **PNR Enquiry Modal** — Look up any PNR for coach, berth, and passenger confirmation status
- **Track Your Train** — Live-status view with current station, platform number, delay, and next stop
- **Your Upcoming Trips** — Sticky right panel (desktop) / top card (mobile) with trip countdown timer
- **Frequent Routes** — One-tap re-search for your most-traveled corridors
- **Festival Calendar** — Peak-travel date reminders (Holi, Eid, Diwali, etc.) with advance booking prompts
- **Indian Railways by the Numbers** — 8-card verified statistics showcase: 2.3 Crore daily passengers · 13,000+ trains · 67,500+ km network (4th largest in world) · 7,335 stations · 14 lakh+ employees · 1,366 m world's longest platform (Gorakhpur) · 170+ years of service (est. 1853) · ~2 billion km traveled annually
- **Book with Confidence** — ISO 27001:2013 · PCI DSS · Govt. Certified · Easy Cancellations trust panel
- **eWallet Balance Teaser** — Current balance with "Top Up" CTA
- **Travel Insurance Promo** — Cross-sell card for trip protection

### 🔍 Search Results
- **Date Navigation** — ← prev day / next day → arrows in sticky header; cannot navigate to past dates
- **Quota Selector** — General · Tatkal · Premium Tatkal · Ladies · Senior Citizen with contextual info banners
- **Class Filter** — All · SL (Sleeper) · 3A · 2A · 1A pill buttons
- **Sort Options** — Earliest Departure · Fastest · Cheapest · Highest Rated
- **Departure Time Filter** — Morning 06–12 · Afternoon 12–18 · Evening 18–24 · Night 00–06
- **AVL / WL / RAC Badges** — Colour-coded: Green = Available, Amber = Waitlist, Blue = RAC, Red = Regret
- **Tatkal Surcharge Display** — Automatically shows surcharge amount per class when Tatkal quota selected
- **Senior Citizen Discount** — 40% reduced prices shown when Senior Citizen quota selected
- **Smart Picks** — Fastest / Cheapest / Top Rated quick-book tiles
- **Expandable Train Schedule** — Full route timeline with arrival/departure per station
- **Split Journey** — Alternative 2-leg routes when direct trains are full, with transfer details
- **Empty State** — Helpful message + tips when no trains match active filters

### 📋 Booking Page (2-Step Flow)

**Step 1 — Passengers & Preferences**
- **Passenger Form** — Full Name (letters-only validation), Age (range 1–150), Gender with inline error messages
- **Meal Preference per Passenger** — No Preference · Veg · Non-Veg · Jain
- **Berth Selection Map** — Interactive LB/MB/UB (main coach) + SL/SU (side) berth picker; auto-limits selection to passenger count
- **E-Catering Toggle** — Enable IRCTC food delivery to your seat at selected en-route stations
- **Travel Insurance Toggle** — ₹35/person with full coverage breakdown (cancellation, delay, accident, baggage)
- **Booking Preferences** — Preferred Coach input · Confirm-only toggle · Same coach for group · Auto-upgrade

**Step 2 — Payment**
- **Train Wallet** — Shows balance, deduction preview, remaining balance; warns if insufficient
- **UPI** — Input for UPI ID (GPay, PhonePe, Paytm, BHIM)
- **Credit / Debit Card** — Visa, Mastercard, RuPay
- **Net Banking** — All major Indian banks
- **Dynamic Fare Summary** — Updates in real-time as passengers / insurance is added
- **Pay Button Disabled** — Automatically grayed out when eWallet balance is too low

**Confirmation**
- **E-Ticket / Boarding Pass** — Full dark-blue boarding pass card
- **QR Code** — Unique deterministic SVG QR generated from PNR
- **CONFIRMED Badge** — Green gradient badge with passenger seat details
- **Add-ons Summary** — Shows active E-Catering and Insurance badges
- **Download Ticket** — CTA for PDF download (mock)

### 👤 Profile Page

**Profile Tab**
- **Header Card** — Avatar with initial, Aadhaar Verified badge, location, edit button
- **Stats Grid** — Total Bookings · Upcoming Trips · Destinations · Total Spent
- **Edit Mode** — Inline edit for Name, DOB, Email, Phone, Address with Save Changes
- **Link Aadhaar** — 2-step KYC flow (Aadhaar number → OTP); shows benefits before linking; unlink option
- **Saved Travellers** — Pre-saved passenger profiles for rapid booking
- **Account Settings** — Notifications · Security · Saved Payments shortcuts

**My Transactions Tab**
- **Sub-tabs with counts** — All · Booked · Cancelled · Failed · Refunds · TDR
- **Summary Cards** — Quick count tiles for each category
- **Booked History** — Train, route, class, PNR, amount, payment method
- **Cancellation History** — Original amount with strikethrough + refund amount
- **Failed Transactions** — Red-bordered cards with failure reason explanation
- **Refund History** — Green cards showing credited amount, refund date, destination account
- **TDR** — Educational banner explaining TDR + filed TDRs with approval status and timeline

### 📅 My Bookings Page
- **Tabs** — All · Upcoming · Past · Cancelled with counts
- **Booking Cards** — Train, route, date, class, PNR, amount
- **Expandable Details** — Coach, berth, full passenger list per booking
- **Download Ticket** — CTA per booking
- **Cancel Booking** — Confirmation dialog before cancellation

### 🏛️ Government of India Official Branding (Landing Page)
- **GoI Header Strip** — Permanent top bar with the national emblem, "भारत सरकार | Government of India", and "रेल मंत्रालय | Ministry of Railways" in bilingual (Hindi + English) text
- **Ashoka Lion Capital** — Simplified SVG of the national emblem (Lion Capital of Ashoka) with the 24-spoke Ashoka Chakra; renders cleanly at any size
- **Certification Badges** — ISO 27001:2013 · PCI DSS Compliant · Govt. Certified · DigiLocker Ready
- **IRCTC Full Corporate Identity** — "Indian Railway Catering and Tourism Corporation" · "A Government of India Enterprise" sub-labels on the brand panel
- **Official Footer** — © IRCTC Ltd. · Ministry of Railways credit · Citizen Charter · Accessibility links
- **Theme Toggle in GoI Strip** — Dark/light mode switch is visually integrated into the government header

### 🔐 Authentication
- **Login Page** — Username + Password with show/hide toggle; clean error messaging
- **Protected Routes** — Unauthenticated users always redirect to login
- **Logout** — Clears session state, navigates to login

### 📱 Mobile Responsive
- **Hamburger Menu** — Navbar collapses to Menu icon; full-screen slide-down panel with all nav links, user info, account links
- **Search Form** — Stacks vertically on mobile (From / To / Date / Class in column layout)
- **Home Layout** — Single column; upcoming trips shown at top before frequent routes
- **Search Results** — Filters scroll horizontally; card layouts simplify on small screens
- **Booking Page** — Single column; fare sidebar moves below the form
- **Profile Page** — 2-column stats grid; info fields stack to single column
- **Breakpoints** — `isMobile` < 768px, `isTablet` < 1024px (via `useWindowSize` hook)

### 🎨 Theme System
- **Dark Mode** — Deep navy background with subtle gradients and translucent surfaces
- **Light Mode** — Clean white/light-slate surfaces with blue-tinted nav
- **localStorage Persistence** — Theme survives page refreshes
- **Instant Toggle** — Sun/Moon icon in navbar; no flash of unstyled content
- **Design Tokens** — All colours flow from a single `ThemeContext.jsx` token object

---

## 🗂️ Project Structure

```
irctc-new/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── Navbar.jsx             # Sticky nav, user dropdown, mobile hamburger
│   ├── context/
│   │   └── ThemeContext.jsx       # Dark/light token system + localStorage
│   ├── data/
│   │   └── mockData.js            # MOCK_BOOKINGS, UPCOMING_TRIPS, PAST_TRIPS
│   ├── hooks/
│   │   └── useWindowSize.js       # { width, isMobile, isTablet } hook
│   ├── pages/
│   │   ├── LoginPage.jsx          # Auth screen
│   │   ├── HomePage.jsx           # Search, quick tools, PNR/Track modals
│   │   ├── SearchResults.jsx      # Train list with all filters & quotas
│   │   ├── BookingPage.jsx        # 2-step booking flow (passengers → payment)
│   │   ├── BookingsPage.jsx       # My bookings tab view
│   │   └── ProfilePage.jsx        # Profile + Transactions + Aadhaar
│   ├── App.jsx                    # Routes + auth state
│   ├── main.jsx                   # React DOM root
│   └── index.css                  # Minimal global reset only
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🚀 cPanel Deployment (Subfolder)

For deployment to `public_html/irctc-new/`:

1. Build production files:

```bash
npm run build
```

2. Upload **only** files from `dist/`:
  - `index.html`
  - `assets/`
  - `.htaccess`
  - `vite.svg`

3. Do **not** upload source/dev files (`src/`, `.git/`, `.claude/`, `README.md`, etc.).

4. Open:
  - `https://your-domain.com/irctc-new/`

> Note: Some cPanel malware scanners can false-flag compressed JS zip signatures. If that happens, upload files individually from `dist/`.

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | React | ^19.2 | Latest concurrent features |
| Build Tool | Vite | ^7.3 | HMR < 50ms, native ESM |
| Routing | React Router | ^7.13 | `useSearchParams` for URL state |
| Icons | Lucide React | ^0.577 | 1,300+ tree-shakeable SVG icons |
| Styling | Inline Styles | — | Zero CSS runtime, theme via JS objects |
| State | `useState` + `useContext` | — | No external store needed |

**Zero external UI libraries.** No Tailwind, no MUI, no shadcn. Every pixel is hand-crafted.

---

## 🏗️ Architecture Deep Dive

### Theme Token System

All colours are defined once in `ThemeContext.jsx` as `dark` and `light` objects. Components read from the `t` (tokens) object via `useTheme()`:

```jsx
const { t, isDark, toggle } = useTheme()

// Usage
<div style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}>
```

Key tokens:

| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `t.bg` | `#0a0a14` | `#f0f2f5` |
| `t.text` | `#f1f5f9` | `#0f172a` |
| `t.accent` | `#f97316` | `#f97316` |
| `t.border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.07)` |
| `t.navBg` | `rgba(10,10,20,0.92)` | `#003580` |

### URL as Search State

Search parameters live in the URL — making results deep-linkable and browser-back compatible:

```
/search?from=New+Delhi&to=Mumbai&date=2026-03-15&class=3A
```

```jsx
// SearchResults.jsx reads directly from URL
const [params] = useSearchParams()
const from = params.get('from') || 'New Delhi'
```

### Responsive Hook

One hook drives all responsive decisions app-wide:

```js
// src/hooks/useWindowSize.js
export function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return { width, isMobile: width < 768, isTablet: width < 1024 }
}
```

Usage:
```jsx
const { isMobile } = useWindowSize()
<div style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 340px' }}>
```

### Deterministic Pseudo-QR Code

Booking confirmation shows a unique QR-like SVG generated from the PNR using a seeded linear congruential generator — same PNR always produces the same pattern, no backend needed:

```js
let seed = parseInt(pnr) % 1000000007
const rng = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed & 1
}
```

### Availability Type System (Search Results)

Each train class has structured availability data:

```js
avail: {
  SL:  { type: 'AVL',    count: 88  },  // Available — green
  '3A': { type: 'WL',     count: 5   },  // Waitlist — amber
  '2A': { type: 'RAC',    count: 4   },  // RAC — blue
  '1A': { type: 'REGRET', count: 0   },  // No seats — red
}
```

### Quota Pricing Logic

```js
const getEffPrice = (cls, basePrice) => {
  if (quota === 'Tatkal')         return basePrice + tatkalSurcharge[cls]
  if (quota === 'Premium Tatkal') return Math.round(basePrice * 1.4)
  if (quota === 'Senior Citizen') return Math.round(basePrice * 0.6)
  return basePrice // General
}
```

---

## 📊 Mock Data Reference

### Demo PNRs (Home → PNR Status)

| PNR | Train | Route | Status |
|-----|-------|-------|--------|
| `4521873690` | Sampark Kranti (12217) | NDLS → MFP | CNF |
| `7645291083` | Mumbai Rajdhani (12951) | NDLS → MMCT | CNF |
| `2938472610` | Karnataka Express (12627) | NDLS → SBC | CNF |
| `9023847561` | Howrah Rajdhani (12301) | NDLS → HWH | Cancelled |

### Demo Train Numbers (Home → Track Train)

| Number | Train | Status |
|--------|-------|--------|
| `12217` | Sampark Kranti | Running 15 min late |
| `12951` | Mumbai Rajdhani | On time |
| `12301` | Howrah Rajdhani | Running 8 min late |
| `22691` | Rajdhani Express | On time |

---

## 📱 User Guide

### How to Book a Ticket

1. **Search** — Enter From, To, Date, Class on the Home page → Search Trains
2. **Choose Quota** — Select General / Tatkal / Senior Citizen etc. on results page
3. **Filter** — Use class, sort, and departure time filters to narrow results
4. **Pick a Train** — Click **Book · ₹XXX+** on your preferred train
5. **Add Passengers** — Fill name, age, gender; choose meal preference for each
6. **Pick Berths** — Tap berth tiles on the interactive map (optional)
7. **Add-ons** — Toggle E-Catering and/or Travel Insurance
8. **Preferences** — Set coach preference, confirm-only, same-coach options
9. **Continue** → Choose payment method → Pay
10. **Download** your e-ticket with the QR code

### Understanding Availability

| What you see | What it means |
|-------------|--------------|
| `AVL 42` (green) | 42 confirmed seats — book instantly |
| `WL 8` (amber) | You'd be 8th on waitlist; ticket confirms if 8 cancellations happen before journey |
| `RAC 4` (blue) | 4th RAC — you get a shared berth initially, upgrades to full berth on cancellations |
| `Regret` (red) | Fully booked, waitlist closed — cannot book this class |

### Quotas Explained

| Quota | Who can use | When to book | Price |
|-------|------------|-------------|-------|
| General | Everyone | Any time up to 120 days in advance | Base fare |
| Tatkal | Everyone | 1 day before journey | Base + surcharge (₹150–700 depending on class/distance) |
| Premium Tatkal | Everyone | 1 day before journey | ~40% above base |
| Ladies | Women only | Any time | Base fare (reserved berths for women) |
| Senior Citizen | Men 60+, Women 58+ | Any time | 40% off base fare |

### TDR (Ticket Deposit Receipt)

File a TDR when:
- Your train was **cancelled by Railways**
- Train ran **late by 3+ hours**
- You could not board due to an emergency and have supporting documents

TDR must be filed **within 72 hours** of scheduled departure. Track your TDR status under Profile → My Transactions → TDR.

---

## 🚧 Known Limitations

This is a UI prototype. Real IRCTC functionality is **not** wired up:

- No real backend — all data is static mock
- Auth state resets on page refresh
- Payment does not charge anything
- QR code is a visual pattern, not a real scannable code
- Train/PNR data is illustrative only

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2 | UI library |
| `react-dom` | ^19.2 | DOM renderer |
| `react-router-dom` | ^7.13 | Client-side routing |
| `lucide-react` | ^0.577 | SVG icon library |
| `vite` | ^7.3 | Build tool & HMR dev server |
| `@vitejs/plugin-react` | ^5.1 | React Fast Refresh |

**No** Tailwind, **No** CSS-in-JS, **No** UI component libraries, **No** Redux.

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Production build → `/dist` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

### Code Guidelines
- All styling via inline styles — no Tailwind classes, no CSS files
- Use `useTheme()` for colours — never hardcode hex values outside `ThemeContext.jsx`
- Components that receive `t` and `isDark` as props should not call `useTheme()` internally
- Keep mock data in `src/data/mockData.js` or at the top of the respective page file

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- **Design inspiration:** [IRCTC](https://www.irctc.co.in) — India's official rail booking platform
- **Icons:** [Lucide](https://lucide.dev)
- **Built with:** React 19 + Vite 7

> This is a UI redesign prototype for portfolio and educational purposes. It is not affiliated with or endorsed by IRCTC or Indian Railways.
