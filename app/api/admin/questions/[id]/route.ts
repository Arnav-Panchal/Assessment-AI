// app/api/admin/questions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(req: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const { text } = await req.json();

    // Unwrap params if it is a Promise
    const params = await context.params;
    const id = parseInt(params.id, 10);

    if (!text || !id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await query("UPDATE questions SET question_text = $1 WHERE id = $2", [text, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
