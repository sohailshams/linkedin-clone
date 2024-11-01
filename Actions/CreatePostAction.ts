"use server";

import { AddPostRequestBody } from "@/.next/types/app/api/posts/route";
import { Post } from "@/Mongodb/Models/Post";
import { IUser } from "@/Types/AppUser";
import { currentUser } from "@clerk/nextjs/server";

export default async function (formData: FormData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const postImage = formData.get("postImage") as File;
  let imageUrl: string | undefined;
  if (!postInput) {
    throw new Error("Post input is required");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    if (postImage.size > 0) {
      const postWithImage: AddPostRequestBody = {
        user: userDB,
        postText: postInput,
        // imageUrl: image_url
      };
      await Post.create(postWithImage);
    } else {
      const postWithoutImage: AddPostRequestBody = {
        user: userDB,
        postText: postInput,
      };
      await Post.create(postWithoutImage);
    }
  } catch (error) {}
}
