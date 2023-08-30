import { NextResponse } from "next/server";
import { createAnonymousClient } from "@/utils/supabaseHelpers";

// when in development, force dynamic SSR
export const dynamic =
  process.env.NODE_ENV === "development" ? "force-dynamic" : "auto";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // maybe use the createClent function from @supabase/supabase-js to avoid using cookies?
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
