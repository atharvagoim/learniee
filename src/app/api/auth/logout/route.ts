import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, clearSessionCookie, deleteSession } from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    deleteSession(sessionId);
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
