import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { addToCart, listCartItems } from "@/lib/cart";
import { getCourseById } from "@/lib/courses";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to view your cart." }, { status: 401 });
  }

  try {
    const items = listCartItems(user.id);
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    return NextResponse.json({ items, subtotal });
  } catch (err) {
    console.error("Cart list error:", err);
    return NextResponse.json({ error: "Unable to load your cart right now." }, { status: 500 });
  }
}

const addSchema = z.object({ courseId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to add items to your cart." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A course ID is required." }, { status: 400 });
  }

  const course = getCourseById(parsed.data.courseId);
  if (!course) {
    return NextResponse.json({ error: "That course could not be found." }, { status: 404 });
  }

  try {
    addToCart(user.id, parsed.data.courseId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ error: "Unable to add this to your cart right now." }, { status: 500 });
  }
}
