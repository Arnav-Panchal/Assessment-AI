import Link from "next/link"
import { Award, FileText } from "lucide-react"

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) {
  const params = await searchParams

  if (!params?.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground text-lg">No data submitted</p>
        </div>
      </div>
    )
  }

  const answers = JSON.parse(decodeURIComponent(params.data))

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
    cache: "no-store",
  })
  
  const { bcScore, nsScore, summary } = await res.json()

  // Create complete data object to pass to report page
  const reportData = {
    answers,
    bcScore,
    nsScore,
    summary
  }

  // Encode the complete data
  const encodedReportData = encodeURIComponent(JSON.stringify(reportData))

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-border px-6 py-5 bg-secondary/5">
          <h1 className="text-2xl font-bold text-foreground">Assessment Results</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your immigration program evaluation
          </p>
        </div>

        {/* Results Area */}
        <div className="px-6 py-8 space-y-6">
          
          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BC Score */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <Award size={20} className="text-accent" />
                <h2 className="text-base font-semibold text-foreground">
                  British Columbia
                </h2>
              </div>
              <p className="text-4xl font-bold text-accent mb-1">
                {bcScore}
              </p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>

            {/* NS Score */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <Award size={20} className="text-accent" />
                <h2 className="text-base font-semibold text-foreground">
                  Nova Scotia
                </h2>
              </div>
              <p className="text-4xl font-bold text-accent mb-1">
                {nsScore}
              </p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-6 py-4">
            <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              Summary
            </h2>
            <p className="text-foreground leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="border-t border-border px-6 py-4 bg-secondary/5">
          <Link href={`/report?data=${encodedReportData}`}>
            <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200">
              <FileText size={20} />
              <span>Get Your Detailed Report</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}