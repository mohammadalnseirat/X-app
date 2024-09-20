import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import { createPost, deletePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost", protectRoute, createPost);
router.delete("/deletepost/:id", protectRoute, deletePost);

export default router;
