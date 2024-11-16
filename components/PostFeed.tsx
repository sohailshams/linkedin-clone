import { IPostFeed } from "@/Mongodb/Models/Post";
import Post from "./Post";

type PostFeedProps = {
  posts: IPostFeed[];
};

function PostFeed({ posts }: PostFeedProps) {
  return (
    <div className="space-y-2 pb-20">
      {posts.map((post) => (
        <Post key={post?._id} post={post} />
      ))}
    </div>
  );
}
export default PostFeed;
