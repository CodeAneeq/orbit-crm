import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true
});

export const notificationModel = mongoose.model("notification", notificationSchema);
