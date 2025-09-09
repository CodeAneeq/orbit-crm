import mongoose, { Schema } from 'mongoose';

const clientSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    company: {type: String, required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    departmentId: {type: mongoose.Schema.Types.ObjectId, ref: "department"}
})

export const clientModel = mongoose.model("client", clientSchema);