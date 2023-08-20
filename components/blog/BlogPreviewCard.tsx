"use client";
import Link from "next/link";
import Image from "next/image";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Image as TipTapImage } from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import styles from "./blogPreviewCard.module.scss";
import type { Post } from "@/app/types/blog";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Props = {
  post: Post;
};

export function BlogPreviewCard(props: Props) {
  const { id, title, first_paragraph, author, created_at, entry, image } = props.post;
  const [name, setName] = useState("");
  const supabase = createClientComponentClient();
  useEffect(() => {
    if (supabase) {
      getAuthor();
    }
  }, [supabase]);
  async function getAuthor() {
    const { data, error } = await supabase
      .from("authors")
      .select("name")
      .eq("id", author)
      .single();
    setName(data?.name || "Underdog Admin");
  }

  function truncateString(postTitle: string) {
    let shortendTitle;
    if (postTitle.length > 70) {
      shortendTitle = `${postTitle.slice(0, 70)}...`;
      return shortendTitle;
    }
    return postTitle;
  }

  const editor = useEditor({
    editable: false,
    content: entry,
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

  if (!editor) {
    return null;
  }

  const dateObj = new Date(created_at);
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const parsedDate = `${month}/${day}/${year}`;
  const postLink = title
    ? `/blog/${title.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\s-]/g, "")}/${id}`
    : "title";
  const authorLink = author?.replace(/\s/g, "-");

  return (
    <div className={styles.container}>
      <Link href={postLink}>
        {image ? (
          <img className={styles.img} src={image} alt="Featured" loading="lazy" />
        ) : (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Image src="/images/fallback.png" width="313" height="243" priority={true} alt={""} />
          </div>
        )}
      </Link>
      <div className={styles.cardTextContainer}>
        <h4 className={styles.title}>
          <Link href={postLink}>{truncateString(title)}</Link>
        </h4>
        <Link href={postLink} passHref className={styles.textContent}>
          {first_paragraph}
        </Link>
        <div className={styles.info}>
          <span>
            By{" "}
            <Link href={`/blog/author/${authorLink}`} passHref className={styles.author}>
              {name}
            </Link>
          </span>
          <span>{parsedDate}</span>
        </div>
      </div>
    </div>
  );
}
