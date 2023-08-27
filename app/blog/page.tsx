import "./index.scss";
import { BlogPosts } from "../../components/blog/BlogPosts";
import type { Post } from "@/app/types/blog";

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`/api/posts`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json();
  return data.items;
}

export default async function PostsPage() {
  const items = await fetchPosts();
  if (items) {
    return <BlogPosts initialPosts={items} />;
  }
}
