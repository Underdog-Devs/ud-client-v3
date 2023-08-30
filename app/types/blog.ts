export type Post = {
  id: string;
  created_at: string;
  author: string;
  title: string;
  image: string;
  entry: any;
  first_paragraph: string;
};

export type Author = {
  id: string;
  created_at: string | null;
  name: string | null;
  email: string;
  image: string | null;
  user_type: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  token: string | null;
  update_at: string | null;
  user_id: string | null;
};
