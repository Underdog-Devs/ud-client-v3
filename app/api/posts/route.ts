import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = createServerActionClient({ cookies })
  const from = Number(searchParams.get("page") || 0);
  
  const { data: pages } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false })
    .range(from, from + 6);
  return NextResponse.json({
    items: pages,
  });
}
