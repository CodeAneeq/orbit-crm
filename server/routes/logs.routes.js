import express from 'express';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware.js';
import { createLog, getLogs, getMyLogs } from '../controllers/logs.controller.js';

const route = express.Router();

route.get("/get-all-logs",authMiddleware, checkRole(["admin", "manager", "member"]), getLogs);
route.get("/get-my-logs/", authMiddleware, checkRole(["admin", "manager", "member"]), getMyLogs);


export default route