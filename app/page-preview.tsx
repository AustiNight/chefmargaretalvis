"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Share2, Calendar, Users, ChefHat, Utensils, MessageSquare, Instagram } from "lucide-react"

export default function HomePagePreview() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3">
          <ul className="flex justify-between items-center">
            <li>
              <a href="#" className="text-xl font-bold">
                Chef Margaret Alvis
              </a>
            </li>
            <li>
              <ul className="flex space-x-4">
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Gift Certificates</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Chef Margaret Alvis"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
            Chef Margaret Alvis
            <br />
            <span className="text-2xl md:text-3xl">Oak Cliff, Texas</span>
          </h1>
        </div>
      </div>

      {/* Events Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>

        <div className="mb-12">
          <div className="relative h-[400px] w-full mb-4">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Summer Gala Dinner"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Summer Gala Dinner</h3>
            <p className="text-gray-600">June 15, 2023</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Save to Calendar
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="relative h-[400px] w-full mb-4">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Independence Day BBQ"
              fill
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Independence Day BBQ</h3>
            <p className="text-gray-600">July 4, 2023</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Save to Calendar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <ChefHat className="w-8 h-8 mr-3 text-gray-700" />
                <h3 className="text-xl font-semibold">Private Dinners</h3>
              </div>
              <p>
                Experience a personalized dining experience in the comfort of your own home. I'll work with you to
                create a custom menu tailored to your preferences and dietary needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 mr-3 text-gray-700" />
                <h3 className="text-xl font-semibold">Cooking Classes</h3>
              </div>
              <p>
                Learn new culinary skills and techniques in a fun and interactive environment. Classes are available for
                all skill levels and can be customized to focus on specific cuisines or techniques.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Utensils className="w-8 h-8 mr-3 text-gray-700" />
                <h3 className="text-xl font-semibold">Catering</h3>
              </div>
              <p>
                From intimate gatherings to large events, I offer full-service catering with customized menus to suit
                your occasion. All dietary restrictions can be accommodated.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-8 h-8 mr-3 text-gray-700" />
                <h3 className="text-xl font-semibold">Consultation</h3>
              </div>
              <p>
                Need help planning a menu for a special occasion or want advice on kitchen organization? Book a
                consultation session to get professional culinary advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"Chef Margaret's culinary creations are simply outstanding!"</p>
              <p className="font-semibold">- John Doe</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "The private dinner Chef Margaret prepared for us was unforgettable."
              </p>
              <p className="font-semibold">- Jane Smith</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                "I learned so much in Chef Margaret's cooking class. Highly recommended!"
              </p>
              <p className="font-semibold">- Mike Johnson</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Instagram</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <Image
                  src={`/placeholder.svg?height=400&width=400&text=Instagram+Post+${i}`}
                  alt="Instagram post"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs line-clamp-2">
                  Check out this amazing dish I prepared for a private dinner last night! #chefalvis #privatechef
                  #oakcliff
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Button variant="outline" size="sm">
            <Instagram className="mr-2 h-4 w-4" />
            View All Posts
          </Button>
        </div>
      </section>

      {/* Sign Up Button */}
      <Button className="fixed bottom-4 right-4">Sign Up</Button>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2023 Chef Margaret Alvis. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-gray-600 hover:text-gray-900" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
