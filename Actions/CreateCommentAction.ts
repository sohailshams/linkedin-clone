"use server";
import { AddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import { Post } from "@/Mongodb/Models/Post";
import { IUser } from "@/Types/AppUser";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createCommentAction(
  postId: string,
  formData: FormData
) {
  const user = await currentUser();
  const commentInput = formData.get("commentInput") as string;
  const post = await Post.findById(postId);

  if (!post) throw new Error("Post not found");
  if (!commentInput.trim()) throw new Error("Please enter a comment.");
  if (!postId) throw new Error("Post ID not provided");
  if (!user) throw new Error("User not authenticated");

  const userDB: IUser = {
    userId: user.id,
    imageUrl: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  const comment: AddCommentRequestBody = {
    user: userDB,
    commentText: commentInput,
  };

  try {
    await post.commentOnPost(comment);
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while adding comment");
  }
}
