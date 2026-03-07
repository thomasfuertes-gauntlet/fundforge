export const showcaseImages = {
  heroCampaign:
    "https://images.unsplash.com/photo-1628243989859-db92e2de1340?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHw0fHxjb21tdW5pdHklMjBnYXJkZW4lMjB1cmJhbiUyMHJvb2Z0b3AlMjBzdXN0YWluYWJsZXxlbnwwfHx8fDE3NzI4OTgyNDB8MA&ixlib=rb-4.1.0&q=85",
  campaignDetail:
    "https://images.unsplash.com/photo-1759722144505-b2f89f94bf8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjB1cmJhbiUyMHJvb2Z0b3AlMjBzdXN0YWluYWJsZXxlbnwwfHx8fDE3NzI4OTgyNDB8MA&ixlib=rb-4.1.0&q=85",
  avatarFemale:
    "https://images.unsplash.com/photo-1548544507-7de0e7a931d6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHw0fHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjBwb3J0cmFpdCUyMHNtaWxpbmclMjBuYXR1cmFsJTIwbGlnaHR8ZW58MHx8fHwxNzcyODk4MjQxfDA&ixlib=rb-4.1.0&q=85",
  avatarMale:
    "https://images.unsplash.com/photo-1658909835269-e76abd3ffb5d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwzfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3QlMjBwb3J0cmFpdCUyMHNtaWxpbmclMjBuYXR1cmFsJTIwbGlnaHR8ZW58MHx8fHwxNzcyODk4MjQxfDA&ixlib=rb-4.1.0&q=85",
};

export const paletteTokens = [
  {
    id: "primary",
    name: "Deep Forest",
    value: "#0F3C32",
    note: "Anchors credibility, stewardship, and momentum.",
  },
  {
    id: "secondary",
    name: "Mint Foam",
    value: "#E8F3F1",
    note: "Soft surface for cards, dividers, and calm negative space.",
  },
  {
    id: "highlight",
    name: "Harbor Blue",
    value: "#155E75",
    note: "Balances the green system with a measured, civic tone.",
  },
  {
    id: "accent",
    name: "Signal Amber",
    value: "#D97706",
    note: "Reserved for conversion moments like donation CTAs.",
  },
];

export const typeSpec = [
  {
    id: "type-h1",
    label: "Display / H1",
    style: "text-4xl sm:text-5xl lg:text-6xl font-serif",
    preview: "Crowdfunding, framed as trust.",
  },
  {
    id: "type-h2",
    label: "Editorial / H2",
    style: "text-base md:text-lg font-sans",
    preview: "A system that keeps Campaign, Community, and Profile in one voice.",
  },
  {
    id: "type-body",
    label: "Body / Longform",
    style: "text-base font-sans",
    preview: "Use high-contrast text, relaxed leading, and left alignment to keep the interface human and legible.",
  },
  {
    id: "type-mono",
    label: "Token / Mono",
    style: "text-sm font-mono",
    preview: "radius.xl = 1.25rem · space.section = 6rem",
  },
];

export const keyStats = [
  { id: "stat-raised", value: "$2.4M", label: "Prototype volume framed through one shared brand system" },
  { id: "stat-donors", value: "18.6k", label: "Sample donors reflected across conversion, community, and trust modules" },
  { id: "stat-trust", value: "94 / 100", label: "Editorial trust score used to keep profile surfaces credible" },
];

export const donationFeed = [
  { id: "donation-1", name: "Ari Lewis", amount: "$500", time: "2 mins ago" },
  { id: "donation-2", name: "June Park", amount: "$250", time: "8 mins ago" },
  { id: "donation-3", name: "Nadia Bloom", amount: "$125", time: "14 mins ago" },
  { id: "donation-4", name: "M. Carter", amount: "$60", time: "27 mins ago" },
];

export const leaderboard = [
  { id: "leader-1", rank: "01", name: "Maya Chen", amount: "$184k", trend: "+22%", avatar: "female" },
  { id: "leader-2", rank: "02", name: "Jonas Reid", amount: "$162k", trend: "+18%", avatar: "male" },
  { id: "leader-3", rank: "03", name: "Elena Ortiz", amount: "$149k", trend: "+11%", avatar: "female" },
  { id: "leader-4", rank: "04", name: "Samir Patel", amount: "$132k", trend: "+9%", avatar: "male" },
];

export const trendingCampaigns = [
  { id: "trend-1", name: "Neighborhood Solar Co-op", tag: "Trending", value: "$72k this week" },
  { id: "trend-2", name: "Clean Water Commons", tag: "Fastest Growth", value: "318 new donors" },
];

export const profileWins = [
  {
    id: "profile-card-1",
    title: "Raised for rooftop classrooms",
    meta: "Organizer · 2025",
    amount: "$84,200",
    note: "Funded with 1,128 backers and a 97 trust score.",
  },
  {
    id: "profile-card-2",
    title: "Backed the neighborhood pantry",
    meta: "Donor circle · 2024",
    amount: "$18,600",
    note: "High-engagement donor badge with repeat support streak.",
  },
  {
    id: "profile-card-3",
    title: "Mentored first-time organizers",
    meta: "Community lead · 2026",
    amount: "32 projects",
    note: "Shows contribution beyond money: stewardship and reputation.",
  },
];

export const configSnippet = `export const designSystem = {
  colors: {
    primary: '#0F3C32',
    secondary: '#E8F3F1',
    accent: '#D97706',
    blue: '#155E75'
  },
  typography: {
    heading: 'Libre Baskerville',
    body: 'Manrope'
  },
  radius: { sm: '0.75rem', xl: '1.25rem', pill: '999px' }
}`;