import { NextResponse } from "next/server";
import { createAnonymousClient } from "@/utils/supabaseHelpers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createAnonymousClient();

  if (!supabase) {
    return NextResponse.json({ post: {} });
  }

  // pull posts from supabase
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ post: {} });
  }

  return NextResponse.json({
    post: data,
  });
}
