export default function HomePage() {
  console.log("📄 index.tsx page rendering")

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Chef Margaret Alvis</h1>
        <p className="text-xl mb-6">Private Chef Services</p>
        <p>This is from index.tsx</p>
      </div>
    </div>
  )
}
