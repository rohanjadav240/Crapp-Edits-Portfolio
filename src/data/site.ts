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
    team: 'Crapp Team',       // e.g. 'Shooters, editors, colourists'
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
    title: 'Food Stall Promotion',
    category: 'Food and Restaurant',
    description: 'A promotional food stall video.',
    thumbnail: '/images/1.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/1.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p2',
    title: 'Food Stall Promotion',
    category: 'Food and Restaurant',
    description: 'A promotional food stall video.',
    thumbnail: '/images/2.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/2.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p3',
    title: 'Cinematic Video',
    category: 'Cinematic Reels',
    description: 'A Gym Cinematic Video.',
    thumbnail: '/images/3.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/3.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p4',
    title: 'Cinematic Business Promotion',
    category: 'Business Promotion',
    description: 'Crapp Edits Egengy Promotion Reel.',
    thumbnail: '/images/4.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/4.mp4' }, // Your video file
    placeholder: false,
  },
  {
    id: 'p5',
    title: 'Cafe Promotion',
    category: 'Food and Restaurant',
    description: 'A Cafe Cinamatic Promotional Reel.',
    thumbnail: '/images/5.jpg',                   // Cover photo
    video: { type: 'mp4', src: '/videos/5.mp4' }, // Your video file
    placeholder: false,
  }
]

// Remove, reorder or edit any service.
export const services = [
  { title: 'Professional Video Shooting', text: 'Planned, lit and framed for the final cut.' },
  { title: 'Creative Video Editing', text: 'Pacing, sound and color that hold attention.' },
  { title: 'Promotional Reels', text: 'Vertical-first edits made to be shared.' },
  { title: 'Product Videography', text: 'Detail shots that make products desirable.' },
  { title: 'Business and Brand Videos', text: 'Your story, told clearly and on-brand.' },
  { title: 'Event Highlights', text: 'The energy of the day in a tight edit.' },
]

export const process = [
  { title: 'Discover', text: 'We learn your brand, audience and goal.' },
  { title: 'Plan', text: 'Concept, shot list and schedule, agreed up front.' },
  { title: 'Shoot', text: 'Camera, light and direction on location or in studio.' },
  { title: 'Edit', text: 'Story, rhythm, color and sound come together.' },
  { title: 'Deliver', text: 'Final files in every format you need.' },
]
