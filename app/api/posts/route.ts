import { NextResponse } from "next/server";
import { createAnonymousClient } from "@/utils/supabaseHelpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = createAnonymousClient();

  if (!supabase) {
    return NextResponse.json({ items: [] });
  }

  const from = Number(searchParams.get("page") || 0);

  // pull posts from supabase
  const { data, error } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false })
    .range(from, from + 6);

  if (error) {
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json({
    items: data || [],
  });
}
