import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import postModel from "../models/postModel.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //validation using joi
    const user = await userModel.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        message: "User already exists for this email",
      });
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const createdUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });
    });

    return res.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("CONTROLLER REGISTER CATCH");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("IN LOGIN");
    console.log(email, password);

    let user = await userModel.findOne({ email });

    console.log(user);

    if (!user) {
      return res.json({
        success: false,
        message: "Email or password wrong",
      });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        const populatedPosts = await Promise.allSettled(
          user.posts.map(async (postId) => {
            const post = await postModel.findById(postId);
            if (post.author.equals(user._id)) {
              return post;
            }
            return null;
          })
        );

        user = {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
          followers: user.followers,
          following: user.following,
          posts: populatedPosts,
        };

        return res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: true
          })
          .json({
            message: `Welcome back ${user.username}`,
            success: true,
            user,
          });
      } else {
        return res.json({
          success: false,
          message: "Email or password wrong",
        });
      }
    });
  } catch (error) {
    console.log("CONTROLLER LOGIN CATCH");
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log("CONTROLLER LOGOUT CATCH");
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await userModel
      .findById(userId)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks");

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("CONTROLLER GET PROFILE CATCH");
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    // console.log(bio);
    // console.log(gender);
    // console.log(profilePicture);

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      // console.log("file uri mein dikkat hai")
      // console.log(fileUri)

      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("CONTROLLER EDIT PROFILE CATCH");
    console.log(error);
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await userModel
      .find({ _id: { $ne: req.id } })
      .select("-password");

    if (!suggestedUsers) {
      return res.json({
        message: "Currently no accounts available",
        success: false,
      });
    }

    return res.json({
      users: suggestedUsers,
      success: true,
    });
  } catch (error) {
    console.log("CONTROLLER GET SUGGESTED USER CATCH");
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const follower = req.id; //person who is going to follow/unfollow
    const following = req.params.id; //person who is going to be followed/unfollowed

    console.log("follower")
    console.log(follower)
    console.log("following")
    console.log(following)

    if (follower === following) {
      return res.json({
        success: false,
        message: "Can't follow yourself. GET A LIFE MAN!",
      });
    }

    let user = await userModel.findById(follower);
    const targetUser = await userModel.findById(following);

    if (!user || !targetUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    let isFollowing = false;

    // console.log(follower);
    // console.log(following);
    for (let i = 0; i < user.following.length; i++) {
      // console.log(user.following[i].toString());

      if (user.following[i].toString() === following) {
        isFollowing = true;
        break;
      }
    }

    console.log(isFollowing);

    if (isFollowing) {
      // unfollow crow

      user.following = user.following.filter(
        (f) => f.toString() !== following
      );
      targetUser.followers = targetUser.followers.filter(
        (f) => f.toString() !== follower.toString()
      );

      user.save();
      targetUser.save();

      user = {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
      };

      return res.json({
        success: true,
        message: "Unfollowed successfully",
        user,
      });
    } else {
      user.following.push(following);
      targetUser.followers.push(follower);

      user.save();
      targetUser.save();

      user = {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
      };

      return res.json({
        success: true,
        message: "Following",
        user,
      });
    }
  } catch (error) {
    console.log("CONTROLLER FOLLOW OR UNFOLLOW CATCH");
    console.log(error);
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
