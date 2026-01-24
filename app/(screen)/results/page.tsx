import Link from "next/link"

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) {
  const params = await searchParams

  if (!params?.data) {
    return <p className="text-center mt-10 text-gray-400">No data submitted</p>
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
    <div className="relative min-h-screen bg-gray-950 text-white pb-24">
      {/* Content */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Assessment Results
        </h1>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-800 rounded-lg p-5 bg-gray-900">
            <h2 className="text-lg font-semibold">
              British Columbia Program
            </h2>
            <p className="text-4xl font-bold mt-2 text-blue-400">
              {bcScore}
            </p>
            <p className="text-sm text-gray-400">Total Points</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-5 bg-gray-900">
            <h2 className="text-lg font-semibold">
              Nova Scotia Program
            </h2>
            <p className="text-4xl font-bold mt-2 text-green-400">
              {nsScore}
            </p>
            <p className="text-sm text-gray-400">Total Points</p>
          </div>
        </div>

        {/* Summary */}
        <div className="border border-gray-800 rounded-lg p-5 bg-gray-900">
          <h2 className="text-lg font-semibold mb-2">
            Summary
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/report?data=${encodedReportData}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg text-lg">
              Get Your Report
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}