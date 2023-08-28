import "./index.scss";
import { BlogPosts } from "../../components/blog/BlogPosts";
import type { Post } from "@/app/types/blog";

// when in development, force dynamic SSR
export const dynamic = "force-dynamic";

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts`,
    { next: { revalidate: 3600 } }
  );
  const data: { items: Post[] } = await response.json();
  return data?.items || [];
}

export default async function PostsPage() {
  const items = await fetchPosts();
  if (items.length) {
    return <BlogPosts initialPosts={items} />;
  }
  return <BlogPosts initialPosts={[]} />;
}
