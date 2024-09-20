import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost", protectRoute, createPost);
router.delete("/deletepost/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);

export default router;
