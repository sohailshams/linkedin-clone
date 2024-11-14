import connectDB from "@/Mongodb/db";
import { IPostBase, Post } from "@/Mongodb/Models/Post";
import { IUser } from "@/Types/AppUser";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
  user: IUser;
  postText: string;
  imageUrl?: string | null;
}
export async function POST(request: Request) {
  auth.protect();

  try {
    const { user, postText, imageUrl }: AddPostRequestBody =
      await request.json();
    const newPost: IPostBase = {
      user,
      postText,
      ...(imageUrl && { imageUrl }),
    };

    const post = await Post.create(newPost);
    return NextResponse.json({ message: "Post created successfully", post });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while adding a new post." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const posts = await Post.getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching posts." },
      { status: 500 }
    );
  }
}
