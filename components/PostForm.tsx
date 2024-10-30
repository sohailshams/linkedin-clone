"use client";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";

function PostForm() {
  const { user } = useUser();
  return (
    <div>
      <form action="">
        <div>
          <UserAvatar user={user} />
        </div>
      </form>
    </div>
  );
}
export default PostForm;
