import { calculateBC } from "@/services/scoring/bc";
import { calculateNS } from "@/services/scoring/ns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answers } = await req.json();

  return NextResponse.json({
    bcScore: calculateBC(answers),
    nsScore: calculateNS(answers)
  });
}
