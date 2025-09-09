import mongoose, { Schema } from 'mongoose';

const leadSchema = new Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: "client", required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    notes: {type: String},
    status: {type: String, enum: ["New", "Contacted", "Converted"], default: "New"},
    departmentId: {type: mongoose.Schema.Types.ObjectId, ref: "department"}
    
}, {
    timestamps: true
})

export const leadModel = mongoose.model("lead", leadSchema);