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
import { formatTextForSlug } from "@/utils/slug";

type Props = {
  post: Post;
};

export function BlogPreviewCard(props: Props) {
  const { id, title, first_paragraph, author, created_at, entry, image } =
    props.post;
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  useEffect(() => {
    if (supabase) {
      getAuthor();
      if (image) getImage(image);
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
  const postLink = title ? `/blog/${formatTextForSlug(title)}/${id}` : "title";

  return (
    <div className={styles.container}>
      <Link href={postLink}>
        <Image
          width={600}
          height={600}
          className={styles.img}
          src={imageUrl ?? "/images/fallback.png"}
          alt={imageUrl ? "Post image" : "Post image not found"}
          style={{ objectFit: "contain" }}
          loading="lazy"
        />
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
            <Link
              href={`/blog/author/${formatTextForSlug(name)}/${author}`}
              passHref
              className={styles.author}
            >
              {name}
            </Link>
          </span>
          <span>{parsedDate}</span>
        </div>
      </div>
    </div>
  );
}
