// This is a server component version of the home page for testing
export default function SimplePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Chef Margaret Alvis</h1>
      <p className="text-xl mb-8">Private Chef Services in Oak Cliff, Texas</p>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="mb-4">
          Welcome to Chef Margaret Alvis's website. This is a simplified version of the home page for troubleshooting.
        </p>
        <p>
          If you're seeing this page, it means the server component is rendering correctly, but there might be issues
          with client components.
        </p>
      </div>
    </div>
  )
}
