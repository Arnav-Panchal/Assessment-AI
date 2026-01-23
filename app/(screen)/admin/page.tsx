import Link from "next/link"

export default async function AdminPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="space-y-4">
        <Link href="/admin/prompts" className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Edit System Prompts
        </Link>
        <Link href="/admin/questions" className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          Edit Question Text
        </Link>
        <Link href="/admin/submissions" className="block w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
          View Submissions
        </Link>
      </div>
    </main>
  )
}
