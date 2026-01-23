import { NextResponse } from "next/server";
import { generateScoreSummary } from "@/services/scoreSummary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { bcScore, nsScore } = await req.json();

  if (bcScore === undefined || nsScore === undefined) {
    return NextResponse.json(
      { error: "bcScore and nsScore are required" },
      { status: 400 }
    );
  }

  const summary = await generateScoreSummary({
    bcScore,
    nsScore,
  });

  return NextResponse.json({ summary });
}
