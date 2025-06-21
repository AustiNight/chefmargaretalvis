"use client"

import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">© 2023 Chef Margaret Alvis. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
