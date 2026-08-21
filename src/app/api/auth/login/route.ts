import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { createSession, findUserByEmail, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check your details and try again." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const session = createSession(user.id);
    await setSessionCookie(session.id, session.expiresAt);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong while signing you in. Please try again." },
      { status: 500 }
    );
  }
}
