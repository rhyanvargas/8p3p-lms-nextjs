"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type FeedPost = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
};

export interface CommunityFeedProps {
  posts: FeedPost[];
  onPostSubmit?: (content: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onViewMore?: () => void;
}

export function CommunityFeed({
  posts,
  onPostSubmit,
  onLike,
  onComment,
  onViewMore,
}: CommunityFeedProps) {
  const [postContent, setPostContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() && onPostSubmit) {
      onPostSubmit(postContent);
      setPostContent("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Community Feed</h3>
      
      <Card>
        <CardHeader className="pb-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              className="w-full min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share something with your peers..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit">Post</Button>
            </div>
          </form>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>
                    {post.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.user.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span>{post.user.role}</span>
                    <span className="mx-1">•</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{post.content}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <button 
                  onClick={() => onLike && onLike(post.id)}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-thumbs-up"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  <span>{post.likes} Likes</span>
                </button>
                <button 
                  onClick={() => onComment && onComment(post.id)}
                  className="flex items-center space-x-1 hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-square"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{post.comments} Comments</span>
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onViewMore}
            className="w-full"
          >
            View More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
