"use client";

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import UserAvatar from "./UserAvatar";

type CommentFormProp = {
  postId: string;
};
function CommentForm({ postId }: CommentFormProp) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const handleCommentInput = async (formData: FormData): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const compyFormData = formData;
    ref.current?.reset();
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const commentInput = handleCommentInput(formData);

        // TODO add toast notification
      }}
      className="flex items-center space-x-1"
    >
      <UserAvatar user={user} />
      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="bg-transparent text-sm outline-none"
        />
        <button type="submit" hidden>
          Comment
        </button>
      </div>
    </form>
  );
}
export default CommentForm;
