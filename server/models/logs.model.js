import mongoose, { Schema } from 'mongoose';

const logSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    action: {type: String, required: true},
    targetId: {type: mongoose.Schema.Types.ObjectId},
    targetType: {type: String},    
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "department" }
}, {
    timestamps: true
})

export const logModel = mongoose.model("log", logSchema);