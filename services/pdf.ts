
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generatePDF(data: {
  answers: any;
  bcScore: number;
  nsScore: number;
  summary: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  // Title
  page.drawText("Immigration Assessment Summary", {
    x: 50,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.3, 0.6),
  });

  y -= 40;

  // Scores
  page.drawText(`British Columbia Score: ${data.bcScore}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  y -= 20;

  page.drawText(`Nova Scotia Score: ${data.nsScore}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  y -= 40;

  // Summary Section
  page.drawText("Assessment Summary", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
  });

  y -= 20;

  const lines = data.summary.match(/.{1,90}/g) || [];
  for (const line of lines) {
    page.drawText(line, {
      x: 50,
      y,
      size: 11,
      font,
    });
    y -= 15;
  }

  y -= 30;

  // Answers
  page.drawText("Applicant Information", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
  });

  y -= 20;

  for (const [key, value] of Object.entries(data.answers)) {
    page.drawText(`${key}: ${value}`, {
      x: 50,
      y,
      size: 10,
      font,
    });
    y -= 14;
  }

  return await pdfDoc.save();
}

// import { PDFDocument, StandardFonts } from "pdf-lib";

// export async function generatePDF(data: {
//   answers: any;
//   bcScore: number;
//   nsScore: number;
// }) {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   const { width, height } = page.getSize();
//   let y = height - 40;

//   page.drawText("Immigration Eligibility Assessment Summary", {
//     x: 40,
//     y,
//     size: 14,
//     font,
//   });

//   y -= 30;

//   page.drawText(`BC Score: ${data.bcScore}`, { x: 40, y, size: 12, font });
//   y -= 20;
//   page.drawText(`Nova Scotia Score: ${data.nsScore}`, {
//     x: 40,
//     y,
//     size: 12,
//     font,
//   });

//   y -= 30;
//   page.drawText("Applicant Answers:", { x: 40, y, size: 12, font });
//   y -= 20;

//   for (const [key, value] of Object.entries(data.answers)) {
//     page.drawText(`${key}: ${value}`, { x: 40, y, size: 10, font });
//     y -= 15;
//   }

//   return await pdfDoc.save();
// }
