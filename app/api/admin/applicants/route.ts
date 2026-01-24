// app/api/admin/applicants/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    console.log("running 1")
    const res = await query("SELECT * FROM applicants ORDER BY id ASC");
    console.log("running 2")
    return NextResponse.json(res.rows ?? []); // <-- always return array
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error", rows: [] }, { status: 500 });
  }
}


