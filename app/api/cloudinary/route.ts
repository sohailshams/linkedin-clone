import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  const { imageId } = await request.json();
  try {
    if (!imageId) {
      return NextResponse.json(
        { error: "No Image ID provided." },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(imageId);
    if (result.result === "ok") {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        {
          error:
            "An error occurred while adding deleting the image from cloudinary.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete image." },
      { status: 500 }
    );
  }
}
