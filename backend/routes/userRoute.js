import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUser,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import editUpload from "../middlewares/editProfileMulter.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/:id/profile", isAuthenticated, getProfile);
router.post(
  "/profile/edit",
  isAuthenticated,
  editUpload.single("profilePicture"),
  editProfile
);
router.get("/suggested", isAuthenticated, getSuggestedUser);
router.post("/followOrUnfollow/:id", isAuthenticated, followOrUnfollow);

export default router;