import { NextResponse } from "next/server";
import { getNextQuestion } from "@/services/questionFlow";

export async function POST(req: Request) {
  const { answers } = await req.json();

  const next = getNextQuestion(answers);

  if (!next) {
    return NextResponse.json({ done: true });
  }

  return NextResponse.json({
    done: false,
    question: next.text,
    key: next.key
  });
}
