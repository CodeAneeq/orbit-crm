import express from "express";
import { delUser, getAllUsers, getUserById, getUsers, login, signUp } from "../controllers/auth.controller.js";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware.js";
// import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post('/sign-up', authMiddleware, checkRole(["admin"]), signUp);
route.post('/login', login);
route.get('/get-users', authMiddleware, checkRole(["admin", "manager"]), getUsers);
route.get('/get-all-users', authMiddleware, checkRole(["admin", "manager"]), getAllUsers);
route.get('/get-user/:id', getUserById);
route.delete('/del-user/:id', authMiddleware, checkRole(["admin"]), delUser);

export default route