'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col h-[85vh] bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-border px-6 py-5 bg-secondary/5">
          <h1 className="text-2xl font-bold text-foreground">Immigration Assessment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer a few questions to get started
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {currentQuestion ? (
            <div className="flex justify-start">
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-6 py-4 max-w-[85%]">
                <p className="leading-relaxed text-foreground text-lg">
                  {currentQuestion}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
                </div>
                <p className="text-muted-foreground">Loading question…</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border px-6 py-4 bg-secondary/5">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              placeholder="Type your answer..."
              disabled={loading}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !inputValue.trim()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
              ) : (
                <Send size={20} />
              )}
              <span className="hidden sm:inline">{loading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
