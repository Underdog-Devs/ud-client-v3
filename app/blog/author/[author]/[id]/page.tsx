import { BlogPosts } from "@/components/blog/BlogPosts";
import "@/app/blog/index.scss";
import type { Post } from "@/app/types/blog";

async function fetchPosts(id: string): Promise<Post[]> {
  // Revalidates after 15 minutes
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts/author`,
    {
      next: { revalidate: 900 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    }
  );
  const data: { items: Post[] } = await response.json();
  return data?.items || [];
}
export default async function PostsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const items = await fetchPosts(id);
  if (items.length) {
    return <BlogPosts initialPosts={items} authorPage={true} id={id} />;
  }
  return <BlogPosts initialPosts={[]} authorPage={true} id={id} />;
}
