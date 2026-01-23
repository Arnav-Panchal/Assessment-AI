export default async function ResultsPage({
    searchParams,
  }: {
    searchParams: Promise<{ data?: string }>
  }) {
    const params = await searchParams
  
    if (!params?.data) {
      return <p>No data submitted</p>
    }
  
    const answers = JSON.parse(decodeURIComponent(params.data))
  
    const res = await fetch(
      `http://localhost:3000/api/score`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
        cache: 'no-store',
      }
    )
  
    const scores = await res.json()
  
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl  font-bold mb-4">Results</h1>
        <pre className="bg-black p-4 rounded">
          {JSON.stringify(scores, null, 2)}
        </pre>
      </div>
    )
  }
  