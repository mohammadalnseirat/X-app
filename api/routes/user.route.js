import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import {
  followUnFollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.get("/suggestion", protectRoute, getSuggestedUsers);
router.put("/updateprofile", protectRoute, updateUserProfile);
export default router;
