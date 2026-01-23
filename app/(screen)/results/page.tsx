export default async function ResultsPage({ searchParams }: { searchParams: { data: string } }) {
    if (!searchParams.data) return <p>No data submitted</p>
  
    const answers = JSON.parse(decodeURIComponent(searchParams.data))
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
    const scores = await res.json()
  
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white border rounded p-6 w-full max-w-md shadow space-y-4">
          <h1 className="text-2xl font-bold">Your Scores</h1>
          <p>🇨🇦 BC Entrepreneur Score: <strong>{scores.bcScore}</strong></p>
          <p>🇨🇦 Nova Scotia Entrepreneur Score: <strong>{scores.nsScore}</strong></p>
          <a
            href={`/report?data=${encodeURIComponent(JSON.stringify(answers))}`}
            className="block text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Get PDF Report
          </a>
        </div>
      </main>
    )
  }
  