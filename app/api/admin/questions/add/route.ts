import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { question_text, program } = await req.json();

    if (!question_text || question_text.trim() === "") {
      return NextResponse.json(
        { error: "Question text is required" },
        { status: 400 }
      );
    }

    const res = await query(
      "INSERT INTO questions (question_text, program) VALUES ($1, $2) RETURNING id, question_text, program",
      [question_text, program || "all"]
    );

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error("Add Question Error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
