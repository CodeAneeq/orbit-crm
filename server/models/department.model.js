import mongoose, { Schema } from 'mongoose';

const departmentSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    managerId: {type: mongoose.Schema.Types.ObjectId, ref: "user"}
}, {
    timestamps: true
})

export const departmentModel = mongoose.model("department", departmentSchema);