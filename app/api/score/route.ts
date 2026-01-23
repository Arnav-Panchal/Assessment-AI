// import { calculateBC } from "@/services/scoring/bc";
// import { calculateNS } from "@/services/scoring/ns";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { answers } = await req.json();

//   return NextResponse.json({
//     bcScore: calculateBC(answers),
//     nsScore: calculateNS(answers)
//   });
// }
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
