import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import commentModel from "../models/commentModel.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "node:fs"

export const addNewPost = async (req, res) => {
  console.log("Incoming request method:", req.method);
  console.log("Request body:", req.body); // Should show the caption
  console.log("Uploaded file:", req.file);

  try {

    const { caption } = req.body;
    const image = req.file;
    const author = req.id;

    if (!image) {
      return res.json({
        success: false,
        message: "Can't upload post without an image",
      });
    }
    console.log(image);
    const cloudResponse = await cloudinary.uploader.upload(image.path);
    const createdPost = await postModel.create({
      caption,
      image: cloudResponse.secure_url,
      author,
    });

    const user = await userModel.findOne({ _id: author });

    if (user) {
      user.posts.push(createdPost._id);
      await user.save();
    }

    await createdPost.populate({ path: "author", select: "-password" });

    fs.unlink(image.path, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nDeleted file");
      }
    });

    return res.json({
      success: true,
      message: "Post uploaded successfully",
      createdPost,
    });
  } catch (error) {
    console.log("POST CONTROLLER ADD NEW POST CATCH");
    
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePicture",
        },
      });

    return res.json({
      posts,
      success: true,
      message: "posts fetched successfully",
    });
  } catch (error) {
    console.log("POST CONTROLLER GET ALL POST CATCH");
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;

    const posts = await postModel
      .find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePicture",
        },
      });

    return res.json({
      posts,
      success: true,
      message: "posts fetched successfully",
    });
  } catch (error) {
    console.log("POST CONTROLLER GET USER POST CATCH");
  }
};

export const likePost = async (req, res) => {
  try {
    const userLiking = req.id;
    const postId = req.params.id;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found!",
      });
    }

    await post.updateOne({ $addToSet: { likes: userLiking } });
    await post.save();

    return res.json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.log("POST CONTROLLER LIKE POST CATCH");
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userDisliking = req.id;
    const postId = req.params.id;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found!",
      });
    }

    await post.updateOne({ $pull: { likes: userDisliking } });
    await post.save();

    return res.json({
      success: true,
      message: "Post disliked successfully",
    });
  } catch (error) {
    console.log("POST CONTROLLER DISLIKE POST CATCH");
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userCommentingId = req.id;

    const { text } = req.body;

    const post = await postModel.findById(postId);

    if (!text) {
      return res.json({
        success: false,
        message: "Comment can't be empty",
      });
    }

    const comment = await commentModel
      .create({
        text,
        post: postId,
        author: userCommentingId,
      })
      .populate({
        path: "author",
        select: "username, profilePicture",
      });

    post.comments.push(comment._id);
    await post.save();

    return res.json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.log("POST CONTROLLER ADD COMMENT CATCH");
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await commentModel
      .find({ post: postId })
      .populate("author", "username", "profilePicture");

    if (!comments) {
      return res.json({
        success: false,
        message: "No comments for this post yet",
      });
    }

    return res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log("POST CONTROLLER GET COMMENTS OF POST CATCH");
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await postModel.findById(postId);

    if (post.author.toString() !== authorId) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    await postModel.findByIdAndDelete(postId);

    let user = await userModel.findById(authorId);

    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await commentModel.deleteMany({ post: postId });

    return res.json({
      success: true,
      message: "post deleted successfully",
    });
  } catch (error) {
    console.log("POST CONTROLLER DELETE COMMENT CATCH");
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const user = await userModel.findById(userId);

    if (user.bookmarks.includes(postId)) {
      user = user.bookmarks.filter((id) => id !== postId);
      await user.save();
      return res.json({
        success: true,
        message: "Post removed from bookmark successfully",
      });
    } else {
      userId.bookmarks.push(postId);
      await user.save();
      return res.json({
        success: true,
        message: "Post added to bookmark successfully",
      });
    }
  } catch (error) {
    console.log("POST CONTROLLER ADD TO BOOKMARK POST CATCH");
  }
};
