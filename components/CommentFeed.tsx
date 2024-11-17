"use client";

import { IPostFeed } from "@/Mongodb/Models/Post";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";
import ReactTimeago from "react-timeago";
import { Badge } from "./ui/badge";

type CommentFeedProps = {
  post: IPostFeed;
};

function CommentFeed({ post }: CommentFeedProps) {
  const { user } = useUser();
  const isAuther = user?.id === post.user.userId;

  return (
    <div className="space-y-2 mt-2">
      {post.comments?.map((comment, index) => (
        <div key={index} className="flex space-x-1">
          <UserAvatar user={user} />
          <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
            <div className="flex items-center">
              <p className="font-semibold">
                {comment.user.firstName} {comment.user.lastName}
              </p>
              {isAuther && (
                <Badge variant="secondary" className="ml-2">
                  Auther
                </Badge>
              )}
              <p className="text-xs pl-4 text-gray-400">
                <ReactTimeago date={new Date(comment.createdAt)} />
              </p>
            </div>
            <p className="mt-2 text-sm">{comment.commentText}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default CommentFeed;
