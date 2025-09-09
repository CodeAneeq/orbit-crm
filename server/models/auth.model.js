import mongoose, { Mongoose, Schema } from 'mongoose';

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["admin", "member", "manager", "teamLead"], default: "member"},
    token: {type: String, default: ""},
    departmentId: {type: mongoose.Schema.Types.ObjectId, ref: "department"}
})

export const userModel = mongoose.model("user", userSchema);