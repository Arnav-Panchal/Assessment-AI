import { NextResponse } from "next/server"
import { generatePDF } from "@/services/pdf"
import fs from "fs"
import path from "path"
import { randomUUID } from "crypto"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const { answers, bcScore, nsScore, summary } = await req.json()

  // 1️⃣ Generate PDF
  const pdfBytes = await generatePDF({
    answers,
    bcScore,
    nsScore,
    summary,
  })

  const pdfBuffer = Buffer.from(pdfBytes)

  // 2️⃣ Save PDF to tmp folder
  const reportId = `report-${randomUUID()}.pdf`
  const tmpDir = path.join(process.cwd(), "tmp")

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir)
  }

  const filePath = path.join(tmpDir, reportId)
  fs.writeFileSync(filePath, pdfBuffer)

  // 3️⃣ Return PDF + reportId header
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=assessment-summary.pdf",
      "X-REPORT-ID": reportId,
    },
  })
}
