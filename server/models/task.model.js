import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: "client", required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending"},
    deadline: {type: String, required: true},
    attachment: {type: [String]},
    departmentId: {type: mongoose.Schema.Types.ObjectId, ref: "department"}
}, {
    timestamps: true
})

export const taskModel = mongoose.model("task", taskSchema);