import express from "express";
import { protectRoute } from "../middleWare/verifyToken.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/deleteall", protectRoute, deleteAllNotifications);
router.delete("/delete/:id", protectRoute, deleteNotification);

export default router;
