import "./index.scss";
import { BlogPosts } from "../../components/blog/BlogPosts";
import type { Post } from "@/app/types/blog";

export default async function PostsPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts`,
    { cache: "no-cache" }
  );

  const data: { items: Post[] } = await response.json();

  const items = data?.items || [];

  return <BlogPosts initialPosts={items} />;
}
