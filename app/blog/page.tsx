import "./index.scss";
import { BlogPosts } from "../../components/blog/BlogPosts";
import type { Post } from "@/app/types/blog";

// when in development, force dynamic SSR
export const dynamic =
  process.env.NODE_ENV === "development" ? "force-dynamic" : "auto";

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
  if (items) {
    return <BlogPosts initialPosts={items} />;
  }
}
