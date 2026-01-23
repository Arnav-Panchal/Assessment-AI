import { NextResponse } from "next/server";
import { getAllPrompts, upsertPrompt } from "@/services/promptRepo";

export const runtime = "nodejs";

export async function GET() {
  const prompts = await getAllPrompts();
  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  const { program, content } = await req.json();

  if (!program || !content) {
    return NextResponse.json(
      { error: "program and content are required" },
      { status: 400 }
    );
  }

  const prompt = await upsertPrompt(program, content);
  return NextResponse.json(prompt);
}
