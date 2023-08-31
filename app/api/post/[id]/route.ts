import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });

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
