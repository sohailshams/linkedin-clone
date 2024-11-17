"use client";

import { IPostFeed } from "@/Mongodb/Models/Post";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import CommentFeed from "./CommentFeed";

type PostToobarProps = {
  post: IPostFeed;
};

function PostToolbar({ post }: PostToobarProps) {
  const { user } = useUser();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes);

  useEffect(() => {
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [user, post]);

  const likeOrDislike = async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const originalLiked = liked;
    const originalNumberOfLikes = numberOfLikes;
    const updatedLikes = liked
      ? numberOfLikes?.filter((like) => like !== user.id)
      : [...(numberOfLikes ?? []), user.id];

    const body: LikePostRequestBody | UnlikePostRequestBody = {
      userId: user.id,
    };
    setLiked(!liked);
    setNumberOfLikes(updatedLikes);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      setLiked(originalLiked);
      setNumberOfLikes(originalNumberOfLikes);
      throw new Error("Error liking/disliking post");
    }

    const updatedLikesResponse = await fetch(`/api/posts/${post._id}/like`);
    if (!updatedLikesResponse.ok) {
      setLiked(originalLiked);
      setNumberOfLikes(originalNumberOfLikes);
      throw new Error("Error fetching updated likes");
    }

    const updatedLikesData = await updatedLikesResponse.json();
    setNumberOfLikes(updatedLikesData.likes);
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {numberOfLikes && numberOfLikes.length > 0 && (
            <p>{numberOfLikes.length} likes</p>
          )}
        </div>

        <div>
          {post?.comments && post.comments.length > 0 && (
            <p
              className="text-xs text-gray-500 cursor-pointer"
              onClick={() => setIsCommentOpen(!isCommentOpen)}
            >
              {post.comments.length} comments
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between p-2 border-t">
        <Button
          variant="ghost"
          onClick={likeOrDislike}
          className={liked ? "text-[#4881c2] postButton" : "postButton"}
        >
          <ThumbsUpIcon className={cn("mr-1", liked && "fill-[#4881c2]")} />
          Like
        </Button>

        <Button
          variant="ghost"
          className="postButton"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentOpen && "text-gray-600 fill-gray-600"
            )}
          />
          Comment
        </Button>

        <Button variant="ghost" className="postButton">
          <Repeat2 className="mr-1" />
          Repost
        </Button>

        <Button variant="ghost" className="postButton">
          <Send className="mr-1" />
          Send
        </Button>
      </div>

      {isCommentOpen && (
        <div className="p-4">
          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
}
export default PostToolbar;
