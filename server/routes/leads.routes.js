import express from 'express';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware.js';
import { addLead, assignLead, changeStatusOfLead, delLead, getLeadById, getLeads } from '../controllers/leads.controller.js';

const route = express.Router();

route.post("/add-lead", authMiddleware, checkRole(["admin", "manager"]), addLead);
route.post("/change-lead-status/:id", authMiddleware, checkRole(["admin", "manager", "member"]),changeStatusOfLead);
route.get("/get-leads",authMiddleware, checkRole(["admin", "manager", "member"]), getLeads);
route.get("/get-lead/:id", authMiddleware, getLeadById);
route.delete("/del-lead/:id", authMiddleware, checkRole(["admin", "manager"]), delLead);
route.put("/assign-lead/:id", authMiddleware, checkRole(["admin", "manager"]), assignLead);

export default route