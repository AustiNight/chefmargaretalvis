import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/" className="text-xl font-bold">
              Chef Margaret Alvis
            </Link>
          </li>
          <li>
            <ul className="flex space-x-4">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/services">Services</Link>
              </li>
              <li>
                <Link href="/instagram">Instagram</Link>
              </li>
              <li>
                <Link href="/contact">Contact & Booking</Link>
              </li>
              <li>
                <Link href="/gift-certificates">Gift Certificates</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  )
}
