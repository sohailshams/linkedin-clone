import connectDB from "@/Mongodb/db";
import { Post } from "@/Mongodb/Models/Post";
import { IUser } from "@/Types/AppUser";
import { ICommentBase } from "@/Mongodb/Models/Comment";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ post_id: string }> }
) {
  try {
    await connectDB();
    const { post_id } = await params;
    const post = await Post.findById(post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await post.getAllComments();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching comments" },
      { status: 500 }
    );
  }
}

export interface AddCommentRequestBody {
  user: IUser;
  commentText: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ post_id: string }> }
) {
  const { user, commentText }: AddCommentRequestBody = await request.json();

  const { post_id } = await params;
  try {
    await connectDB();
    const post = await Post.findById(post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment: ICommentBase = {
      user,
      commentText,
    };
    await post.commentOnPost(comment);
    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while adding comment" },
      { status: 500 }
    );
  }
}
