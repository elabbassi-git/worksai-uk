/**
 * One bespoke, animated workflow diagram per service.
 * Each diagram has its own topology (nodes, connections), its own live status text and
 * one entry per workflow step (must match the service's `workflow` length, checked at build).
 *
 * Canvas: 1000 × 400 units. Node x/y are the node centre.
 * Status text is cumulative: a node keeps its last status until a later step changes it.
 * All content is illustrative.
 */
export type Icon =
  | 'phone' | 'chat' | 'ai' | 'calendar' | 'user' | 'bell' | 'mail' | 'db' | 'web' | 'pin' | 'star'
  | 'invoice' | 'check' | 'server' | 'layers' | 'doc' | 'shield' | 'chart' | 'search' | 'code'
  | 'transfer' | 'card' | 'team' | 'book' | 'flag' | 'folder' | 'clock' | 'rocket' | 'key';

export type DNode = { id: string; x: number; y: number; label: string; icon: Icon; tone?: 'customer' | 'ai' | 'you' | 'tool' | 'us' };
export type DEdge = { id: string; from: string; to: string; bend?: number; dashed?: boolean };
export type DStep = { nodes: string[]; edges: string[]; status?: Record<string, string> };
export type Diagram = { headline: string; nodes: DNode[]; edges: DEdge[]; steps: DStep[] };

export const icons: Record<Icon, string> = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  chat: 'M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12Z',
  ai: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z',
  calendar: 'M4 7h16v13H4zM8 3v4M16 3v4M4 11h16',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  bell: 'M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 21h4',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  web: 'M3 5h18v14H3zM3 9h18M6.5 7h.01M9 7h.01',
  pin: 'M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z',
  invoice: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5',
  check: 'M5 12l4.5 4.5L19 7',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  layers: 'M12 3 2 8l10 5 10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
  shield: 'M12 3 4 6v6c0 5 3.4 8.6 8 9 4.6-.4 8-4 8-9V6z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm10 3-5-5',
  code: 'M8 8l-5 4 5 4M16 8l5 4-5 4M14 4l-4 16',
  transfer: 'M7 7h13l-3-3M17 17H4l3 3',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  team: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6',
  book: 'M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h13',
  flag: 'M5 21V4h11l-2 4 2 4H5',
  folder: 'M3 6h6l2 2h10v11H3z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 15l-3-3c1-4 5-9 13-9 0 8-5 12-9 13ZM15 9h.01',
  key: 'M15 7a4 4 0 1 1-7.5 2L3 13.5V17h3.5v-2h2v-2h2l1-1A4 4 0 0 1 15 7Z',
};

