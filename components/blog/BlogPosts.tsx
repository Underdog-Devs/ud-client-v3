"use client";
import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { BlogPreviewCard } from "./BlogPreviewCard";
import type { Post } from "@/app/types/blog";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./blogPosts.module.scss";

interface PostsProps {
  initialPosts: Post[];
  authorPage?: boolean;
  id?: string;
}

export const BlogPosts = ({ initialPosts, authorPage, id }: PostsProps) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const fetching = React.useRef(false);
  const [pages, setPages] = React.useState(initialPosts);
  const posts = pages.flatMap((page) => page);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      // Initial screen width
      setScreenWidth(window.innerWidth);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const loadMore = async () => {
    let options;
    if (authorPage) {
      options = {
        next: { revalidate: 900 },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      };
    }
    if (!fetching.current) {
      try {
        fetching.current = true;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts${
            authorPage && "/author"
          }?page=${pageNumber ? pageNumber + 1 : 6}`,
          options
        );
        const data = await response.json();
        setPageNumber(pages.length + data.items.length);
        setPages((prev) => [...prev, ...data.items]);
        if (data.items.length === 0) {
          setHasMore(false);
        }
      } finally {
        fetching.current = false;
      }
    }
  };

  const setGridColumns = () => {
    if (screenWidth < 768) {
      return 1;
    }
    if (screenWidth < 992) {
      return 2;
    }
    return 3;
  };

  return (
    <InfiniteScroll
      hasMore={hasMore}
      pageStart={0}
      loadMore={loadMore}
      loader={
        <span key={0} className="loader">
          Loading ...
        </span>
      }
      element="div"
      className={styles.items}
    >
      <Masonry
        breakpointCols={setGridColumns()}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {posts.map((post) => (
          <BlogPreviewCard post={post} key={post.id} />
        ))}
      </Masonry>
    </InfiniteScroll>
  );
};
