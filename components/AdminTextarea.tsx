'use client'
import { useState } from "react"

export default function AdminTextarea({ prompt }: { prompt: { id: string; content: string } }) {
  const [content, setContent] = useState(prompt.content)

  async function handleUpdate() {
    try {
      const res = await fetch(`/api/admin/prompts/${prompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (!res.ok) throw new Error('Failed to update prompt')

      alert('Prompt updated successfully')
    } catch (err) {
      console.error(err)
      alert('Error updating prompt')
    }
  }

  return (
    <div className="mb-4">
      {/* ✅ Accessible label */}
      <label htmlFor={`prompt-${prompt.id}`} className="block font-medium text-gray-700 mb-1">
        Edit Prompt
      </label>
      <textarea
        id={`prompt-${prompt.id}`}             // linked to label
        className="w-full border px-3 py-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter prompt text here"   // optional hint
        rows={4}
      />
      <button
        onClick={handleUpdate}
        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
      >
        Update
      </button>
    </div>
  )
}
