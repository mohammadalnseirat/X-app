import express from "express";
import {
  signIn_post,
  signOut_post,
  signUp_post,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp_post);
router.post("/signin", signIn_post);
router.post("/signout", signOut_post);

export default router;
