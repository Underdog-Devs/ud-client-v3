import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/database.types";
import { Post } from "@/app/types/blog";
import { SinglePost } from "./SinglePost";

export async function generateStaticParams() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data } = await supabase
    .from("posts")
    .select()
    .order("created_at", { ascending: false });

  const items = data || [];

  return items.map((post) => ({
    title: post.title.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\s-]/g, ""),
    id: post.id,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { title: string; id: string };
}) {
  const id = params.id as string;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/post/${id}`
    );

    if (!response.ok) {
      throw new Error("Post not found");
    }

    const data: {
      post: Post | null;
      authorName: string | null;
    } = await response.json();

    if (!data.post || !data.authorName) {
      throw new Error("Post not found");
    }

    return <SinglePost post={data.post} authorName={data.authorName} />;
  } catch (error) {
    console.log(error);
    return <div>Post not found</div>;
  }
}
