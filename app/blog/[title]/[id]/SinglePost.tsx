"use client";
import React, { useState, useEffect } from "react";
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
import styles from "./SinglePost.module.scss";
import { Post } from "@/app/types/blog";
import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";

export function SinglePost({
  post,
  authorName,
}: {
  post: Post;
  authorName: string;
}) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  // Setup tiptap editor
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

  useEffect(() => {
    if (supabase) getImage(post.image, supabase);
  }, [supabase]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(post.entry);
    }
  }, [editor]);

  // Prepare post data
  const { id, title, created_at } = post;
  const twitterText = `${title} \nhttp://www.underdogdevs.org/blog/${id}`;
  const postLink = `/blog/${title
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\s-]/g, "")}/${id}`;
  const displayDate = created_at?.substring(0, 10);

  if (!editor) {
    return null;
  }

  async function getImage(
    path: string | null | undefined,
    supabase: SupabaseClient<Database>
  ) {
    if (!path) {
      return null;
    }
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .download(path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setImageURL(url);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("Problem fetching image url in SinglePost\nError: ", error);
      }
      setImageURL(null);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta
          property="og:image"
          content={
            imageURL ?? "https://www.underdogdevs.org/images/fallback.png"
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
        <meta property="article:author" content={authorName} />
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
              <a href={`https://twitter.com/intent/tweet?text=${twitterText}`}>
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
        src={imageURL ?? "/images/fallback.png"}
        alt={imageURL ? "Post image" : "Post image not found"}
        style={{ objectFit: "contain" }}
        loading="lazy"
      />
      <EditorContent className={styles.blogText} editor={editor} />

      <div className={styles.blogMain}>
        <section className={styles.blogInfo}>
          <div className={styles.blogAuthor}>
            <p className={styles.blogAuthorName}>Written by {authorName}</p>
          </div>
          <p>PUBLISHED ON {displayDate}</p>
        </section>
      </div>
    </div>
  );
}
