"use client";

import { IPostFeed } from "@/Mongodb/Models/Post";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    </div>
  );
}
export default PostToolbar;
