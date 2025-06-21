// Update the ThemeSettings type
export type ThemeSettings = {
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

export type SiteSettings = {
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

// Default settings
const defaultSettings: SiteSettings = {
  title: "Chef Margaret Alvis",
  heroImage: "/placeholder.svg",
  signUpInstructions:
    "Join our mailing list to receive updates about upcoming events, special offers, and new recipes.",
  aboutTitle: "About Chef Margaret Alvis",
  aboutContent:
    "Chef Margaret Alvis is a renowned culinary expert with over 15 years of experience in the industry. She specializes in farm-to-table cuisine with a focus on seasonal ingredients and sustainable practices.\n\nAfter graduating from the Culinary Institute of America, Margaret worked in several Michelin-starred restaurants before starting her own private chef and catering business. She has been featured in numerous food publications and has appeared on several cooking shows.\n\nMargaret is passionate about sharing her knowledge and love for food through cooking classes and private dining experiences. She believes that good food brings people together and creates lasting memories.",
  aboutImage: "/placeholder.svg",
  contactTitle: "Contact Chef Margaret",
  contactSubtitle:
    "Get in touch to book a private dinner, cooking class, or catering event. I'll get back to you as soon as possible.",
  availableServices: ["private-dinner", "cooking-class", "catering", "consultation"],
  services: {
    privateDinnerDescription:
      "Experience a personalized dining experience in the comfort of your own home. I'll work with you to create a custom menu tailored to your preferences and dietary needs.",
    cookingClassDescription:
      "Learn new culinary skills and techniques in a fun and interactive environment. Classes are available for all skill levels and can be customized to focus on specific cuisines or techniques.",
    cateringDescription:
      "From intimate gatherings to large events, I offer full-service catering with customized menus to suit your occasion. All dietary restrictions can be accommodated.",
    consultationDescription:
      "Need help planning a menu for a special occasion or want advice on kitchen organization? Book a consultation session to get professional culinary advice.",
  },
  giftCertificates: {
    title: "Gift Certificates",
    subtitle: "Perfect for birthdays, anniversaries, or any special occasion.",
    amounts: ["50", "100", "200", "500", "Custom"],
    termsAndConditions: "Gift certificates are valid for one year from the date of purchase.",
    promoText: "Looking for a unique gift? Give the gift of a memorable culinary experience.",
    paymentQrCodeUrl: "",
    paymentInstructions:
      "To purchase a gift certificate, scan the QR code with your payment app and enter the desired amount. Please include your payment app username and recipient details in the form below. You will receive an email confirmation once your payment has been processed, which may take up to two business days.",
  },
  instagram: {
    accessToken: "",
    displayCount: 6,
    showCaptions: true,
    cacheTime: 60,
    title: "Instagram Feed",
    subtitle: "Follow me on Instagram for behind-the-scenes content and culinary inspiration.",
  },
  footerText: "© 2023 Chef Margaret Alvis. All rights reserved.",
  socialMedia: {
    instagram: "",
    facebook: "",
    twitter: "",
  },
  messageNotifications: {
    enabled: false,
    emailAddresses: "",
  },
  theme: {
    preset: "classic",
    colors: {
      primary: "#4A5568", // Slate gray
      secondary: "#718096", // Light slate
      accent: "#F56565", // Coral red
      background: "#FFFFFF", // White
      text: "#1A202C", // Dark gray
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    borderRadius: "medium",
    spacing: "normal",
    buttons: {
      style: "default",
      hoverEffect: "darken",
    },
    contentWidth: "normal",
    animations: "subtle",
  },
}

// Get site settings
export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") {
    return defaultSettings
  }

  const storedSettings = localStorage.getItem("siteSettings")
  if (!storedSettings) {
    return defaultSettings
  }

  try {
    return { ...defaultSettings, ...JSON.parse(storedSettings) }
  } catch (error) {
    console.error("Error parsing site settings:", error)
    return defaultSettings
  }
}

// Save site settings
export function saveSiteSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem("siteSettings", JSON.stringify(settings))
}

// Update the getThemeVariables function to ensure it generates correct CSS variables

export function getThemeVariables(settings: SiteSettings): Record<string, string> {
  const { theme } = settings

  // Ensure we have default values if any properties are missing
  const colors = theme.colors || defaultSettings.theme.colors
  const fonts = theme.fonts || defaultSettings.theme.fonts

  // Convert border radius and spacing to actual values
  const borderRadiusValues = {
    none: "0",
    small: "0.25rem",
    medium: "0.375rem",
    large: "0.5rem",
  }

  const spacingValues = {
    compact: "0.875rem",
    normal: "1rem",
    spacious: "1.25rem",
  }

  const contentWidthValues = {
    narrow: "60rem",
    normal: "65rem",
    wide: "75rem",
    full: "100%",
  }

  // Get the border radius value with fallback
  const borderRadius = theme.borderRadius ? borderRadiusValues[theme.borderRadius] : borderRadiusValues.medium

  // Get the spacing value with fallback
  const spacing = theme.spacing ? spacingValues[theme.spacing] : spacingValues.normal

  // Get the content width value with fallback
  const contentWidth = theme.contentWidth ? contentWidthValues[theme.contentWidth] : contentWidthValues.normal

  return {
    "--color-primary": colors.primary,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-background": colors.background,
    "--color-text": colors.text,
    "--color-success": colors.success || "#48BB78",
    "--color-error": colors.error || "#F56565",
    "--color-warning": colors.warning || "#ED8936",
    "--color-info": colors.info || "#4299E1",
    "--color-primary-transparent": `${colors.primary}80`,
    "--font-heading": fonts.heading,
    "--font-body": fonts.body,
    "--border-radius": borderRadius,
    "--spacing-unit": spacing,
    "--content-width": contentWidth,

    // Add these variables to override the Tailwind theme
    "--background": colors.background,
    "--foreground": colors.text,
    "--primary": colors.primary,
    "--primary-foreground": "#FFFFFF",
    "--secondary": colors.secondary,
    "--secondary-foreground": "#FFFFFF",
    "--accent": colors.accent,
    "--accent-foreground": "#FFFFFF",
    "--radius": borderRadius,
  }
}
