"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  Palette,
  Database,
  HardDrive,
  PanelLeft,
  LogOut,
  BookOpen,
  Star,
  Pizza,
  PanelRightClose,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear the admin login cookie
    document.cookie = "adminLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    // Redirect to home page
    router.push("/")
  }

  // Handle sidebar for mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Navigation structure
  const navigation = [
    {
      title: "Dashboard",
      items: [{ name: "Overview", href: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "Content",
      items: [
        { name: "Homepage", href: "/admin/content/homepage", icon: FileText },
        { name: "About Page", href: "/admin/content/about", icon: FileText },
        { name: "Services", href: "/admin/content/services", icon: FileText },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Event Categories", href: "/admin/events/categories", icon: Calendar },
        { name: "Blog", href: "/admin/blog", icon: BookOpen },
        { name: "Testimonials", href: "/admin/testimonials", icon: Star },
        { name: "Recipes", href: "/admin/recipes", icon: Pizza },
      ],
    },
    {
      title: "Communications",
      items: [
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Users", href: "/admin/users", icon: Users },
      ],
    },
    {
      title: "Settings",
      items: [
        { name: "Theme", href: "/admin/theme", icon: Palette },
        { name: "Site Settings", href: "/admin/settings", icon: Settings },
        { name: "Database", href: "/admin/database", icon: Database },
        { name: "Storage", href: "/admin/storage", icon: HardDrive },
      ],
    },
  ]

  // Check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true
    if (href !== "/admin" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Admin header */}
      <header className="bg-white shadow-sm border-b z-10 sticky top-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            <Link href="/admin" className="flex items-center space-x-2">
              <Image src="/chef-logo.png" alt="Chef Margaret Alvis" width={36} height={36} className="rounded-full" />
              <span className="font-semibold text-lg">Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <PanelRightClose className="mr-2 h-4 w-4" /> : <PanelLeft className="mr-2 h-4 w-4" />}
              {isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
            </Button>

            <Link href="/home">
              <Button variant="outline" size="sm">
                View Site
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-white border-r w-64 shrink-0 h-[calc(100vh-57px)] overflow-y-auto fixed left-0 top-[57px] z-20 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
          )}
        >
          <nav className="p-3 space-y-6">
            {navigation.map((group) => (
              <div key={group.title}>
                {isSidebarOpen && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    {group.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100",
                          isActiveLink(item.href) ? "bg-primary/10 text-primary" : "text-gray-700",
                        )}
                      >
                        <item.icon
                          className={cn("shrink-0 h-5 w-5", isActiveLink(item.href) ? "text-primary" : "text-gray-500")}
                        />

                        {isSidebarOpen && <span className="ml-3 truncate">{item.name}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main
          className={cn("flex-1 transition-all duration-300 ease-in-out", isSidebarOpen ? "ml-64" : "ml-0 md:ml-16")}
        >
          <div className="container px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
