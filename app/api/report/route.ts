import { NextResponse } from "next/server"
import { generatePDF } from "@/services/pdf"
import { randomUUID } from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { answers, bcScore, nsScore, summary } = await req.json()

    // 1️⃣ Generate PDF in memory (no file system needed)
    const pdfBytes = await generatePDF({
      answers,
      bcScore,
      nsScore,
      summary,
    })

    const pdfBuffer = Buffer.from(pdfBytes)

    // 2️⃣ Generate reportId for tracking (optional)
    const reportId = `report-${randomUUID()}.pdf`

    // 3️⃣ Return PDF directly from memory - NO file system writes
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=assessment-summary.pdf",
        "X-REPORT-ID": reportId,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}