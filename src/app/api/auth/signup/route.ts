import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations";
import { createSession, createUser, findUserByEmail, hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check your details and try again." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = createUser(name, email, passwordHash);
    const session = createSession(user.id);
    await setSessionCookie(session.id, session.expiresAt);

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong while creating your account. Please try again." },
      { status: 500 }
    );
  }
}
