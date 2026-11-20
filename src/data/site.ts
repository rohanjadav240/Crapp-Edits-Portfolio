// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to change content. Empty strings are hidden or
// shown as clearly labeled placeholders — nothing is invented.
// ─────────────────────────────────────────────────────────────
export type VideoSource = { type: 'youtube' | 'vimeo' | 'mp4'; src: string } // youtube/vimeo: URL or ID · mp4: URL or /videos/file.mp4

export const site = {
  contact: {
    instagram: 'crapp_edit',
    whatsapp: '+919016086722',
    phone: '+919016086722',
    email: 'zubershaikh12815@gmail.com',
  },
  showreel: {
    poster: '/images/poster.jpeg' as string,              // e.g. '/images/showreel-poster.jpg'
    video: { type: 'mp4', src: '/videos/4.mp4' } as VideoSource | null, // e.g. { type: 'youtube', src: 'https://youtu.be/XXXXXXXXXXX' }
  },
  about: {
    owner: 'Shaikh Zuber',      // e.g. 'Founder name'
    team: 'Our Crapp Team',       // e.g. 'Shooters, editors, colourists'
    location: 'Vyara, Gujarat',   // e.g. 'Ahmedabad, India'
    experience: '4+ Years', // e.g. 'Years of experience'
    approach: 'We shoot with the edit in mind and cut with the brand in mind, so every frame earns its place.',
  },
}

export const categories = ['Business Promotion', 'Product Videos', 'Cinematic Reels', 'Events', 'Food and Restaurant', 'Fashion', 'Marketing', 'More...'] as const
export type Category = (typeof categories)[number]

export type Project = {
  id: string; title: string; category: Category; description: string
  thumbnail?: string; video?: VideoSource; client?: string; placeholder?: boolean
}

// Replace placeholders with real work. Set placeholder:false once genuine.
export const projects: Project[] = [
   {
    id: 'p1',
    title: 'Cafe Promotion',
    category: 'Food and Restaurant',
    description: 'Cafe Promotional Reel.',
    thumbnail: '/images/5.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/5.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p2',
    title: 'About Us',
    category: 'Business Promotion',
    description: 'Crapp Media Egengy.',
    thumbnail: '/images/4.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/4.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p3',
    title: 'Opening Shoot',
    category: 'Events',
    description: 'Shop Opening Shoot.',
    thumbnail: '/images/6.jpeg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/6.mp4' }, // Your video file
    placeholder: false,
  },
   {
    id: 'p4',
    title: 'Cinematic Video',
    category: 'Cinematic Reels',
    description: 'A Gym Cinematic Video.',
    thumbnail: '/images/3.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/3.mp4' }, // Your video file
    placeholder: false,
  }
]

export const process = [
  {
    title: 'Video Production',
    text: 'Turning creative ideas into reality.'
  },
  {
    title: 'Professional Video Editing',
    text: 'Creating cinematic stories with style.'
  },
  {
    title: 'Anchor & Promotional Reels',
    text: 'Promoting brands through reels.'
  },
  {
    title: 'Car Delivery Shoot',
    text: 'Capturing memorable delivery moment.'
  },
  {
    title: 'Event Shoot',
    text: 'Capturing memories that last forever.'
  },
  {
    title: 'Shop Opening Shoot',
    text: 'Making grand openings truly memorable.'
  },
  {
    title: 'Social Media Marketing',
    text: 'Growing brands through strategic social.'
  },
  {
    title: 'Brand & Business Promotion',
    text: 'Building brands & Creative promotion.'
  },
  {
    title: 'Creative Content Creation',
    text: 'Creating content that captures attention.'
  },
  {
    title: 'Paid Ads & Digital Campaigns',
    text: 'Boosting brands through targeted ads.'
  },
  {
    title: 'Behind The Scenes Production',
    text: 'Showing magic behind every production.'
  }
];

// export const process = [
//   { title: 'Discover', text: 'We learn your brand, audience and goal.' },
//   { title: 'Plan', text: 'Concept, shot list and schedule, agreed up front.' },
//   { title: 'Shoot', text: 'Camera, light and direction on location or in studio.' },
//   { title: 'Edit', text: 'Story, rhythm, color and sound come together.' },
//   { title: 'Deliver', text: 'Final files in every format you need.' },
// ]