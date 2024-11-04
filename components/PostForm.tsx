"use client";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import CreatePostAction from "@/Actions/CreatePostAction";
import { CldUploadWidget } from "next-cloudinary";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useUser();
  const handleImageChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      setPreview(URL.createObjectURL(imageFile));
    }
  };
  const handleRemoveImage = () => {
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
          handlePostAction(formData);
          // Toast notification based on above functions success or failure
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
          {/* <input
            ref={inputFileRef}
            type="file"
            name="postImage"
            accept="image/*"
            hidden
            onChange={handleImageChage}
          /> */}
          <CldUploadWidget
            uploadPreset="unsigned"
            onSuccess={(result, { widget }) => {
              console.log("result:", result);
              // setResource(result?.info);  // { public_id, secure_url, etc }
            }}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => {
              function handleOnClick() {
                // setResource(undefined);
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
            onClick={() => inputFileRef.current?.click()}
            className="bg-[#0a66c2]"
          >
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change" : "Add"} Image
          </Button>
          {preview && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemoveImage}
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
