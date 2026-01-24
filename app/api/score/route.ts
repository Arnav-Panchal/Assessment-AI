
import { NextResponse } from "next/server";
import { calculateScoreWithSummary } from "@/services/scoring/scoreWithSummary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { answers } = await req.json();

  if (!answers) {
    return NextResponse.json(
      { error: "answers are required" },
      { status: 400 }
    );
  }

  const result = await calculateScoreWithSummary(answers);

  return NextResponse.json(result);
}
