import { IUser } from "@/Types/AppUser";
import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface ICommentBase {
  user: IUser;
  commentText: string;
}

export interface IComment extends Document, ICommentBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
});

const commentSchema = new Schema<IComment>(
  {
    user: { type: userSchema, required: true },
    commentText: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Comment =
  models.Comment || mongoose.model<IComment>("Comment", commentSchema);
