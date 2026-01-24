'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Send } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!password.trim()) {
      setError('Please enter a password')
      return
    }

    setLoading(true)
    setError('')

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        // Store auth state in memory instead of localStorage
        sessionStorage.setItem('adminLoggedIn', 'true')
        router.push('/dashboard')
      } else {
        setError('Incorrect password')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col h-[85vh] bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-border px-6 py-5 bg-secondary/5">
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your password to access the dashboard
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <div className="flex justify-start">
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-6 py-4 max-w-[85%]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Lock size={20} className="text-accent" />
                </div>
                <p className="leading-relaxed text-foreground text-lg font-medium">
                  Authentication Required
                </p>
              </div>
              <p className="leading-relaxed text-foreground text-lg">
                Please enter your admin password to continue. This area is protected and requires proper authentication.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex justify-start">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-4 max-w-[85%]">
                <p className="leading-relaxed text-red-500 text-lg">
                  {error}
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
                </div>
                <p className="text-muted-foreground">Authenticating...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border px-6 py-4 bg-secondary/5">
          <div className="flex gap-3">
            <input
              type="password"
              className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleLogin()}
              placeholder="Enter admin password..."
              disabled={loading}
            />

            <button
              onClick={handleLogin}
              disabled={loading || !password.trim()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
              ) : (
                <Send size={20} />
              )}
              <span className="hidden sm:inline">{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}