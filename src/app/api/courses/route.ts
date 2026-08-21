import { NextRequest, NextResponse } from "next/server";
import { courseQuerySchema } from "@/lib/validations";
import { queryCourses } from "@/lib/courses";
import { getCurrentUser } from "@/lib/auth";
import { getFavoritedIds } from "@/lib/favorites";
import { getCartIds } from "@/lib/cart";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());

  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== "") cleaned[key] = value;
  }

  const parsed = courseQuerySchema.safeParse(cleaned);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search or filter parameters." },
      { status: 400 }
    );
  }

  try {
    const result = queryCourses(parsed.data);

    const user = await getCurrentUser();
    if (user && result.courses.length > 0) {
      const courseIds = result.courses.map((c) => c.id);
      const favorited = getFavoritedIds(user.id, courseIds);
      const inCart = getCartIds(user.id, courseIds);
      result.courses = result.courses.map((c) => ({
        ...c,
        isFavorited: favorited.has(c.id),
        isInCart: inCart.has(c.id),
      }));
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Courses query error:", err);
    return NextResponse.json(
      { error: "Unable to load courses right now. Please try again." },
      { status: 500 }
    );
  }
}
