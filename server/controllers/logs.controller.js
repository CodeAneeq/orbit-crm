import { logModel } from "../models/logs.model.js";

// Helper function for automatic logging
const createLog = async ({ userId, action, targetId = null, targetType = null, departmentId = null }) => {
    try {
        if (!userId || !action) {
            throw new Error("userId and action are required for logging");
        }

        const log = new logModel({
            userId,
            action,
            targetId,
            targetType,
            departmentId
        });

        await log.save();
        // Optional: return the saved log if needed
        return log;
    } catch (error) {
        console.error("Log creation error:", error.message);
    }
};


let getLogs = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let logs = await logModel.find().populate({
                path: "userId",
                model: "user",
                select: "name"
            });
            if (logs.length == 0) {
             return res.status(404).json({status: "success", message: "Logs not found length is 0"});
            } 
         res.status(200).json({status: "success", message: "Log fetch successfully", data: logs});
        } else if (user.role == "manager") {
            let logs = await logModel.find({departmentId: user.departmentId}).populate({
                path: "userId",
                model: "user",
                select: "name"
            });
             if (logs.length == 0) {
             return res.status(404).json({status: "success", message: "Logs not found length is 0"});
            } 
            res.status(200).json({status: "success", message: "Log fetch successfully", data: logs});
        } else {
            let logs = await logModel.find({userId: user._id}).populate({
                path: "userId",
                model: "user",
                select: "name"
            });
            if (logs.length == 0) {
             return res.status(404).json({status: "success", message: "Logs not found length is 0"});
            } 
            res.status(200).json({status: "success", message: "Log fetch successfully", data: logs});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

let getMyLogs = async (req, res) => {
    try {
        let user = req.user;
        let logs = await logModel.find({userId: user._id}).populate({
                path: "userId",
                model: "user",
                select: "name"
            });
          if (logs.length == 0) {
        return res.status(404).json({status: "success", message: "Logs not found length is 0"});
       } 
    res.status(200).json({status: "success", message: "Log fetch successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export {createLog, getLogs, getMyLogs}