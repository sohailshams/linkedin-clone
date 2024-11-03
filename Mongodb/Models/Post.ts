import { IUser } from "@/Types/AppUser";
import { Comment, IComment, ICommentBase } from "@/Mongodb/Models/Comment";
import mongoose, { Schema, Document, models, Model, Types } from "mongoose";
import path from "path";

export interface IPostBase {
  user: IUser;
  postText: string;
  imageUrl?: string;
  comments?: IComment[];
  likes?: string[];
}

export interface IPost extends IPostBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  likePost(userId: string): Promise<void>;
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: ICommentBase): Promise<void>;
  getAllComments(): Promise<IComment[]>;
  deletePost(): Promise<void>;
}

interface IPostStatics {
  getAllPosts(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {} // singular instance of a post
interface IPostModel extends IPostStatics, Model<IPostDocument> {} // all posts

const PostSchema = new Schema<IPostDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    postText: { type: String, required: true },
    imageUrl: { type: String },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    likes: { type: [String] },
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.likePost = async function (userId: string) {
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    console.log("Failed to like post", error);
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } });
  } catch (error) {
    console.log("Failed to unlike post", error);
  }
};

PostSchema.methods.deletePost = async function () {
  try {
    await this.model("Post").deleteOne({ _id: this._id });
  } catch (error) {
    console.log("Error while deleting a post");
  }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
  try {
    const comment = await Comment.create(commentToAdd);
    this.comments.push(comment._id);
    await this.save();
  } catch (error) {
    console.log("Error while commenting on the post");
  }
};

PostSchema.methods.getAllComments = async function () {
  try {
    await this.populate({
      path: "comments",
      options: { sort: { createdAt: -1 } }, // sort comments by newest first
    });
    return this.comments;
  } catch (error) {
    console.log("Error while getting comments");
  }
};

PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",

        options: { sort: { createdAt: -1 } },
      })
      .populate("likes")
      .lean(); // lean() returns a plain JS object instead of a mongoose document

    return posts.map((post: IPostDocument) => ({
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment: IComment) => ({
        ...comment,
        _id: comment._id.toString(),
      })),
    }));
  } catch (error) {
    console.log("error when getting all posts", error);
  }
};

export const Post =
  (models.Post as IPostModel) ||
  mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
