import "./index.scss";
import { BlogPosts } from "../../components/blog/BlogPosts";
import type { Post } from "@/app/types/blog";

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts`, {
    cache: "no-store",
  });
  const data = await response.json();
  return data.items;
}

export default async function PostsPage() {
  const items = await fetchPosts();
  return <BlogPosts initialPosts={items} />;
}
