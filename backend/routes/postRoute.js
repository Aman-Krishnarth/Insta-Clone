import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/addPost", isAuthenticated, upload.single("image"), addNewPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/userpost/all", isAuthenticated, getUserPost);
router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.post("/:id/comment", isAuthenticated, addComment);
router.post("/:id/comment/all", isAuthenticated, getCommentsOfPost);
router.post("/delete/:id", isAuthenticated, deletePost);
router.post("/:id/bookmark", isAuthenticated, bookmarkPost);


export default router;
