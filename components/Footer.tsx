import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { getSiteSettings } from "@/lib/db/site-settings"

export default async function Footer() {
  const settings = await getSiteSettings().catch(() => ({}))

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">{settings?.title || "Chef Margaret Alvis"}</h3>
            <p className="mb-4">{settings?.description || "Private Chef Services in Oak Cliff, Texas"}</p>
            <div className="flex space-x-4">
              <a href={settings?.socialLinks?.facebook || "#"} className="hover:text-accent transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href={settings?.socialLinks?.instagram || "#"} className="hover:text-accent transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href={settings?.socialLinks?.twitter || "#"} className="hover:text-accent transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#private-dining" className="hover:text-accent transition-colors">
                  Private Dining
                </Link>
              </li>
              <li>
                <Link href="/services#cooking-classes" className="hover:text-accent transition-colors">
                  Cooking Classes
                </Link>
              </li>
              <li>
                <Link href="/services#meal-prep" className="hover:text-accent transition-colors">
                  Meal Preparation
                </Link>
              </li>
              <li>
                <Link href="/services#catering" className="hover:text-accent transition-colors">
                  Catering
                </Link>
              </li>
              <li>
                <Link href="/gift-certificates" className="hover:text-accent transition-colors">
                  Gift Certificates
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic">
              <p className="mb-2">{settings?.address || "123 Main St, Oak Cliff, TX 75208"}</p>
              <p className="mb-2">
                <a
                  href={`mailto:${settings?.email || "chef@margaretalvis.com"}`}
                  className="hover:text-accent transition-colors"
                >
                  {settings?.email || "chef@margaretalvis.com"}
                </a>
              </p>
              <p>
                <a href={`tel:${settings?.phone || "214-555-1234"}`} className="hover:text-accent transition-colors">
                  {settings?.phone || "214-555-1234"}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {settings?.title || "Chef Margaret Alvis"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
