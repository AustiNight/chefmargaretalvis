import Services from "@/components/Services"

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>
      <p className="text-lg mb-8">
        Chef Margaret offers a variety of culinary services to meet your needs. From private dinners to cooking classes,
        catering, and consultations, she brings her expertise and passion to every event.
      </p>
      <Services />
    </div>
  )
}
