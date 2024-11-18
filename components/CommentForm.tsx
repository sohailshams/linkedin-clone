"use client";

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import UserAvatar from "./UserAvatar";
import createCommentAction from "@/Actions/CreateCommentAction";
import { toast } from "sonner";

type CommentFormProp = {
  postId: string;
};
function CommentForm({ postId }: CommentFormProp) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentWithId = createCommentAction.bind(null, postId);

  const handleCommentInput = async (formData: FormData): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const compyFormData = formData;
    ref.current?.reset();

    try {
      await createCommentWithId(compyFormData);
    } catch (error) {
      console.log("Error crating comment", error);
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentInput(formData);

        // Toast notification based on above functions success or failure
        toast.promise(promise, {
          loading: "Adding comment...",
          success: "Comment added successfully",
          error: "Failed to add comment!",
        });
      }}
      className="flex items-center space-x-1"
    >
      <UserAvatar user={user} />
      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Add a comment..."
          className="bg-transparent text-sm outline-none w-full"
        />
        <button type="submit" hidden>
          Comment
        </button>
      </div>
    </form>
  );
}
export default CommentForm;
