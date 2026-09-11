export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Resource = {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string | null;
  category_id: string | null;
  file_path: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  thumbnail_path: string | null;
  youtube_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
};

export type DownloadEvent = {
  id: string;
  resource_id: string;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
};
