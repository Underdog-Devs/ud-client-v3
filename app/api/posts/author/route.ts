import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const from = Number(searchParams.get("page") || 0);

  // pull posts from supabase
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("author", id)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from || 0, from || 0 + 6);

  if (error) {
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json({
    items: data,
  });
}
