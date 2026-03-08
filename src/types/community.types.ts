export type PostType = "MILESTONE" | "REFLECTION";

export interface CommunityPost {
  id: string;
  type: PostType;
  content: string;
  tags: string[];
  upvotes: number;
  hasUpvoted?: boolean; // only present when authenticated
  createdAt: string;
}

export interface FeedResponse {
  posts: CommunityPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePostRequest {
  type: PostType;
  content: string;
  tags?: string[];
}

export interface UpvoteResponse {
  postId: string;
  upvotes: number;
  hasUpvoted: boolean;
}
