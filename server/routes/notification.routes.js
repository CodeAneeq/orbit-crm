import express from "express";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware.js";
import { deleteNotification, getMyNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";

const route = express.Router();

route.get("/get-notifications", authMiddleware, getMyNotifications);
route.delete("/del-notification/:id", authMiddleware, deleteNotification);
route.put("/mark-notification/:id", authMiddleware, markNotificationAsRead);

export default route;