import { IPostDocument } from "@/Mongodb/Models/Post";
import Post from "./Post";

type PostFeedProps = {
  posts: IPostDocument[];
};

function PostFeed({ posts }: PostFeedProps) {
  return (
    <div className="space-y-2 pb-20">
      {posts.map((post) => (
        <Post key={post._id.toString()} post={post} />
      ))}
    </div>
  );
}
export default PostFeed;
