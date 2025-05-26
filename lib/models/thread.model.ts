import mongoose from "mongoose";
import { Children } from "react";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  parentId: {
    type: String,
  },
  //1 thread can have multiple threads as children--recursion
  //means when a comment on thread someone replies to it, so replies of specific tread/comment is the children of it
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);
export default Thread;
