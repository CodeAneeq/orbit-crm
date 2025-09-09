import { userModel } from "../models/auth.model.js";
import { departmentModel } from "../models/department.model.js";
import { createLog } from "./logs.controller.js";

let addDepartment = async (req, res) => {
    try {
        let user = req.user;
        let {name, description} = req.body;
        if (!name || !description) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        const checkDep = await departmentModel.findOne({name});
        if (checkDep) {
            return res.status(400).json({status: "failed", message: "Department already existed"});
        }
        let newDep = new departmentModel({
            name,
            description
        })
        await newDep.save();
         await createLog({
                        userId: user._id,
                        action: "department added Successfully",
                        targetId: newDep._id,
                        targetType: "department",
                        departmentId: user.departmentId
                    });
        res.status(201).json({status: "success", message: "Department created successfully", data: newDep});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

let getDepartments = async (req, res) => {
    try {
        const deps = await departmentModel.find();
        if (deps.length == 0) {
            return res.status(404).json({status: "failed", message: "Department length is 0"});
        }        
        let depCount = await Promise.all(
         deps.map((item) => (
            userModel.countDocuments({departmentId: item._id})
        ))
    )    
    let finalResult = [];
    for (let i = 0; i < deps.length; i++) {
        finalResult.push({...deps[i].toObject(), members: depCount[i]})
    }        
        res.status(200).json({status: "success", message: "Departments fetch successfully", data: finalResult});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

let getDepartmentById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "Id is required"});
        }
        const dep = await departmentModel.findById(id);
        if (!dep) {
            return res.status(404).json({status: "failed", message: "Department not found"});
        }
        res.status(200).json({status: "success", message: "Department fetch successfully", data: dep});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

let deleteDepartment = async (req, res) => {
     try {
        let user = req.user;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "Id is required"});
        }
        const dep = await departmentModel.findByIdAndDelete(id);
        if (!dep) {
            return res.status(404).json({status: "failed", message: "Department not found"});
        }
        await createLog({
                        userId: user._id,
                        action: "department deleted Successfully",
                        targetId: dep._id,
                        targetType: "department",
                        departmentId: user.departmentId
                    });
        res.status(200).json({status: "success", message: "Department deleted successfully", data: dep});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}


export {addDepartment, getDepartmentById, getDepartments, deleteDepartment}