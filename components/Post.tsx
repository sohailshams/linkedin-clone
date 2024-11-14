"use client";

import { IPostDocument } from "@/Mongodb/Models/Post";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";
import ReactTimeago from "react-timeago";
import { Badge } from "./ui/badge";

type PostProps = {
  post: IPostDocument;
};

function Post({ post }: PostProps) {
  const { user } = useUser();
  const isAuther = user?.id === post.user.userId;
  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <div>
          <UserAvatar user={post.user} />
        </div>

        <div className="flex justify-between flex-1">
          <div>
            <p className="font-semibold">
              {post.user.firstName} {post.user.lastName}
              {isAuther && (
                <Badge variant="secondary" className="ml-2">
                  Auther
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Post;
