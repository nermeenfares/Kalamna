"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import path from "path";

interface Props {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({ text, author, communityId, path }: Props) {
  try {
    connectToDB();
    const createdThread = await Thread.create({
      text,
      author,
      community: communityId,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`error creating thread: ${error.message} `);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  // try {
  connectToDB();
  //calculate no. of posts to skip DEPENDING to. which page we're on
  const skipAmount = (pageNumber - 1) * pageSize;
  //here we wanna fetch threads that are top level --- aka have no parent since we wana fetch main threads not comments!
  //we wana find threads that has no parent id so we parentId should be null/undefined
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: "User" })
    .populate({
      strictPopulate: false,
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;
  return { posts, isNext };
  // } catch (error: any) {
  // throw new Error(`failed to fetch user ${error.message}`);
}
export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    //TODO: populate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`failed to fetch thread ${error.message}`);
  }
}
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    //finding original thread by its id
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }
    //makin neww threadd with comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    //saving the neww Thread
    const savedCommentThread = await commentThread.save();
    //update the parent thread to include this new commnt
    originalThread.children.push(savedCommentThread._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`failed to add comment to thread ${error.message}`);
  }
}
// }
