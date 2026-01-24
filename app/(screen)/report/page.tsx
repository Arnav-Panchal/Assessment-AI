'use client' // 

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ReportPage() {
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
    <main className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Loading state */}
      {status === 'generating' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4 p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <h1 className="text-2xl font-bold">Generating Your Report</h1>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </div>
      )}

      {/* Success state */}
      {status === 'success' && pdfUrl && (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Assessment Report</h1>
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
            >
              Download PDF
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow" style={{ height: 'calc(100vh - 230px)' }}>
            <iframe src={pdfUrl} className="w-full h-full rounded" title="Assessment Report PDF" />
          </div>

          {/* Email section */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mt-4">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailStatus !== 'idle') setEmailStatus('idle')
                }}
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
              />
              <button
                onClick={handleSendEmail}
                disabled={!answers || emailStatus === 'sending' || emailStatus === 'sent'}
                className={`px-6 py-2 rounded font-semibold transition ${emailStatus === 'sent' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50`}
              >
                {emailStatus === 'idle' && 'Send Email'}
                {emailStatus === 'sending' && 'Sending...'}
                {emailStatus === 'sent' && 'Sent! ✅'}
                {emailStatus === 'error' && 'Retry'}
              </button>
            </div>

            {emailStatus === 'sent' && <p className="text-green-400 text-sm mt-2">📧 Email sent successfully to <b>{email}</b></p>}
            {emailStatus === 'error' && <p className="text-red-400 text-sm mt-2">❌ Failed to send email. Try again.</p>}
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-3xl shadow text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p className="text-gray-400">Failed to generate report. Please try again.</p>
          </div>
        </div>
      )}
    </main>
  )
}
