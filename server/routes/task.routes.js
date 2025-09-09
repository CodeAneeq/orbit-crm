import express from 'express';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware.js';
import { addTask, assignTask, changeStatus, delTask, getTaskById, getTasks, updateTask } from '../controllers/task.controller.js';
import upload from '../middlewares/multer.middleware.js';

const route = express.Router();

route.post("/add-task", authMiddleware, checkRole(["admin", "manager"]), upload.array("image"), addTask);
route.get("/get-tasks", authMiddleware, checkRole(["admin", "manager", "member"]), getTasks);
route.get("/get-task/:id", authMiddleware, checkRole(["admin", "manager", "member"]), getTaskById);
route.delete("/del-task/:id", authMiddleware, checkRole(["admin", "manager"]), delTask);
route.put("/update-task/:id", authMiddleware, checkRole(["admin", "manager", "member"]), upload.array("image"),  updateTask);
route.put("/assign-task/:id", authMiddleware, checkRole(["admin", "manager"]), assignTask);
route.post("/change-status/:id", authMiddleware, checkRole(["admin", "manager", "member"]), changeStatus);


export default route