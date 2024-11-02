import connectDB from "@/Mongodb/db";
import { Post } from "@/Mongodb/Models/Post";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();
  const { post_id } = await params;
  try {
    const post = await Post.findById(post_id);
    console.log("post", post);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likes = post.likes;
    return NextResponse.json(likes);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching likes" },
      { status: 500 }
    );
  }
}

export interface LikePostRequestBody {
  userId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  const { userId }: LikePostRequestBody = await request.json();
  const { post_id } = await params;
  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.likePost(userId);
    return NextResponse.json({ message: "Post liked successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while liking the post" },
      { status: 500 }
    );
  }
}
