import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../utils/cloudinary";

export const addNewPost = async (req, res) => {
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
      user.posts.push(createdPost_id);
      await user.save();
    }

    await createdPost.populate({ path: "author", select: "-password" });

    return res.json({
      success: true,
      message: "Post uploaded successfully",
      createdPost
    });
  } catch (error) {
    console.log("POST CONTROLLER ADD NEW POST CATCH");
  }
};
