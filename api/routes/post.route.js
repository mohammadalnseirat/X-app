import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import { createPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createpost", protectRoute, createPost);

export default router;
