import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import {
  followUnFollowUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);

export default router;
