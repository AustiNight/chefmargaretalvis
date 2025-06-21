"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/AdminLayout"
import PageHeader from "@/components/admin/PageHeader"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HelpGuide from "@/components/HelpGuide"
import ImageUploader from "@/components/ImageUploader"
import { getEvents, type Event } from "@/utils/events"
import { sendEventEmail } from "@/utils/sendEventEmail"
import { getSiteSettings, saveSiteSettings, type SiteSettings } from "@/utils/siteSettings"
import Link from "next/link"
import { DatabaseStats } from "@/components/DatabaseStats"
import { CalendarRange, Edit, MessageSquare, Users, BookOpen, FileText, CircleUser } from "lucide-react"
import { getAllEventsAction } from "@/app/actions/events"
import { getBlogPosts } from "@/app/actions/blog-posts"
import { getUsersCountAction } from "@/app/actions/users"
import { getMessageCountAction } from "@/app/actions/form-submissions"
import { getAllTestimonials } from "@/app/actions/testimonials"
import type { BlogPost } from "@/types"

export default function AdminDashboard() {
  // Update the settings state to include instagram settings and available services
  const [settings, setSettings] = useState<SiteSettings>({
    title: "",
    heroImage: "",
    signUpInstructions: "",
    aboutTitle: "",
    aboutContent: "",
    aboutImage: "",
    contactTitle: "",
    contactSubtitle: "",
    availableServices: [],
    services: {
      privateDinnerDescription: "",
      cookingClassDescription: "",
      cateringDescription: "",
      consultationDescription: "",
    },
    giftCertificates: {
      title: "",
      subtitle: "",
      amounts: [],
      termsAndConditions: "",
      promoText: "",
      paymentQrCodeUrl: "",
      paymentInstructions: "",
    },
    instagram: {
      accessToken: "",
      displayCount: 6,
      showCaptions: true,
      cacheTime: 60,
      title: "Instagram Feed",
      subtitle: "Follow me on Instagram for behind-the-scenes content and culinary inspiration.",
    },
    footerText: "",
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
        primary: "#4A5568",
        secondary: "#718096",
        accent: "#F56565",
        background: "#FFFFFF",
        text: "#1A202C",
      },
      fonts: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      borderRadius: "medium",
      spacing: "normal",
    },
  })
  const [isSaving, setIsSaving] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [newAmount, setNewAmount] = useState("")
  const [newService, setNewService] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [usersCount, setUsersCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load settings and events on component mount
  useEffect(() => {
    const currentSettings = getSiteSettings()
    setSettings(currentSettings)

    // Load events
    const allEvents = getEvents()
    setEvents(allEvents)
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        // Load necessary data for the dashboard
        const [eventsData, blogPostsData, usersCountData, messagesCountData, testimonialsData] = await Promise.all([
          getAllEventsAction(),
          getBlogPosts(),
          getUsersCountAction(),
          getMessageCountAction(),
          getAllTestimonials(),
        ])

        setEvents(eventsData.slice(0, 3)) // Just get the most recent 3
        setBlogPosts(blogPostsData.slice(0, 3)) // Just get the most recent 3
        setUsersCount(usersCountData)
        setMessagesCount(messagesCountData)
        setTestimonials(testimonialsData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save settings
      saveSiteSettings(settings)

      // Show success message
      toast({
        title: "Settings saved",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCommunicateEvent = async (event: Event) => {
    try {
      await sendEventEmail(event, [])
      toast({
        title: "Event notification sent",
        description: "The event notification has been sent to your subscribers.",
      })
    } catch (error) {
      console.error("Error sending event notification:", error)
      toast({
        title: "Error",
        description: "There was a problem sending the event notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    // Clear the admin login cookie
    document.cookie = "adminLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    // Redirect to home page
    router.push("/")
  }

  const handleAddAmount = () => {
    if (newAmount && !settings.giftCertificates.amounts.includes(newAmount)) {
      setSettings({
        ...settings,
        giftCertificates: {
          ...settings.giftCertificates,
          amounts: [...settings.giftCertificates.amounts, newAmount],
        },
      })
      setNewAmount("")
    }
  }

  const handleRemoveAmount = (amount: string) => {
    setSettings({
      ...settings,
      giftCertificates: {
        ...settings.giftCertificates,
        amounts: settings.giftCertificates.amounts.filter((a) => a !== amount),
      },
    })
  }

  const handleAddService = () => {
    if (newService && !settings.availableServices.includes(newService)) {
      setSettings({
        ...settings,
        availableServices: [...settings.availableServices, newService],
      })
      setNewService("")
    }
  }

  const handleRemoveService = (service: string) => {
    setSettings({
      ...settings,
      availableServices: settings.availableServices.filter((s) => s !== service),
    })
  }

  const hasDefaultEvents = events.some(
    (event) =>
      (event.description === "Summer Gala Dinner" || event.description === "Independence Day BBQ") &&
      event.image === "/placeholder.svg",
  )

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        description="Overview of your website's content and activity"
        helpText="This dashboard provides a quick overview of your website's content and activity. Click on any card to manage the related content."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/events" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CalendarRange className="mr-2 h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Manage your scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Loading events...</p>
              ) : events.length > 0 ? (
                <ul className="divide-y">
                  {events.map((event) => (
                    <li key={event.id} className="py-2">
                      <p className="font-medium truncate">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm py-2">No upcoming events</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Edit className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blog" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Recent Blog Posts
              </CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">Loading blog posts...</p>
              ) : blogPosts.length > 0 ? (
                <ul className="divide-y">
                  {blogPosts.map((post) => (
                    <li key={post.id} className="py-2">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(post.published_date)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm py-2">No blog posts yet</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Edit className="mr-2 h-4 w-4" />
                Manage Blog
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/messages" className="block">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Messages
              </CardTitle>
              <CardDescription>Manage contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-4 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-primary mb-2">{isLoading ? "-" : messagesCount}</div>
                <p className="text-sm text-muted-foreground">Total messages</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/users" className="block md:col-span-1">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Users
              </CardTitle>
              <CardDescription>Subscribers & contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-4 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-primary mb-2">{isLoading ? "-" : usersCount}</div>
                <p className="text-sm text-muted-foreground">Registered users</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <CircleUser className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </Link>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Database Overview</CardTitle>
              <CardDescription>Statistics about your website data</CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseStats />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/content/homepage" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Edit Homepage
              </CardTitle>
              <CardDescription>Update your website's main page</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/content/about" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Edit About Page
              </CardTitle>
              <CardDescription>Update your biography and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/content/services" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Edit Services
              </CardTitle>
              <CardDescription>Update your service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md relative">
        <HelpGuide title="Site Settings">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">General Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Page Title:</strong> Sets the main title displayed on your website and browser tab. This
                  affects your site's SEO.
                </li>
                <li>
                  <strong>Hero Image:</strong> The large banner image on your homepage. Use a high-quality image
                  (recommended size: 1920x1080px). You can upload an image directly or enter a URL.
                </li>
                <li>
                  <strong>Sign Up Instructions:</strong> The text displayed in the sign-up popup. Make it compelling to
                  encourage visitors to join your mailing list.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">About Page Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>About Page Title:</strong> The heading for your About page.
                </li>
                <li>
                  <strong>About Page Content:</strong> Your biography and professional background. Use double line
                  breaks to create paragraphs.
                </li>
                <li>
                  <strong>About Page Image:</strong> A professional photo of yourself (recommended size: 500x500px). You
                  can upload an image directly or enter a URL.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Contact Page Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Contact Page Title:</strong> The heading for your Contact page.
                </li>
                <li>
                  <strong>Contact Page Subtitle:</strong> Additional text explaining how and why visitors should contact
                  you.
                </li>
                <li>
                  <strong>Available Services:</strong> The list of services that visitors can select when booking.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Message Notifications Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Enable Notifications:</strong> Toggle to turn email notifications on or off.
                </li>
                <li>
                  <strong>Email Addresses:</strong> List of email addresses that will receive notifications when someone
                  submits a form on your website. Separate multiple addresses with commas or semicolons.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Services Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Service Descriptions:</strong> Detailed descriptions of each service you offer. Be specific
                  about what clients can expect.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Gift Certificates Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Title:</strong> The main heading for your Gift Certificates page.
                </li>
                <li>
                  <strong>Subtitle:</strong> A brief description of your gift certificates and their benefits.
                </li>
                <li>
                  <strong>Available Amounts:</strong> The denominations available for purchase (e.g., $50, $100, etc.).
                </li>
                <li>
                  <strong>Terms and Conditions:</strong> Any rules or restrictions that apply to gift certificates.
                </li>
                <li>
                  <strong>Promotional Text:</strong> Additional marketing text to encourage gift certificate purchases.
                </li>
                <li>
                  <strong>Payment App QR Code:</strong> A QR code image from your payment app (Venmo, Cash App, etc.)
                  that customers can scan to send payment.
                </li>
                <li>
                  <strong>Payment Instructions:</strong> Instructions for customers on how to use the payment QR code
                  and what to expect after payment.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Footer Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Footer Text:</strong> The copyright notice or additional information displayed at the bottom
                  of every page.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Social Media Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Social Media URLs:</strong> Links to your professional social media profiles. Include the full
                  URL (e.g., https://instagram.com/yourprofile).
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Instagram Integration Tab</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Access Token:</strong> Your Instagram API access token for fetching posts.
                </li>
                <li>
                  <strong>Display Count:</strong> Number of Instagram posts to display on your page.
                </li>
                <li>
                  <strong>Show Captions:</strong> Toggle whether to show post captions.
                </li>
                <li>
                  <strong>Cache Time:</strong> How long to cache Instagram data (in minutes) to improve performance.
                </li>
                <li>
                  <strong>Title & Subtitle:</strong> Customize the heading and description for your Instagram feed.
                </li>
              </ul>
            </div>

            <div>
              <p>
                <strong>Important Tips:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Always click "Save Changes" after updating any section.</li>
                <li>For images, you can either upload directly or use image URLs from other sources.</li>
                <li>Preview your website after making changes to ensure everything displays correctly.</li>
              </ul>
            </div>
          </div>
        </HelpGuide>

        <h2 className="text-2xl font-bold mb-6">Site Settings</h2>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
            <TabsTrigger value="contact">Contact Page</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gift-certificates">Gift Certificates</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              />
            </div>

            <ImageUploader
              id="heroImage"
              label="Hero Image"
              currentImageUrl={settings.heroImage}
              onImageChange={(url) => setSettings({ ...settings, heroImage: url })}
            />

            <div>
              <Label htmlFor="signUpInstructions">Sign Up Instructions</Label>
              <Textarea
                id="signUpInstructions"
                value={settings.signUpInstructions}
                onChange={(e) => setSettings({ ...settings, signUpInstructions: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <div>
              <Label htmlFor="aboutTitle">About Page Title</Label>
              <Input
                id="aboutTitle"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="aboutContent">About Page Content</Label>
              <Textarea
                id="aboutContent"
                value={settings.aboutContent}
                onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })}
                className="min-h-[200px]"
              />
            </div>

            <ImageUploader
              id="aboutImage"
              label="About Page Image"
              currentImageUrl={settings.aboutImage}
              onImageChange={(url) => setSettings({ ...settings, aboutImage: url })}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div>
              <Label htmlFor="contactTitle">Contact Page Title</Label>
              <Input
                id="contactTitle"
                value={settings.contactTitle}
                onChange={(e) => setSettings({ ...settings, contactTitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactSubtitle">Contact Page Subtitle</Label>
              <Textarea
                id="contactSubtitle"
                value={settings.contactSubtitle}
                onChange={(e) => setSettings({ ...settings, contactSubtitle: e.target.value })}
              />
            </div>

            {/* Available Services */}
            <div>
              <Label htmlFor="availableServices">Available Services</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.availableServices.map((service) => (
                  <div key={service} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                    <span>
                      {service
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveService(service)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newService"
                  placeholder="Add service (e.g., private-dinner)"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
                <Button type="button" onClick={handleAddService}>
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter services in kebab-case (e.g., private-dinner, cooking-class). These will appear as options in the
                contact form.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="notificationsEnabled"
                checked={settings.messageNotifications.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    messageNotifications: {
                      ...settings.messageNotifications,
                      enabled: checked,
                    },
                  })
                }
              />
              <Label htmlFor="notificationsEnabled">Enable email notifications for new messages</Label>
            </div>

            <div>
              <Label htmlFor="notificationEmails">Notification Email Addresses</Label>
              <Textarea
                id="notificationEmails"
                value={settings.messageNotifications.emailAddresses}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    messageNotifications: {
                      ...settings.messageNotifications,
                      emailAddresses: e.target.value,
                    },
                  })
                }
                placeholder="Enter email addresses separated by commas, semicolons, or line breaks"
                className={!settings.messageNotifications.enabled ? "opacity-50" : ""}
                disabled={!settings.messageNotifications.enabled}
              />
              <p className="text-sm text-gray-500 mt-1">
                These email addresses will receive notifications whenever someone submits a contact form or gift
                certificate request on your website. Separate multiple addresses with commas, semicolons, or line
                breaks.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div>
              <Label htmlFor="privateDinnerDescription">Private Dinner Description</Label>
              <Textarea
                id="privateDinnerDescription"
                value={settings.services.privateDinnerDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      privateDinnerDescription: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="cookingClassDescription">Cooking Class Description</Label>
              <Textarea
                id="cookingClassDescription"
                value={settings.services.cookingClassDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      cookingClassDescription: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="cateringDescription">Catering Description</Label>
              <Textarea
                id="cateringDescription"
                value={settings.services.cateringDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      cateringDescription: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="consultationDescription">Consultation Description</Label>
              <Textarea
                id="consultationDescription"
                value={settings.services.consultationDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    services: {
                      ...settings.services,
                      consultationDescription: e.target.value,
                    },
                  })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="gift-certificates" className="space-y-6">
            <div>
              <Label htmlFor="giftCertificatesTitle">Gift Certificates Title</Label>
              <Input
                id="giftCertificatesTitle"
                value={settings.giftCertificates.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      title: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="giftCertificatesSubtitle">Gift Certificates Subtitle</Label>
              <Textarea
                id="giftCertificatesSubtitle"
                value={settings.giftCertificates.subtitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      subtitle: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="giftCertificatesAmounts">Available Amounts</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.giftCertificates.amounts.map((amount) => (
                  <div key={amount} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                    <span>{amount.startsWith("$") ? amount : `${amount}`}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveAmount(amount)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newAmount"
                  placeholder="Add amount (e.g., 50)"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
                <Button type="button" onClick={handleAddAmount}>
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Enter amounts without the dollar sign. Add "Custom" to allow custom amounts.
              </p>
            </div>

            {/* Payment QR Code field */}
            <div>
              <Label htmlFor="paymentQrCodeUrl">Payment App QR Code</Label>
              <ImageUploader
                id="paymentQrCodeUrl"
                label="Payment App QR Code"
                currentImageUrl={settings.giftCertificates.paymentQrCodeUrl}
                onImageChange={(url) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      paymentQrCodeUrl: url,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a QR code image from your payment app (Venmo, Cash App, etc.) that customers can scan to send
                payment.
              </p>
            </div>

            {/* Payment Instructions field */}
            <div>
              <Label htmlFor="paymentInstructions">Payment Instructions</Label>
              <Textarea
                id="paymentInstructions"
                value={settings.giftCertificates.paymentInstructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      paymentInstructions: e.target.value,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Instructions for customers on how to use the payment QR code and what to expect after payment.
              </p>
            </div>

            <div>
              <Label htmlFor="giftCertificatesTerms">Terms and Conditions</Label>
              <Textarea
                id="giftCertificatesTerms"
                value={settings.giftCertificates.termsAndConditions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      termsAndConditions: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="giftCertificatesPromo">Promotional Text</Label>
              <Textarea
                id="giftCertificatesPromo"
                value={settings.giftCertificates.promoText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    giftCertificates: {
                      ...settings.giftCertificates,
                      promoText: e.target.value,
                    },
                  })
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="space-y-6">
            <div>
              <Label htmlFor="instagramAccessToken">Instagram Access Token</Label>
              <Input
                id="instagramAccessToken"
                type="password"
                value={settings.instagram.accessToken}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: {
                      ...settings.instagram,
                      accessToken: e.target.value,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                This is required to fetch your Instagram posts. Learn how to get your access token in the
                <a
                  href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Instagram API documentation
                </a>
                .
              </p>
            </div>

            <div>
              <Label htmlFor="instagramTitle">Instagram Feed Title</Label>
              <Input
                id="instagramTitle"
                value={settings.instagram.title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: {
                      ...settings.instagram,
                      title: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="instagramSubtitle">Instagram Feed Subtitle</Label>
              <Textarea
                id="instagramSubtitle"
                value={settings.instagram.subtitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: {
                      ...settings.instagram,
                      subtitle: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="instagramDisplayCount">Number of Posts to Display</Label>
              <Input
                id="instagramDisplayCount"
                type="number"
                min="1"
                max="20"
                value={settings.instagram.displayCount}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: {
                      ...settings.instagram,
                      displayCount: Number.parseInt(e.target.value) || 6,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="instagramShowCaptions"
                checked={settings.instagram.showCaptions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: {
                      ...settings.instagram,
                      showCaptions: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="instagramShowCaptions">Show Post Captions</Label>
            </div>

            <div>
              <Label htmlFor="instagramCacheTime">Cache Duration (minutes)</Label>
              <Input
                id="instagramCacheTime"
                type="number"
                min="5"
                max="1440"
                value={settings.instagram.cacheTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    instagram: {
                      ...settings.instagram,
                      cacheTime: Number.parseInt(e.target.value) || 60,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                How long to cache Instagram data to improve performance and reduce API calls. Recommended: 60 minutes.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6">
            <div>
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={settings.socialMedia.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                value={settings.socialMedia.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      facebook: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input
                id="twitter"
                value={settings.socialMedia.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      twitter: e.target.value,
                    },
                  })
                }
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
