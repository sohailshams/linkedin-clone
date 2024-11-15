"use client";

import { IPostDocument } from "@/Mongodb/Models/Post";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";
import ReactTimeago from "react-timeago";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import deletePostAction from "@/Actions/deletePostAction";

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
            <div className="font-semibold flex">
              <p>
                {post.user.firstName} {post.user.lastName}
              </p>
              {isAuther && (
                <Badge variant="secondary" className="ml-2">
                  Auther
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>

          {isAuther && (
            <Button
              variant="outline"
              onClick={() => {
                const deletePost = deletePostAction(post._id.toString());
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Post;
