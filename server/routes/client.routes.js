import express from "express";
import {addClient, assignClient, delClient, getClientById, getClients, updateClient} from '../controllers/client.controller.js'
import { authMiddleware, checkRole } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/add-client", authMiddleware, checkRole(["admin", "manager"]), addClient);
route.get("/get-clients", authMiddleware, checkRole(["admin", "manager", "member"]), getClients);
route.delete("/del-client/:id", authMiddleware, checkRole(["admin", "manager"]), delClient);
route.put("/update-client/:id", authMiddleware, checkRole(["admin", "manager"]),  updateClient);
route.put("/assign-client/:id", authMiddleware, checkRole(["admin", "manager"]),  assignClient);
route.get("/get-client/:id", authMiddleware,  getClientById);

export default route;