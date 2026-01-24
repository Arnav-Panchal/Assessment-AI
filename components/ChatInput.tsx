'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatInput() {
  const router = useRouter()

  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchNextQuestion(updatedAnswers: any, lastAnswer?: string) {
    try {
      setLoading(true)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: updatedAnswers, lastAnswer }),
      })

      const data = await res.json()

      if (data.done) {
        if (Object.keys(updatedAnswers).length === 0) return

        router.push(
          `/results?data=${encodeURIComponent(
            JSON.stringify(updatedAnswers)
          )}`
        )
        return
      }

      setCurrentQuestion(data.question)
      setCurrentKey(data.key)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNextQuestion({})
  }, [])

  async function handleSubmit() {
    if (!currentKey || !inputValue.trim() || loading) return

    const updatedAnswers = { ...answers, [currentKey]: inputValue }
    setAnswers(updatedAnswers)
    setInputValue('')

    await fetchNextQuestion(updatedAnswers, inputValue)
  }

  return (
    <div className="min-h-[80vh] max-w-4xl mx-auto bg-zinc-900 text-white rounded-2xl shadow-xl flex flex-col">
      
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 text-lg font-semibold">
        Immigration Assessment Bot
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {currentQuestion ? (
          <div className="flex">
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 max-w-[85%]">
              <p className="leading-relaxed text-zinc-100">
                {currentQuestion}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-zinc-400">Loading question…</p>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 flex gap-3">
        <input
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type your answer..."
          disabled={loading}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
