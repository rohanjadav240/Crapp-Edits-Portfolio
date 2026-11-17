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
    poster: '/images/poster.png' as string,              // e.g. '/images/showreel-poster.jpg'
    video: { type: 'mp4', src: '/videos/4.mp4' } as VideoSource | null, // e.g. { type: 'youtube', src: 'https://youtu.be/XXXXXXXXXXX' }
  },
  about: {
    owner: 'Shaikh Zuber',      // e.g. 'Founder name'
    team: 'Our Crapp Team',       // e.g. 'Shooters, editors, colourists'
    location: 'Vyara, Gujarat',   // e.g. 'Ahmedabad, India'
    experience: '2+ Years', // e.g. 'Years of experience'
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
    description: 'A Cafe Cinamatic Promotional Reel.',
    thumbnail: '/images/5.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/5.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p2',
    title: 'About Us',
    category: 'Business Promotion',
    description: 'Crapp Media Egengy Promotion Reel.',
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
  { title: 'Video Production', text: 'We learn your brand, audience and goal.' },
  { title: 'Professional Video Editing', text: 'Concept, shot list and schedule, agreed up front.' },
  { title: 'Anchor & Promotional Reels', text: 'Camera, light and direction on location or in studio.' },
  { title: 'Car Delivery Shoot', text: 'Story, rhythm, color and sound come together.' },
  { title: 'Event Shoot', text: 'Final files in every format you need.' },
  { title: 'Shop Opening Shoot', text: 'Final files in every format you need.' },
  { title: 'Social Media Marketing', text: 'We learn your brand, audience and goal.' },
  { title: 'Brand & Business Promotion', text: 'Concept, shot list and schedule, agreed up front.' },
  { title: 'Creative Content Creation', text: 'Camera, light and direction on location or in studio.' },
  { title: 'Paid Ads & Digital Campaigns', text: 'Story, rhythm, color and sound come together.' },
  { title: 'Behind The Scenes Production', text: 'Final files in every format you need.' },
]
// export const process = [
//   { title: 'Discover', text: 'We learn your brand, audience and goal.' },
//   { title: 'Plan', text: 'Concept, shot list and schedule, agreed up front.' },
//   { title: 'Shoot', text: 'Camera, light and direction on location or in studio.' },
//   { title: 'Edit', text: 'Story, rhythm, color and sound come together.' },
//   { title: 'Deliver', text: 'Final files in every format you need.' },
// ]