export const diagrams: Record<string, Diagram> = {
  /* WhatsApp: a message travels phone → WhatsApp → AI, replies loop back, then fan out to calendar and owner */
  whatsapp: {
    headline: 'One WhatsApp enquiry at 21:14, handled end to end',
    nodes: [
      { id: 'cust', x: 100, y: 200, label: 'Customer', icon: 'user', tone: 'customer' },
      { id: 'wa', x: 300, y: 200, label: 'WhatsApp', icon: 'chat', tone: 'tool' },
      { id: 'ai', x: 520, y: 200, label: 'AI assistant', icon: 'ai', tone: 'ai' },
      { id: 'kb', x: 520, y: 55, label: 'Your knowledge base', icon: 'book', tone: 'tool' },
      { id: 'cal', x: 760, y: 95, label: 'Your calendar', icon: 'calendar', tone: 'tool' },
      { id: 'crm', x: 760, y: 310, label: 'CRM / inbox', icon: 'db', tone: 'tool' },
      { id: 'you', x: 915, y: 200, label: 'You', icon: 'bell', tone: 'you' },
    ],
    edges: [
      { id: 'e1', from: 'cust', to: 'wa' },
      { id: 'e2', from: 'wa', to: 'ai' },
      { id: 'e3', from: 'kb', to: 'ai' },
      { id: 'e4', from: 'ai', to: 'wa', bend: 70 },
      { id: 'e5', from: 'ai', to: 'cal' },
      { id: 'e6', from: 'ai', to: 'crm' },
      { id: 'e7', from: 'crm', to: 'you' },
      { id: 'e8', from: 'you', to: 'kb', bend: -60, dashed: true },
    ],
    steps: [
      { nodes: ['cust', 'wa'], edges: ['e1'], status: { cust: '“Free Saturday?”', wa: '1 new message' } },
      { nodes: ['wa', 'ai', 'kb'], edges: ['e2', 'e3', 'e4'], status: { ai: 'Replied in 3 seconds', kb: 'Prices · areas · hours' } },
      { nodes: ['ai', 'cust'], edges: ['e4'], status: { ai: 'Asking 2 questions', cust: 'Postcode LS6 · urgent? no' } },
      { nodes: ['ai', 'cal'], edges: ['e5'], status: { cal: 'Sat 10:00 booked ✓', cust: 'Confirmation sent' } },
      { nodes: ['crm', 'you'], edges: ['e6', 'e7'], status: { crm: 'Lead saved with notes', you: 'New booking ready' } },
      { nodes: ['you', 'kb'], edges: ['e8'], status: { kb: 'Prices updated by you', you: 'Owner of every account' } },
    ],
  },

  /* AI agents: three channels converge on one agent, which fans out to actions and a human */
  'ai-agents': {
    headline: 'Three channels in, one agent, the right action out',
    nodes: [
      { id: 'wa', x: 110, y: 60, label: 'WhatsApp', icon: 'chat', tone: 'customer' },
      { id: 'web', x: 110, y: 200, label: 'Website chat', icon: 'web', tone: 'customer' },
      { id: 'tel', x: 110, y: 340, label: 'Phone', icon: 'phone', tone: 'customer' },
      { id: 'agent', x: 470, y: 200, label: 'AI agent', icon: 'ai', tone: 'ai' },
      { id: 'cal', x: 820, y: 60, label: 'Calendar', icon: 'calendar', tone: 'tool' },
      { id: 'crm', x: 820, y: 200, label: 'CRM', icon: 'db', tone: 'tool' },
      { id: 'human', x: 820, y: 340, label: 'Your team', icon: 'team', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'wa', to: 'agent' },
      { id: 'b', from: 'web', to: 'agent' },
      { id: 'c', from: 'tel', to: 'agent' },
      { id: 'd', from: 'agent', to: 'cal' },
      { id: 'e', from: 'agent', to: 'crm' },
      { id: 'f', from: 'agent', to: 'human', dashed: true },
    ],
    steps: [
      { nodes: ['wa', 'web', 'tel'], edges: [], status: { wa: '2 waiting', web: '1 visitor asking', tel: '1 ringing' } },
      { nodes: ['agent', 'web'], edges: ['a', 'b', 'c'], status: { agent: 'Answering all 4 at once', web: 'Answered ✓' } },
      { nodes: ['agent', 'cal'], edges: ['d'], status: { cal: 'Viewing Thu 17:30', agent: 'Booking a viewing' } },
      { nodes: ['crm'], edges: ['e'], status: { crm: 'Applicant + full chat saved' } },
      { nodes: ['human', 'agent'], edges: ['f'], status: { human: 'Complaint handed over', agent: 'Knows its limits' } },
    ],
  },

  /* AI receptionist: a call comes in, is answered, then branches three ways */
  'ai-receptionist': {
    headline: 'A call at 19:42, answered, routed and summarised',
    nodes: [
      { id: 'caller', x: 90, y: 200, label: 'Caller', icon: 'phone', tone: 'customer' },
      { id: 'number', x: 270, y: 200, label: 'Your number', icon: 'transfer', tone: 'tool' },
      { id: 'ai', x: 470, y: 200, label: 'AI receptionist', icon: 'ai', tone: 'ai' },
      { id: 'book', x: 720, y: 55, label: 'Book', icon: 'calendar', tone: 'tool' },
      { id: 'msg', x: 720, y: 200, label: 'Take a message', icon: 'mail', tone: 'tool' },
      { id: 'mobile', x: 720, y: 345, label: 'Transfer to you', icon: 'user', tone: 'you' },
      { id: 'sum', x: 915, y: 200, label: 'Call summary', icon: 'doc', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'caller', to: 'number' },
      { id: 'b', from: 'number', to: 'ai' },
      { id: 'c', from: 'ai', to: 'book' },
      { id: 'd', from: 'ai', to: 'msg' },
      { id: 'e', from: 'ai', to: 'mobile', dashed: true },
      { id: 'f', from: 'book', to: 'sum' },
      { id: 'g', from: 'msg', to: 'sum' },
      { id: 'h', from: 'mobile', to: 'sum' },
    ],
    steps: [
      { nodes: ['caller', 'number'], edges: ['a'], status: { caller: 'Ringing…', number: 'Forwarding after 4 rings' } },
      { nodes: ['ai', 'caller'], edges: ['b'], status: { ai: '“Thanks for calling…”', caller: 'Connected 00:01' } },
      { nodes: ['ai', 'book', 'msg'], edges: ['c', 'd'], status: { book: 'Tue 10:00 booked ✓', msg: 'Message if unsure' } },
      { nodes: ['mobile'], edges: ['e'], status: { mobile: 'Emergencies only' } },
      { nodes: ['sum'], edges: ['f', 'g', 'h'], status: { sum: 'Sent by WhatsApp · 00:41' } },
      { nodes: ['ai', 'sum'], edges: [], status: { ai: 'Script in your account', sum: 'Transcripts yours' } },
    ],
  },

  /* Local SEO: profile is audited and completed, searchers find it on the map, reviews accumulate */
  'local-seo': {
    headline: 'From an empty profile to the local map',
    nodes: [
      { id: 'audit', x: 110, y: 85, label: 'Profile audit', icon: 'search', tone: 'us' },
      { id: 'profile', x: 370, y: 85, label: 'Google Business Profile', icon: 'pin', tone: 'tool' },
      { id: 'search', x: 110, y: 315, label: 'Local search', icon: 'search', tone: 'customer' },
      { id: 'map', x: 370, y: 315, label: 'Map results', icon: 'pin', tone: 'tool' },
      { id: 'choose', x: 640, y: 315, label: 'Call or directions', icon: 'phone', tone: 'customer' },
      { id: 'reviews', x: 640, y: 85, label: 'Reviews', icon: 'star', tone: 'customer' },
      { id: 'you', x: 900, y: 200, label: 'You, in 5 min a week', icon: 'clock', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'audit', to: 'profile' },
      { id: 'b', from: 'search', to: 'map' },
      { id: 'c', from: 'profile', to: 'map' },
      { id: 'd', from: 'map', to: 'choose' },
      { id: 'e', from: 'choose', to: 'reviews' },
      { id: 'f', from: 'reviews', to: 'profile', bend: -55 },
      { id: 'g', from: 'you', to: 'reviews', dashed: true },
    ],
    steps: [
      { nodes: ['audit', 'profile'], edges: ['a'], status: { audit: '7 gaps found', profile: 'Completeness 40%' } },
      { nodes: ['profile'], edges: ['a'], status: { profile: 'Completeness 100% ✓', audit: 'All gaps fixed' } },
      { nodes: ['search', 'map', 'profile'], edges: ['b', 'c'], status: { search: '“dog groomer near me”', map: 'You appear on the map' } },
      { nodes: ['map', 'choose'], edges: ['d'], status: { choose: 'Tap to call' } },
      { nodes: ['choose', 'reviews'], edges: ['e', 'f'], status: { reviews: '★★★★★ new review' } },
      { nodes: ['you', 'reviews', 'profile'], edges: ['g', 'f'], status: { you: 'Following the 90-day plan', profile: 'Active and yours' } },
    ],
  },

  /* Website: pages are planned and built (left), then a visitor flows Google → site → chat → inbox (right) */
  'website-design-seo': {
    headline: 'Planned around real searches, built to turn visits into enquiries',
    nodes: [
      { id: 'plan', x: 110, y: 85, label: 'Search plan', icon: 'search', tone: 'us' },
      { id: 'build', x: 330, y: 85, label: 'Your new site', icon: 'web', tone: 'us' },
      { id: 'google', x: 110, y: 315, label: 'Google', icon: 'search', tone: 'customer' },
      { id: 'page', x: 360, y: 315, label: 'Service page', icon: 'doc', tone: 'tool' },
      { id: 'chat', x: 620, y: 315, label: 'AI chat', icon: 'ai', tone: 'ai' },
      { id: 'inbox', x: 870, y: 315, label: 'Your inbox', icon: 'mail', tone: 'you' },
      { id: 'own', x: 760, y: 85, label: 'Handed over', icon: 'key', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'plan', to: 'build' },
      { id: 'b', from: 'build', to: 'page', bend: 0 },
      { id: 'c', from: 'google', to: 'page' },
      { id: 'd', from: 'page', to: 'chat' },
      { id: 'e', from: 'chat', to: 'inbox' },
      { id: 'f', from: 'build', to: 'own' },
    ],
    steps: [
      { nodes: ['plan'], edges: [], status: { plan: '1 page per service' } },
      { nodes: ['plan', 'build'], edges: ['a'], status: { build: '6 pages · loads fast' } },
      { nodes: ['google', 'page'], edges: ['b', 'c'], status: { google: '“EV charger Derby”', page: 'Ranks for the search' } },
      { nodes: ['page', 'chat'], edges: ['d'], status: { chat: 'Answers at 22:05' } },
      { nodes: ['chat', 'inbox'], edges: ['e'], status: { inbox: 'Qualified enquiry ✓' } },
      { nodes: ['own', 'build'], edges: ['f'], status: { own: 'Site, domain and content yours' } },
    ],
  },

  /* Online booking: a booking moves along a timeline: book → deposit → reminders → reschedule → arrival */
  'online-booking-system': {
    headline: 'One booking, from the “Book” button to the chair',
    nodes: [
      { id: 'btn', x: 90, y: 110, label: '“Book” button', icon: 'web', tone: 'customer' },
      { id: 'slots', x: 290, y: 110, label: 'Live free slots', icon: 'calendar', tone: 'tool' },
      { id: 'pay', x: 490, y: 110, label: 'Deposit', icon: 'card', tone: 'customer' },
      { id: 'rem', x: 690, y: 110, label: 'Reminders', icon: 'bell', tone: 'ai' },
      { id: 'resched', x: 690, y: 310, label: 'Reschedule link', icon: 'transfer', tone: 'customer' },
      { id: 'diary', x: 910, y: 210, label: 'Your diary', icon: 'check', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'btn', to: 'slots' },
      { id: 'b', from: 'slots', to: 'pay' },
      { id: 'c', from: 'pay', to: 'rem' },
      { id: 'd', from: 'rem', to: 'diary' },
      { id: 'e', from: 'rem', to: 'resched', dashed: true },
      { id: 'f', from: 'resched', to: 'diary' },
    ],
    steps: [
      { nodes: ['btn'], edges: [], status: { btn: 'From Instagram · 20:41' } },
      { nodes: ['slots'], edges: ['a'], status: { slots: 'Thu 14:00 picked' } },
      { nodes: ['pay'], edges: ['b'], status: { pay: 'Deposit paid ✓' } },
      { nodes: ['rem'], edges: ['c'], status: { rem: '48 h and 2 h reminders' } },
      { nodes: ['diary', 'resched'], edges: ['d', 'e', 'f'], status: { resched: 'Moved to Fri 10:00', diary: 'No gap, no no-show' } },
    ],
  },

  /* Invoices: the invoice node ages day by day; reminders fire; payment stops the loop */
  'automated-invoice-reminders': {
    headline: 'Invoice 1043, chased automatically until it is paid',
    nodes: [
      { id: 'xero', x: 100, y: 200, label: 'Xero / QuickBooks', icon: 'db', tone: 'tool' },
      { id: 'inv', x: 310, y: 200, label: 'Invoice 1043', icon: 'invoice', tone: 'you' },
      { id: 'watch', x: 520, y: 200, label: 'Due-date watcher', icon: 'clock', tone: 'ai' },
      { id: 'email', x: 740, y: 70, label: 'Email reminder', icon: 'mail', tone: 'ai' },
      { id: 'wa', x: 740, y: 330, label: 'WhatsApp reminder', icon: 'chat', tone: 'ai' },
      { id: 'client', x: 920, y: 200, label: 'Your client', icon: 'user', tone: 'customer' },
    ],
    edges: [
      { id: 'a', from: 'xero', to: 'inv' },
      { id: 'b', from: 'inv', to: 'watch' },
      { id: 'c', from: 'watch', to: 'email' },
      { id: 'd', from: 'watch', to: 'wa' },
      { id: 'e', from: 'email', to: 'client' },
      { id: 'f', from: 'wa', to: 'client' },
      { id: 'g', from: 'client', to: 'xero', bend: 150, dashed: true },
    ],
    steps: [
      { nodes: ['xero', 'inv'], edges: ['a'], status: { inv: 'Day 0 · sent', xero: 'Invoicing as usual' } },
      { nodes: ['watch', 'inv'], edges: ['b'], status: { watch: 'Checks every morning', inv: 'Day 11 · due in 3 days' } },
      { nodes: ['email', 'client'], edges: ['c', 'e'], status: { email: 'Friendly heads-up sent', inv: 'Day 14 · due today' } },
      { nodes: ['wa', 'client'], edges: ['d', 'f'], status: { wa: 'Polite follow-up sent', inv: 'Day 21 · 7 days late' } },
      { nodes: ['client', 'xero', 'inv'], edges: ['g'], status: { client: 'Paid via link', inv: 'Day 22 · PAID ✓', watch: 'Reminders stopped' } },
      { nodes: ['xero'], edges: [], status: { xero: 'Monday: 0 need a call' } },
    ],
  },

  /* SaaS: a platform assembled layer by layer, then tested, launched and handed over */
  'saas-development': {
    headline: 'Your platform, assembled layer by layer, then handed over',
    nodes: [
      { id: 'scope', x: 100, y: 200, label: 'Discovery & scope', icon: 'flag', tone: 'us' },
      { id: 'data', x: 330, y: 320, label: 'Data & security', icon: 'shield', tone: 'tool' },
      { id: 'api', x: 330, y: 200, label: 'API & logic', icon: 'code', tone: 'tool' },
      { id: 'ui', x: 330, y: 80, label: 'Product UI', icon: 'layers', tone: 'tool' },
      { id: 'users', x: 600, y: 200, label: 'Real users', icon: 'team', tone: 'customer' },
      { id: 'launch', x: 800, y: 200, label: 'Production', icon: 'rocket', tone: 'ai' },
      { id: 'own', x: 920, y: 320, label: 'Your repo & cloud', icon: 'key', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'scope', to: 'data' },
      { id: 'b', from: 'scope', to: 'api' },
      { id: 'c', from: 'scope', to: 'ui' },
      { id: 'd', from: 'ui', to: 'users' },
      { id: 'e', from: 'api', to: 'users' },
      { id: 'f', from: 'users', to: 'launch' },
      { id: 'g', from: 'launch', to: 'own' },
      { id: 'h', from: 'users', to: 'ui', bend: -60, dashed: true },
    ],
    steps: [
      { nodes: ['scope'], edges: [], status: { scope: 'First release agreed · fixed price' } },
      { nodes: ['data', 'ui'], edges: ['a', 'c'], status: { data: 'Multi-tenant schema', ui: 'Clickable design' } },
      { nodes: ['api', 'ui', 'data'], edges: ['b', 'c', 'a'], status: { api: 'Sprint 3 of 5 on staging', ui: 'Screens built' } },
      { nodes: ['users'], edges: ['d', 'e', 'h'], status: { users: '4 changes fed back' } },
      { nodes: ['launch'], edges: ['f'], status: { launch: 'Tests ✓ · security ✓ · live' } },
      { nodes: ['own'], edges: ['g'], status: { own: 'Code, cloud, docs: yours' } },
    ],
  },

  /* AI web dev: documents flow into an extraction model, confidence gates send work to a person or straight through */
  'ai-web-development': {
    headline: 'An AI feature with a safety net, from test set to your users',
    nodes: [
      { id: 'goal', x: 100, y: 80, label: 'Task & success bar', icon: 'flag', tone: 'us' },
      { id: 'tests', x: 100, y: 320, label: 'Test set', icon: 'folder', tone: 'us' },
      { id: 'model', x: 380, y: 200, label: 'AI feature', icon: 'ai', tone: 'ai' },
      { id: 'app', x: 640, y: 80, label: 'Your app', icon: 'web', tone: 'customer' },
      { id: 'gate', x: 640, y: 320, label: 'Confidence check', icon: 'shield', tone: 'tool' },
      { id: 'human', x: 900, y: 320, label: 'Person reviews', icon: 'user', tone: 'you' },
      { id: 'own', x: 900, y: 80, label: 'Handed over', icon: 'key', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'goal', to: 'model' },
      { id: 'b', from: 'tests', to: 'model' },
      { id: 'c', from: 'model', to: 'app' },
      { id: 'd', from: 'model', to: 'gate' },
      { id: 'e', from: 'gate', to: 'human', dashed: true },
      { id: 'f', from: 'app', to: 'own' },
    ],
    steps: [
      { nodes: ['goal'], edges: [], status: { goal: '95% fields correct' } },
      { nodes: ['tests'], edges: ['b'], status: { tests: '150 real documents' } },
      { nodes: ['model'], edges: ['a', 'b'], status: { model: 'Weekly builds · 94% → 97%' } },
      { nodes: ['app', 'model'], edges: ['c'], status: { app: 'Users upload PDFs' } },
      { nodes: ['gate', 'human'], edges: ['d', 'e'], status: { gate: 'Low confidence flagged', human: 'Checks 1 field' } },
      { nodes: ['own'], edges: ['f'], status: { own: 'Code, prompts, tests: yours' } },
    ],
  },

  /* Research sprint: a funnel narrowing from question to decision */
  'ai-research-studio': {
    headline: 'A 2 to 4 week sprint that ends in a decision',
    nodes: [
      { id: 'q', x: 100, y: 200, label: 'Sharp question', icon: 'search', tone: 'us' },
      { id: 'data', x: 300, y: 80, label: 'Your examples', icon: 'folder', tone: 'you' },
      { id: 'proto', x: 500, y: 200, label: 'Prototype', icon: 'code', tone: 'us' },
      { id: 'measure', x: 700, y: 320, label: 'Measurements', icon: 'chart', tone: 'tool' },
      { id: 'go', x: 900, y: 200, label: 'Go / no-go', icon: 'flag', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'q', to: 'data' },
      { id: 'b', from: 'data', to: 'proto' },
      { id: 'c', from: 'q', to: 'proto' },
      { id: 'd', from: 'proto', to: 'measure' },
      { id: 'e', from: 'measure', to: 'go' },
    ],
    steps: [
      { nodes: ['q'], edges: [], status: { q: 'Top-5 match rate?' } },
      { nodes: ['data'], edges: ['a'], status: { data: '150 placements' } },
      { nodes: ['proto'], edges: ['b', 'c'], status: { proto: '2 approaches built' } },
      { nodes: ['measure'], edges: ['d'], status: { measure: 'Accuracy · speed · cost' } },
      { nodes: ['go'], edges: ['e'], status: { go: 'Go, with human review' } },
    ],
  },

  /* Enterprise: departments feed a ranked roadmap, leadership picks, delivery and training ripple out */
  'enterprise-ai': {
    headline: 'From scattered AI use to an agreed, delivered roadmap',
    nodes: [
      { id: 'fin', x: 100, y: 70, label: 'Finance', icon: 'chart', tone: 'customer' },
      { id: 'ops', x: 100, y: 200, label: 'Operations', icon: 'layers', tone: 'customer' },
      { id: 'cs', x: 100, y: 330, label: 'Customer service', icon: 'chat', tone: 'customer' },
      { id: 'road', x: 420, y: 200, label: 'Ranked roadmap', icon: 'flag', tone: 'us' },
      { id: 'lead', x: 660, y: 80, label: 'Leadership', icon: 'team', tone: 'you' },
      { id: 'deliver', x: 660, y: 320, label: 'Delivery', icon: 'rocket', tone: 'us' },
      { id: 'train', x: 900, y: 200, label: 'Trained staff', icon: 'book', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'fin', to: 'road' },
      { id: 'b', from: 'ops', to: 'road' },
      { id: 'c', from: 'cs', to: 'road' },
      { id: 'd', from: 'road', to: 'lead' },
      { id: 'e', from: 'lead', to: 'deliver', bend: 0 },
      { id: 'f', from: 'deliver', to: 'train' },
    ],
    steps: [
      { nodes: ['fin', 'ops', 'cs'], edges: [], status: { fin: 'Workshop done', ops: 'Workshop done', cs: 'Workshop done' } },
      { nodes: ['road'], edges: ['a', 'b', 'c'], status: { road: '23 ideas ranked' } },
      { nodes: ['lead'], edges: ['d'], status: { lead: '3 projects + AI policy' } },
      { nodes: ['deliver'], edges: ['e'], status: { deliver: 'Project 1 live' } },
      { nodes: ['train'], edges: ['f'], status: { train: 'Safe, practical AI use' } },
    ],
  },

  /* Client portal: a document request bounces between practice and client until complete */
  'client-portal': {
    headline: 'Documents collected without a single chasing email',
    nodes: [
      { id: 'you', x: 110, y: 200, label: 'Your practice', icon: 'team', tone: 'you' },
      { id: 'portal', x: 420, y: 200, label: 'Secure portal', icon: 'shield', tone: 'tool' },
      { id: 'list', x: 420, y: 55, label: 'Checklist', icon: 'doc', tone: 'ai' },
      { id: 'client', x: 760, y: 200, label: 'Your client', icon: 'phone', tone: 'customer' },
      { id: 'vault', x: 760, y: 345, label: 'Encrypted files', icon: 'folder', tone: 'tool' },
      { id: 'bin', x: 420, y: 345, label: 'Retention rules', icon: 'clock', tone: 'ai' },
    ],
    edges: [
      { id: 'a', from: 'you', to: 'portal' },
      { id: 'b', from: 'portal', to: 'list' },
      { id: 'c', from: 'list', to: 'client' },
      { id: 'd', from: 'client', to: 'vault' },
      { id: 'e', from: 'portal', to: 'client' },
      { id: 'f', from: 'vault', to: 'bin' },
    ],
    steps: [
      { nodes: ['you', 'portal'], edges: ['a'], status: { portal: 'Invite + 2-step log-in' } },
      { nodes: ['list'], edges: ['b', 'c'], status: { list: '3 documents requested' } },
      { nodes: ['client', 'vault'], edges: ['d'], status: { client: 'Uploaded from phone', vault: '3 of 3 received ✓' } },
      { nodes: ['you', 'client'], edges: ['e'], status: { you: 'Status: In progress' } },
      { nodes: ['bin'], edges: ['f'], status: { bin: 'Deleted on schedule' } },
    ],
  },

  /* CRM: a lead card moves across pipeline stages */
  'custom-crm': {
    headline: 'A lead that moves through your pipeline and never slips',
    nodes: [
      { id: 'src', x: 90, y: 200, label: 'Website form', icon: 'web', tone: 'customer' },
      { id: 'new', x: 290, y: 200, label: 'Enquiry', icon: 'db', tone: 'ai' },
      { id: 'quoted', x: 500, y: 200, label: 'Quoted', icon: 'invoice', tone: 'you' },
      { id: 'task', x: 500, y: 345, label: 'Follow-up task', icon: 'bell', tone: 'ai' },
      { id: 'won', x: 710, y: 200, label: 'Won', icon: 'check', tone: 'you' },
      { id: 'dash', x: 910, y: 70, label: 'Pipeline view', icon: 'chart', tone: 'you' },
    ],
    edges: [
      { id: 'a', from: 'src', to: 'new' },
      { id: 'b', from: 'new', to: 'quoted' },
      { id: 'c', from: 'quoted', to: 'task' },
      { id: 'd', from: 'task', to: 'won' },
      { id: 'e', from: 'won', to: 'dash' },
    ],
    steps: [
      { nodes: ['src'], edges: [], status: { src: 'Kitchen refit request' } },
      { nodes: ['new'], edges: ['a'], status: { new: 'Logged, source tagged' } },
      { nodes: ['quoted'], edges: ['b'], status: { quoted: 'Survey done, quote sent' } },
      { nodes: ['task'], edges: ['c'], status: { task: 'Call in 5 days' } },
      { nodes: ['won', 'dash'], edges: ['d', 'e'], status: { won: 'Accepted ✓', dash: '1 more win this month' } },
    ],
  },
};

/** Build-time guard: every published service needs a diagram with one step per workflow stage. */
export function diagramFor(slug: string, workflowLength: number): Diagram {
  const d = diagrams[slug];
  if (!d) throw new Error(`No workflow diagram for service "${slug}" in src/data/diagrams.ts`);
  if (d.steps.length !== workflowLength)
    throw new Error(`Diagram "${slug}" has ${d.steps.length} steps but the workflow has ${workflowLength}`);
  const ids = new Set(d.nodes.map((n) => n.id));
  for (const e of d.edges) if (!ids.has(e.from) || !ids.has(e.to)) throw new Error(`Diagram "${slug}" edge ${e.id} has an unknown node`);
  for (const s of d.steps) {
    for (const n of s.nodes) if (!ids.has(n)) throw new Error(`Diagram "${slug}" step uses unknown node ${n}`);
    for (const e of s.edges) if (!d.edges.some((x) => x.id === e)) throw new Error(`Diagram "${slug}" step uses unknown edge ${e}`);
  }
  return d;
}
