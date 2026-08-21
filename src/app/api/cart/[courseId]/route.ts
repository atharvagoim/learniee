import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { removeFromCart } from "@/lib/cart";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to manage your cart." }, { status: 401 });
  }

  const { courseId } = await params;
  if (!courseId) {
    return NextResponse.json({ error: "A course ID is required." }, { status: 400 });
  }

  try {
    removeFromCart(user.id, courseId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Remove from cart error:", err);
    return NextResponse.json({ error: "Unable to remove this item right now." }, { status: 500 });
  }
}
