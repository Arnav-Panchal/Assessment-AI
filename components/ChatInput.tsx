'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatInput() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  // ✅ Fetch next question function
  async function fetchNextQuestion(updatedAnswers: any) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: updatedAnswers })
      })
      const data = await res.json()

      if (data.done) {
        if (Object.keys(updatedAnswers).length === 0) return
      
        router.push(
          `/results?data=${encodeURIComponent(JSON.stringify(updatedAnswers))}`
        )
        return
      }
      

      setCurrentQuestion(data.question)
      setCurrentKey(data.key)
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ Use effect correctly
  useEffect(() => {
    const init = async () => {
      await fetchNextQuestion({})
    }
    init()
  }, [])

  async function handleSubmit() {
    if (!currentKey || !inputValue.trim()) return

    const updatedAnswers = { ...answers, [currentKey]: inputValue }
    setAnswers(updatedAnswers)
    setInputValue('')

    await fetchNextQuestion(updatedAnswers)
  }

  return (
    <div className="space-y-4">
      {currentQuestion ? (
        <>
          <p className="text-gray-700">{currentQuestion}</p>
          <input
            className="w-full border px-3 py-2 rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your answer"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  )
}
