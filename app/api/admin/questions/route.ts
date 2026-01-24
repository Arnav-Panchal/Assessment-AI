// app/api/admin/questions/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const res = await query(
      "SELECT id, question_text, program FROM questions ORDER BY id ASC"
    );

    return NextResponse.json(
      res.rows.map((q: any) => ({
        id: q.id,
        key: `q${q.id}`,
        question_text: q.question_text, // ✅ CONSISTENT
        program: q.program,
      }))
    );
  } catch (err) {
    console.error("Questions API error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
