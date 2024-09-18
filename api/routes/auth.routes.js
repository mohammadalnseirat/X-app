import express from "express";
import {
  getCurrentUser,
  signIn_post,
  signOut_post,
  signUp_post,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleWare/verifyToken.js";

const router = express.Router();

router.get("/me", protectRoute, getCurrentUser);
router.post("/signup", signUp_post);
router.post("/signin", signIn_post);
router.post("/signout", signOut_post);

export default router;
