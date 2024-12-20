import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import connectDB from "@/Mongodb/db";
import { Post } from "@/Mongodb/Models/Post";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  await connectDB();
  const posts = await Post.getAllPosts();
  const parsedPosts = JSON.parse(JSON.stringify(posts));

  return (
    <div
      className={
        user
          ? "grid grid-cols-8 mt-5 sm:px-5"
          : "grid grid-cols-1 m-auto max-w-96 mt-40"
      }
    >
      <section
        className={user ? "hidden md:inline md:col-span-2" : "inline pl-4"}
      >
        <UserInformation posts={parsedPosts} />
      </section>
      {user && (
        <>
          <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
            <PostForm />
            <PostFeed posts={parsedPosts} />
          </section>

          <section className="hidden xl:inline justify-center col-span-2">
            {/* TODO */}
            {/* <Widget /> */}
          </section>
        </>
      )}
    </div>
  );
}
