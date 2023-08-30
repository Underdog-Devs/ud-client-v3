"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "next/image";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Image as TipTapImage } from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { BsTwitter, BsFacebook } from "react-icons/bs";
import styles from "./blog.module.scss";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";
import { Post } from "@/app/types/blog";

export const dynamic = "force-dynamic";

const PostPage = () => {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClientComponentClient();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState("Loading...");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const twitterText = (postTitle: string, postId: string) => {
    return `${postTitle} \n
		http://www.underdogdevs.org/blog/${postId}
		`;
  };

  const editor = useEditor({
    editable: false,
    content: "",
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      TipTapImage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
  });

  // Once the editor and supabse are ready, load the post
  useEffect(() => {
    getPost();
  }, [supabase, editor]);

  // once the post is loaded, get the author
  useEffect(() => {
    if (post) {
      getAuthor();
      getImage(post.image);
    }
  }, [post]);

  async function getPost() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/posts/${id}`
      );
      const data: { post: Post } = await response.json();

      if (data && editor) {
        setPost(data.post);
        editor!.commands.setContent(data.post.entry);
      }
    } catch (error) {
      setPost(null);
    }
  }

  async function getAuthor() {
    if (post) {
      const { data, error } = await supabase
        .from("authors")
        .select("name")
        .eq("id", post.author)
        .single();

      if (error) {
        setAuthor("Unknown");
        return;
      }

      setAuthor(data.name);
    }
  }

  async function getImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .download(path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error) {
      console.log("Problem fetching image in /blog/[title]");
    }
  }

  if (post) {
    const { title, created_at } = post;
    const displayDate = created_at?.substring(0, 10);

    const postLink = `/blog/${title
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\s-]/g, "")}/${id}`;

    if (!editor) {
      return null;
    }

    return (
      <div className={styles.container}>
        <Head>
          <title>{title ?? "Loading..."}</title>
          <meta property="og:title" content={title ?? "Loading..."} />
          <meta
            property="og:image"
            content={
              imageUrl ?? "https://www.underdogdevs.org/images/fallback.png"
            }
          />
          <meta
            property="og:description"
            content="UnderdogDevs is a group of software engineers supporting formerly incarcerated and disadvantaged aspiring developers"
          />
          <meta
            property="og:url"
            content={`http://www.underdogdevs.org${postLink}`}
          />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="UnderdogDevs" />
          <meta property="article:published_time" content={created_at} />
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content="Technology" />
          <meta property="article:tag" content="Software Engineering" />
          <meta property="article:tag" content="Software Development" />
          <meta property="article:tag" content="Software" />
          <meta property="article:tag" content="Programming" />
          <meta property="article:tag" content="Programming Languages" />
          <meta property="article:tag" content="Web Development" />
          <meta property="article:tag" content="Web Developer" />
        </Head>
        <header className={styles.header}>
          <Link passHref href="/blog">
            Back
          </Link>

          <h3>{title ?? "Loading..."}</h3>

          <ul className={styles.socialContainer}>
            <p>Share</p>
            {title && (
              <li>
                <a
                  href={`https://twitter.com/intent/tweet?text=${twitterText(
                    title,
                    id
                  )}`}
                >
                  <BsTwitter style={{ color: "#1D9BF0", cursor: "pointer" }} />
                </a>
              </li>
            )}
            <li>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=http://www.underdogdevs.org/blog/${id}`}
              >
                <BsFacebook style={{ color: "#1B74E4", cursor: "pointer" }} />
              </a>
            </li>
          </ul>
        </header>
        <Image
          width={600}
          height={600}
          className={styles.img}
          src={imageUrl ?? "/images/fallback.png"}
          alt={imageUrl ? "Post image" : "Post image not found"}
          style={{ objectFit: "contain" }}
          loading="lazy"
        />
        <EditorContent className={styles.blogText} editor={editor} />

        <div className={styles.blogMain}>
          <section className={styles.blogInfo}>
            <div className={styles.blogAuthor}>
              <p className={styles.blogAuthorName}>Written by {author}</p>
            </div>
            <p>PUBLISHED ON {displayDate}</p>
          </section>
        </div>
      </div>
    );
  } else {
    return <p>Error Loading page</p>;
  }
};

export default PostPage;
