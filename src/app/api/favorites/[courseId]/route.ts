import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { removeFavorite } from "@/lib/favorites";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to manage favorites." }, { status: 401 });
  }

  const { courseId } = await params;
  if (!courseId) {
    return NextResponse.json({ error: "A course ID is required." }, { status: 400 });
  }

  try {
    removeFavorite(user.id, courseId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Remove favorite error:", err);
    return NextResponse.json({ error: "Unable to remove this favorite right now." }, { status: 500 });
  }
}
