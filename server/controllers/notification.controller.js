import { notificationModel } from "../models/notification.model.js"

export let createNotification = async ({userId, message}) => {
    try {
        if (!userId || !message) {
            throw new Error("All fields are required");
        }
    
        let notification = await notificationModel({
            userId,
            message
        })
    
        await notification.save()
        return notification
        
    } catch (error) {
        console.log(error);
    }
}

let getMyNotifications = async (req, res) => {
    try {
        let user = req.user;
        let notifications = await notificationModel.find();
        if (notifications.length == 0) {
            return res.status(404).json({status: "success", message: "notifications not found length is 0"});
        } 
        res.status(200).json({status: "success", message: "notifcations fetch successfully", data: notifications});
        }
    catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

let markNotificationAsRead = async (req, res) => {
    try {
        let user = req.user;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "Id is required"});
        }        
        let notification = await notificationModel.findOne({_id: id, userId: user._id});        
        if (!notification) {
            return res.status(404).json({status: "failed", message: "notification not found"});
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json({status: "success", message: "Notification is mark as read successfully", data: notification});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

let deleteNotification = async (req, res) => {
    try {
        let user = req.user;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "Id is required"});
        }
        let notification = await notificationModel.findById({_id: id, userId: user._id});
        if (!notification) {
            return res.status(404).json({status: "failed", message: "notification not found"});
        }
        await notificationModel.findByIdAndDelete(id);
        res.status(200).json({status: "success", message: "Notification is deleted successfully", data: notification});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export {getMyNotifications, markNotificationAsRead, deleteNotification}