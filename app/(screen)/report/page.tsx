export default async function ReportPage({ searchParams }: { searchParams: { data: string } }) {
    if (!searchParams.data) return <p>No data provided</p>
  
    const answers = JSON.parse(decodeURIComponent(searchParams.data))
  
    // Call backend report API
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
  
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white border rounded p-6 w-full max-w-md shadow space-y-4 text-center">
          <h1 className="text-2xl font-bold">Report Generated</h1>
          <p>The assessment summary has been sent to your email as a PDF.</p>
        </div>
      </main>
    )
  }
  