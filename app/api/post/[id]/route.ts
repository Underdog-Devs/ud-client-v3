import { NextRequest, NextResponse } from "next/server";
import {
  SupabaseClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/database.types";
import { cache } from "react";

// export const createServerClient = cache(() => {
//   const cookieStore = cookies();
//   return createRouteHandlerClient<Database>({
//     cookies: () => cookieStore,
//   });
// });

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient<Database>({ cookies });

  if (!supabase) {
    return NextResponse.json({ post: {} });
  }

  // pull posts from supabase
  const post = await getPost(id, supabase);
  // get author name from author id on post
  const authorName = await getAuthorName(post?.author, supabase);

  return NextResponse.json({
    post,
    authorName,
  });
}

async function getPost(id: string, supabase: SupabaseClient<Database>) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("Problem fetching post in /blog/[title]\nError: ", error);
    }
    return null;
  }
}

async function getAuthorName(
  id: string | null | undefined,
  supabase: SupabaseClient<Database>
) {
  if (!id) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("authors")
      .select("name")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data.name;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Problem fetching author name in /blog/[title]\nError: ",
        error
      );
    }
    return null;
  }
}
