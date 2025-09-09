import { userModel } from "../models/auth.model.js";
import Constants from '../constant.js'
import jwt from 'jsonwebtoken'

export let authMiddleware = async (req, res, next) => {
    try {
        let reqHeader = req.headers.authorization;
        if (!reqHeader || !reqHeader.startsWith("Bearer")) {            
            return res.status(401).json({status: "failed", message: "Unauthorized: No token provided"});
        }

        let token = reqHeader.split(" ")[1];
        const decode = jwt.verify(token, Constants.SECRET_KEY);
        let user = await userModel.findById(decode.newUser.id);
        if (!user) {            
            return res.status(404).json({status: "failed", message: "User Not Found"});
        }
        req.user = user;
        next()
    } catch (error) {
         console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid or expired token", error: error });
    }
}

export let checkRole = (roles) => {
    return (req, res, next) => {
        let user = req.user;
        if (!roles.includes(user.role)) {
            return res.status(403).json({ status: "failed", message: "Access denied" });
        }
        next()
    }
}