'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download, Mail, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react'

// ✅ Separate component that uses useSearchParams
function ReportContent() {
  const searchParams = useSearchParams()

  // status of PDF generation
  const [status, setStatus] = useState<'generating' | 'success' | 'error'>('generating')

  // PDF URL to display and download
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const pdfUrlRef = useRef<string | null>(null) // ✅ store PDF URL for cleanup

  // report data
  const [answers, setAnswers] = useState<any>(null)
  const [bcScore, setBcScore] = useState<number | null>(null)
  const [nsScore, setNsScore] = useState<number | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  // email state
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const data = searchParams.get('data')

    // ✅ handle missing query param gracefully
    if (!data) return setStatus('error')

    const generateReport = async () => {
      try {
        // ✅ parse report data from query string
        const parsed = JSON.parse(decodeURIComponent(data))
        const { answers, bcScore, nsScore, summary } = parsed

        setAnswers(answers)
        setBcScore(bcScore)
        setNsScore(nsScore)
        setSummary(summary)

        // ✅ fetch report PDF from internal API
        const response = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, bcScore, nsScore, summary }),
        })

        if (!response.ok) throw new Error('Failed to generate report')

        // ✅ create object URL for PDF
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        pdfUrlRef.current = url // store in ref for cleanup
        setPdfUrl(url)

        setStatus('success')
      } catch (err) {
        console.error(err)
        setStatus('error')
      }
    }

    generateReport()

    // ✅ cleanup PDF object URL on unmount
    return () => {
      if (pdfUrlRef.current) window.URL.revokeObjectURL(pdfUrlRef.current)
    }
  }, [searchParams])

  // ✅ download PDF
  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'assessment-report.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // ✅ send PDF via email
  const handleSendEmail = async () => {
    if (!email || !answers || bcScore == null || nsScore == null || !summary) return

    try {
      setEmailStatus('sending')

      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, answers, bcScore, nsScore, summary }),
      })

      if (!res.ok) throw new Error('Email failed')

      setEmailStatus('sent')
    } catch (err) {
      console.error(err)
      setEmailStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      {/* Loading state */}
      {status === 'generating' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-8 text-center space-y-4 max-w-md">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Loader2 size={24} className="text-accent animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Generating Your Report</h1>
            <p className="text-muted-foreground">Please wait...</p>
          </div>
        </div>
      )}

      {/* Success state */}
      {status === 'success' && pdfUrl && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="border-b border-border px-6 py-5 bg-secondary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <FileText size={24} className="text-accent" />
                  Your Assessment Report
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and download your immigration assessment
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap"
              >
                <Download size={20} />
                <span>Download PDF</span>
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="p-6">
              <div className="bg-secondary/10 border border-secondary/20 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
                <iframe src={pdfUrl} className="w-full h-full" title="Assessment Report PDF" />
              </div>
            </div>
          </div>

          {/* Email section */}
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="border-b border-border px-6 py-4 bg-secondary/5">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Mail size={20} className="text-accent" />
                Email Report
              </h2>
            </div>
            
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailStatus !== 'idle') setEmailStatus('idle')
                  }}
                  className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
                <button
                  onClick={handleSendEmail}
                  disabled={!answers || emailStatus === 'sending' || emailStatus === 'sent' || !email.trim()}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap ${
                    emailStatus === 'sent' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {emailStatus === 'idle' && (
                    <>
                      <Mail size={20} />
                      <span>Send Email</span>
                    </>
                  )}
                  {emailStatus === 'sending' && (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  )}
                  {emailStatus === 'sent' && (
                    <>
                      <CheckCircle size={20} />
                      <span>Sent!</span>
                    </>
                  )}
                  {emailStatus === 'error' && (
                    <>
                      <XCircle size={20} />
                      <span>Retry</span>
                    </>
                  )}
                </button>
              </div>

              {emailStatus === 'sent' && (
                <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                  <p className="text-green-600 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    Email sent successfully to <b>{email}</b>
                  </p>
                </div>
              )}
              
              {emailStatus === 'error' && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <XCircle size={16} />
                    Failed to send email. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-8 text-center space-y-4 max-w-md">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <XCircle size={24} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Error</h1>
            <p className="text-muted-foreground">Failed to generate report. Please try again.</p>
          </div>
        </div>
      )}
    </main>
  )
}

// ✅ Wrap the component with Suspense
export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-8 text-center space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <Loader2 size={24} className="text-accent animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  )
}