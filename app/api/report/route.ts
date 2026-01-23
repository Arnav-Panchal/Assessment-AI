import { NextResponse } from "next/server";
import { generatePDF } from "@/services/pdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { answers, bcScore, nsScore, summary } = await req.json();

  const pdfBytes = await generatePDF({
    answers,
    bcScore,
    nsScore,
    summary,
  });

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=assessment-summary.pdf",
    },
  });
}

// import { NextResponse } from "next/server";
// import { generatePDF } from "@/services/pdf";

// export async function POST(req: Request) {
//   const body = await req.json();

//   const pdfBytes = await generatePDF({
//     answers: body.answers,
//     bcScore: body.bcScore,
//     nsScore: body.nsScore,
//   });

//   return new NextResponse(pdfBytes, {
//     headers: {
//       "Content-Type": "application/pdf",
//       "Content-Disposition": "attachment; filename=assessment-summary.pdf",
//     },
//   });
// }