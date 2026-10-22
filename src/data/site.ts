// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to change content. Empty strings are hidden or
// shown as clearly labeled placeholders — nothing is invented.
// ─────────────────────────────────────────────────────────────
export type VideoSource = { type: 'youtube' | 'vimeo' | 'mp4'; src: string } // youtube/vimeo: URL or ID · mp4: URL or /videos/file.mp4

export const site = {
  contact: {
    instagram: '', // handle only, e.g. 'crappedits'
    whatsapp: '',  // digits with country code, e.g. '919800000000'
    phone: '',     // e.g. '+91 98000 00000'
    email: '',     // e.g. 'hello@yourdomain.com'
  },
  showreel: {
    poster: '' as string,              // e.g. '/images/showreel-poster.jpg'
    video: null as VideoSource | null, // e.g. { type: 'youtube', src: 'https://youtu.be/XXXXXXXXXXX' }
  },
  about: {
    owner: '',      // e.g. 'Founder name'
    team: '',       // e.g. 'Shooters, editors, colourists'
    location: '',   // e.g. 'Ahmedabad, India'
    experience: '', // e.g. 'Years of experience'
    approach: 'We shoot with the edit in mind and cut with the brand in mind, so every frame earns its place.',
  },
}

export const categories = ['Business Promotion', 'Product Videos', 'Food and Restaurant', 'Events', 'Fashion', 'Cinematic Reels'] as const
export type Category = (typeof categories)[number]

export type Project = {
  id: string; title: string; category: Category; description: string
  thumbnail?: string; video?: VideoSource; client?: string; placeholder?: boolean
}

// Replace placeholders with real work. Set placeholder:false once genuine.
export const projects: Project[] = [
  { id: 'p1', title: 'Brand Story Film', category: 'Business Promotion', description: 'Placeholder — a brand film that introduces a business in under a minute.', placeholder: true },
  { id: 'p2', title: 'Product Launch Reel', category: 'Product Videos', description: 'Placeholder — close-up product shots cut to rhythm.', placeholder: true },
  { id: 'p3', title: 'Kitchen After Dark', category: 'Food and Restaurant', description: 'Placeholder — a restaurant promo built around texture and steam.', placeholder: true },
  { id: 'p4', title: 'Event Highlights', category: 'Events', description: 'Placeholder — the best moments of a live event, delivered fast.', placeholder: true },
  { id: 'p5', title: 'Lookbook in Motion', category: 'Fashion', description: 'Placeholder — a collection filmed like a short film.', placeholder: true },
  { id: 'p6', title: 'Cinematic Cut', category: 'Cinematic Reels', description: 'Placeholder — a moody reel with color and sound design.', placeholder: true },
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
