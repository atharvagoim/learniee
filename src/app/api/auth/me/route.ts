import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, updateUserName } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

const updateSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
});

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to update your account." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check your details and try again." },
      { status: 400 }
    );
  }

  try {
    const updated = updateUserName(user.id, parsed.data.name);
    if (!updated) {
      return NextResponse.json({ error: "Unable to update your account right now." }, { status: 500 });
    }
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Update account error:", err);
    return NextResponse.json({ error: "Unable to update your account right now." }, { status: 500 });
  }
}
