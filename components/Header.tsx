"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { getCurrentUser } from "@/utils/auth" // Use the correct function

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if admin is logged in using the correct function
    getCurrentUser().then((user) => {
      setIsAdmin(!!user && user.role === "admin")
    })
  }, [])

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Check if a link is active
  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/chef-logo.png" alt="Chef Margaret Alvis" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-gray-800 hidden sm:inline-block">Chef Margaret Alvis</span>
            <span className="text-xl font-bold text-gray-800 sm:hidden">Chef Margaret</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/") ? "text-accent border-b-2 border-accent" : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/about") ? "text-accent border-b-2 border-accent" : "text-gray-600"
              }`}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/services") ? "text-accent border-b-2 border-accent" : "text-gray-600"
              }`}
            >
              Services
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/events") ? "text-accent border-b-2 border-accent" : "text-gray-600"
              }`}
            >
              Events
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/contact") ? "text-accent border-b-2 border-accent" : "text-gray-600"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/gift-certificates"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive("/gift-certificates") ? "text-accent border-b-2 border-accent" : "text-gray-600"
              }`}
            >
              Gift Certificates
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive("/admin") ? "text-accent border-b-2 border-accent" : "text-gray-600"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-3 border-t mt-4 space-y-2">
            <Link
              href="/"
              className={`block py-2 px-1 text-base font-medium ${
                isActive("/") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block py-2 px-1 text-base font-medium ${
                isActive("/about") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
              }`}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`block py-2 px-1 text-base font-medium ${
                isActive("/services") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
              }`}
            >
              Services
            </Link>
            <Link
              href="/events"
              className={`block py-2 px-1 text-base font-medium ${
                isActive("/events") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
              }`}
            >
              Events
            </Link>
            <Link
              href="/contact"
              className={`block py-2 px-1 text-base font-medium ${
                isActive("/contact") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/gift-certificates"
              className={`block py-2 px-1 text-base font-medium ${
                isActive("/gift-certificates") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
              }`}
            >
              Gift Certificates
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className={`block py-2 px-1 text-base font-medium ${
                  isActive("/admin") ? "text-accent border-l-4 border-accent pl-3 -ml-1" : "text-gray-600"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
