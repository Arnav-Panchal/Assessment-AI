import AdminTextarea from "@/components/AdminTextarea"

export default async function PromptsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/prompts`)
  const prompts = await res.json()

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Edit System Prompts</h1>
      {prompts.map((prompt: any) => <AdminTextarea key={prompt.id} prompt={prompt} />)}
    </main>
  )
}
