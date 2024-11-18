"use client";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import CreatePostAction from "@/Actions/CreatePostAction";
import DeletePostImage from "@/Actions/DeletePostImage";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { toast } from "sonner";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const inputFileRef = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cloudinaryImageId, setCloudinaryImageId] = useState<string | null>(
    null
  );
  const { user } = useUser();

  const handlImageUpdateDelete = async () => {
    if (!preview) {
      return;
    }
    const removePostImage = await DeletePostImage(cloudinaryImageId);
    if (removePostImage.result === "ok") {
      setCloudinaryImageId(null);
    }

    setPreview(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = ""; // Reset file input value
    }
  };

  const handlePostAction = async (formData: FormData) => {
    const copyFormData = formData;
    ref.current?.reset(); // Reset form values
    const inputText = copyFormData.get("postInput") as string;
    if (inputText.trim() === "") {
      throw new Error("Please enter a post.");
    }
    setPreview(null);

    try {
      await CreatePostAction(copyFormData);
    } catch (error) {
      console.error("Error posting post:", error);
    }
  };

  return (
    <div className="mb-2">
      <form
        ref={ref}
        action={(formData) => {
          // Handle form submission with sever action
          if (preview) {
            formData.append("postImage", preview);
          }
          const promise = handlePostAction(formData);
          // Toast notification based on above functions success or failure
          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created successfully",
            error: "Post creation failed",
          });
        }}
        className="p-3 bg-white rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <UserAvatar user={user} />
          <input
            type="text"
            name="postInput"
            placeholder="Start a post..."
            className="flex-1 rounded-full py-3 px-4 border outline-none"
          />
          <CldUploadWidget
            uploadPreset="ml_default"
            onSuccess={(result, { widget }) => {
              if (
                typeof result!.info === "object" &&
                "secure_url" in result!.info
              ) {
                setPreview(result!.info?.secure_url);
                setCloudinaryImageId(result!.info?.public_id);
              }
            }}
            options={{
              resourceType: "image",
              fieldName: "postImage",
              clientAllowedFormats: ["jpg", "png", "jpeg"],
              multiple: false,
            }}
          >
            {({ open }) => {
              function handleOnClick() {
                open();
              }
              return (
                <button
                  hidden
                  ref={inputFileRef}
                  type="button"
                  onClick={handleOnClick}
                >
                  Upload an Image
                </button>
              );
            }}
          </CldUploadWidget>
          <button type="submit" hidden>
            Post
          </button>
        </div>

        {preview && (
          <div className="mt3">
            <img className="w-full object-cover" src={preview} alt="preview" />
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            type="button"
            onClick={async () => {
              inputFileRef.current?.click();
              handlImageUpdateDelete();
            }}
            className="bg-[#0a66c2]"
          >
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change" : "Add"} Media
          </Button>
          {preview && (
            <Button
              type="button"
              variant="destructive"
              onClick={handlImageUpdateDelete}
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove Image
            </Button>
          )}
        </div>
      </form>
      <hr className="border-gray-300 mt-2" />
    </div>
  );
}
export default PostForm;
