import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// when in development, force dynamic SSR
export const dynamic =
  process.env.NODE_ENV === "development" ? "force-dynamic" : "auto";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

  // pull posts from supabase
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error) {
    return NextResponse.json({ post: {} });
  }

  return NextResponse.json({
    post: data,
  });
}
