import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
      },
      { status: 503 }
    );
  }
}
