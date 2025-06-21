// User type
export interface User {
  id: string
  full_name: string
  email: string
  address?: string
  subscribe_newsletter: boolean
  signup_date: string | Date
  last_contacted_date?: string | Date
  last_contacted_event_id?: string
  last_contacted_event_name?: string
}

// Event Category type
export interface EventCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
}

// Event type
export interface Event {
  id: string
  title: string
  description: string
  date: string | Date
  time?: string
  location?: string
  coordinates?: {
    lat: number
    lng: number
  }
  featured_image: string
  gallery_images?: string[]
  category_id?: string
  category?: EventCategory
  created_at: string | Date
  updated_at?: string | Date
}

// Form submission type
export interface FormSubmission {
  id: string
  type: "contact" | "gift-certificate"
  timestamp: string | Date
  name: string
  email: string
  message?: string

  // Contact form specific fields
  contact_type?: "general" | "booking"
  event_date?: string | Date
  guests?: string
  service_type?: string

  // Gift certificate specific fields
  amount?: string
  custom_amount?: string
  recipient_name?: string
  recipient_email?: string
  payment_app_username?: string
  is_processed?: boolean
}

// Recipe type
export interface Recipe {
  id: string
  title: string
  slug: string
  featured_image: string
  description: string
  ingredients: string[]
  instructions: string[]
  prep_time: number
  cook_time: number
  servings: number
  cuisine?: string
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  published_date: string | Date
  featured: boolean
}

// Blog post type
export interface BlogPost {
  id: string
  title: string
  slug: string
  featured_image: string
  excerpt: string
  content: string
  published_date: string | Date
  tags: string[]
  category?: string
  featured: boolean
}

// Theme settings type
export interface ThemeSettings {
  preset: "classic" | "modern" | "elegant" | "custom"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    success?: string
    error?: string
    warning?: string
    info?: string
  }
  fonts: {
    heading: string
    body: string
  }
  fontSizes?: {
    base: string
    small: string
    large: string
    heading1: string
    heading2: string
    heading3: string
  }
  borderRadius: "none" | "small" | "medium" | "large"
  spacing: "compact" | "normal" | "spacious"
  buttons?: {
    style: "default" | "rounded" | "pill" | "square"
    hoverEffect: "darken" | "grow" | "glow" | "none"
  }
  contentWidth?: "narrow" | "normal" | "wide" | "full"
  animations?: "none" | "subtle" | "moderate" | "playful"
}

// Site settings type
export interface SiteSettings {
  title?: string
  heroImage?: string
  signUpInstructions?: string
  aboutTitle?: string
  aboutContent?: string
  aboutImage?: string
  contactTitle?: string
  contactSubtitle?: string
  availableServices?: string[]
  services: {
    privateDinnerDescription: string
    cookingClassDescription: string
    cateringDescription: string
    consultationDescription: string
  }
  giftCertificates: {
    title: string
    subtitle: string
    amounts: string[]
    termsAndConditions: string
    promoText: string
    paymentQrCodeUrl: string
    paymentInstructions: string
  }
  instagram: {
    accessToken: string
    displayCount: number
    showCaptions: boolean
    cacheTime: number
    title: string
    subtitle: string
  }
  footerText?: string
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
  }
  messageNotifications: {
    enabled: boolean
    emailAddresses: string
  }
  theme: ThemeSettings
}
