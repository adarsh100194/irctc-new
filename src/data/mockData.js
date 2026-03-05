// Shared mock data — IRCTC demo app

export const MOCK_BOOKINGS = [
  // ── Upcoming trips ──
  {
    pnr: '4521873690',
    trainId: '12217', trainName: 'Sampark Kranti', trainNum: '12217',
    from: 'New Delhi (NDLS)', to: 'Muzaffarpur (MFP)',
    dep: '06:20', arr: '22:50',
    date: '2026-03-07',
    cls: 'SL', coach: 'S4',
    passengers: [{ name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'S4/32', status: 'CNF' }],
    status: 'Confirmed', amount: 857, upcoming: true,
  },
  {
    pnr: '6789012345',
    trainId: '22691', trainName: 'Rajdhani Express', trainNum: '22691',
    from: 'New Delhi (NDLS)', to: 'Mathura (MTJ)',
    dep: '20:00', arr: '21:45',
    date: '2026-03-14',
    cls: '3A', coach: 'B3',
    passengers: [{ name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'B3/45', status: 'CNF' }],
    status: 'Confirmed', amount: 2175, upcoming: true,
  },
  {
    pnr: '3456789012',
    trainId: '12951', trainName: 'Howrah Rajdhani', trainNum: '12301',
    from: 'New Delhi (NDLS)', to: 'Amritsar (ASR)',
    dep: '14:05', arr: '20:30',
    date: '2026-04-13',
    cls: '2A', coach: 'A1',
    passengers: [{ name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'A1/8', status: 'CNF' }],
    status: 'Confirmed', amount: 2885, upcoming: true,
  },
  // ── Past trips ──
  {
    pnr: '1234567890',
    trainId: '12951', trainName: 'Mumbai Rajdhani', trainNum: '12951',
    from: 'Muzaffarpur (MFP)', to: 'New Delhi (NDLS)',
    dep: '16:25', arr: '08:15',
    date: '2026-02-18',
    cls: 'SL', coach: 'S6',
    passengers: [{ name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'S6/45', status: 'CNF' }],
    status: 'Confirmed', amount: 820, upcoming: false,
  },
  {
    pnr: '9876543210',
    trainId: '12627', trainName: 'Karnataka Express', trainNum: '12627',
    from: 'New Delhi (NDLS)', to: 'Bengaluru (SBC)',
    dep: '21:30', arr: '09:45',
    date: '2026-01-25',
    cls: '3A', coach: 'B4',
    passengers: [{ name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'B4/22', status: 'CNF' }],
    status: 'Confirmed', amount: 2395, upcoming: false,
  },
  {
    pnr: '5432109876',
    trainId: '16506', trainName: 'Gandhidham Exp', trainNum: '16506',
    from: 'New Delhi (NDLS)', to: 'Jaipur (JP)',
    dep: '09:45', arr: '13:20',
    date: '2026-01-10',
    cls: 'SL', coach: 'S2',
    passengers: [
      { name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'S2/14', status: 'CNF' },
      { name: 'Shivam Chandra', age: 26, gender: 'M', berth: 'S2/15', status: 'CNF' },
    ],
    status: 'Confirmed', amount: 1140, upcoming: false,
  },
  {
    pnr: '2345678901',
    trainId: '12217', trainName: 'Sampark Kranti', trainNum: '12217',
    from: 'New Delhi (NDLS)', to: 'Muzaffarpur (MFP)',
    dep: '06:20', arr: '22:50',
    date: '2025-12-28',
    cls: 'SL', coach: 'S5',
    passengers: [{ name: 'Adarsh Mohan', age: 28, gender: 'M', berth: 'S5/28', status: 'CNF' }],
    status: 'Cancelled', amount: 857, upcoming: false,
  },
]

export const UPCOMING_TRIPS = MOCK_BOOKINGS.filter(b => b.upcoming)
export const PAST_TRIPS = MOCK_BOOKINGS.filter(b => !b.upcoming)
