
import { NextResponse } from "next/server";
import { calculateScoreWithSummary } from "@/services/scoring/scoreWithSummary";
import { mapAnswersForScoring } from "@/services/scoring/mapAnswers";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { answers } = await req.json();
  console.log("aanswers  ************",answers)

  if (!answers) {
    return NextResponse.json(
      { error: "answers are required" },
      { status: 400 }
    );
  }
  const mappedAnswers = mapAnswersForScoring(answers);
  console.log("mapped answeeers", mappedAnswers)
  const result = await calculateScoreWithSummary(mappedAnswers);

  return NextResponse.json(result);
}
