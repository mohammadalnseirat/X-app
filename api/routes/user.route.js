import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import {
  followUnFollowUser,
  getSuggestedUsers,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.get("/suggestion", protectRoute, getSuggestedUsers);
export default router;
