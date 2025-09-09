import express from "express";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware.js";
import { addDepartment, deleteDepartment, getDepartmentById, getDepartments } from "../controllers/department.controller.js";

const route = express.Router();

route.post('/add-department', authMiddleware, checkRole(["admin"]), addDepartment);
route.get('/get-departments', authMiddleware, checkRole(["admin"]), getDepartments);
route.get('/get-department/:id', getDepartmentById);
route.delete('/del-department/:id', authMiddleware, checkRole(["admin"]), deleteDepartment);

export default route