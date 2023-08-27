import "./index.scss";
import { BlogPosts } from "../../components/blog/BlogPosts";
import type { Post } from "@/app/types/blog";

export default async function PostsPage() {
  async function fetchPosts(): Promise<Post[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    return data.items;
  }
  const items = await fetchPosts();
  return <BlogPosts initialPosts={items} />;
}
