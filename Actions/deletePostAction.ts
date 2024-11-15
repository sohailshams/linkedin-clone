"use server";

import { Post } from "@/Mongodb/Models/Post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.user.userId !== user.id) {
    throw new Error("You are not have permissions to delete this post.");
  }

  try {
    await post.deletePost();
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while deleting the post.");
  }
}
