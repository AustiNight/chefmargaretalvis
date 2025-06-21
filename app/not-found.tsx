import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
          <Link href="/recipes">
            <Button variant="outline" className="w-full">
              Browse Recipes
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="w-full">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
