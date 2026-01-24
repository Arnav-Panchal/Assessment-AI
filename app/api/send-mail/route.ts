import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generatePDF } from "@/services/pdf";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { to, answers, bcScore, nsScore, summary } = await req.json();

    if (!to || !answers || bcScore == null || nsScore == null || !summary) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const pdfBytes = await generatePDF({ answers, bcScore, nsScore, summary });
    const pdfBuffer = Buffer.from(pdfBytes);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your Assessment Report",
      text: "Please find your assessment report attached.",
      attachments: [
        { filename: "assessment-report.pdf", content: pdfBuffer },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Send-email failed:", err);
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 });
  }
}
