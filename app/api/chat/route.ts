import { NextResponse } from "next/server";
import { getNextQuestion } from "@/services/questionFlow";

export async function POST(req: Request) {
  const body = await req.json();

  // ✅ ALWAYS normalize answers
  const answers =
    typeof body?.answers === "object" && body.answers !== null
      ? body.answers
      : {};

  const next = getNextQuestion(answers);

  if (!next) {
    return NextResponse.json({ done: true });
  }

  return NextResponse.json({
    done: false,
    question: next.text,
    key: next.key,
  });
}
