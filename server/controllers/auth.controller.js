import { userModel } from "../models/auth.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import Constants from "../constant.js";
import { departmentModel } from "../models/department.model.js";
import { leadModel } from "../models/leads.model.js";
import { clientModel } from "../models/client.model.js";
import { taskModel } from "../models/task.model.js";


export const signUp = async (req, res) => {
    try {
        let { name, email, password, departmentId, role } = req.body;
        if (!name || !email || !password || !departmentId || !role) {
            return res.status(404).json({ status: "failed", message: "All fields are required" });
        }
        const existedUser = await userModel.findOne({ email });
        if (existedUser) {
            return res.status(404).json({ status: "failed", message: "Email already registered" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(String(password), salt);
        if (role == "manager") {
            let dep = await departmentModel.findById(departmentId);
            if (dep.managerId) {
                return res.status(400).json({status: "failed", message: "This department already have manager"});
            }
        }
        const user = new userModel({
            name,
            email,
            password: hashPassword,
            departmentId: departmentId,
            role: role
        })
        await user.save()
        let payload = {
            newUser: {
                id: user._id
            }
        }
        const token = await jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: '1y' });
        user.token = token;
        if (user.role == "manager") {
            let dep = await departmentModel.findById(departmentId);
            dep.managerId = user._id;
            await dep.save();
        }
        await user.save();
        res.status(201).json({ status: "success", message: "User Sign Up Successfully", data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ status: "failed", message: "All fields are required" });
        }
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Email is wrong" });
        }
        const isMatch = await bcrypt.compare(String(password), user.password);
        if (!isMatch) {
            return res.status(404).json({ status: "failed", message: "Password is wrong" });
        }
        let payload = {
            newUser: {
                id: user._id
            }
        }
        const token = await jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: '1y' });
        user.token = token;
        await user.save();
        res.status(201).json({ status: "success", message: "User Login Successfully", data: user });


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" })
    }
}


export let getUsers = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let users = await userModel.find({role: "manager"}).populate({
              path: "departmentId",
              model: "department",
              select: "name"
            });
            if (users.length == 0) {
              return res.status(404).json({status: "failed", message: "Users length is 0"});
            }
          return res.status(200).json({status: "success", message: "All users fetch succussfully", data: users});    
        } else if(user.role == "manager") {
             let users = await userModel.find({role: "member", departmentId: user.departmentId}).populate({
              path: "departmentId",
              model: "department",
              select: "name"
            });
             if (users.length == 0) {
              return res.status(404).json({status: "failed", message: "Users length is 0"});
            }
            return res.status(200).json({status: "success", message: "All users fetch succussfully", data: users});    
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export let getAllUsers = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let users = await userModel.find({role: {$in: ["member", "manager"]}}).populate({
              path: "departmentId",
              model: "department",
              select: "name"
            });
            if (users.length == 0) {
              return res.status(404).json({status: "failed", message: "Users length is 0"});
            }
          return res.status(200).json({status: "success", message: "All users fetch succussfully", data: users});    
        } else if(user.role == "manager") {
             let users = await userModel.find({role: "member", departmentId: user.departmentId}).populate({
              path: "departmentId",
              model: "department",
              select: "name"
            });
             if (users.length == 0) {
              return res.status(404).json({status: "failed", message: "Users length is 0"});
            }
            return res.status(200).json({status: "success", message: "All users fetch succussfully", data: users});    
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

// GET /api/users/:id → Get single user

export let getUserById = async (req, res) => {
    try {
        let id = req.params.id;
         if (!id) {
            return res.status(400).json({status: "failed", message: "id is required"});
        }
        let user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({status: "failed", message: "user not found, id may wrong"});
            }
            res.status(200).json({status: "success", message: "user fetch succussfully", data: user});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

// DELETE /api/users/:id → Delete user

export let delUser = async (req, res) => {
    try {
        let id = req.params.id;        
        if (!id) {
            return res.status(400).json({status: "failed", message: "id is required"});
        }
        let deleted = await userModel.findById(id);
        if (!deleted) {
            return res.status(404).json({status: "failed", message: "user not found"})
        }
        let dep = await departmentModel.findById(deleted?.departmentId);
        let clients = await clientModel.updateMany({assignedTo: deleted._id}, {assignedTo: dep.managerId});
        let leads = await leadModel.updateMany({assignedTo: deleted._id}, {assignedTo: dep.managerId});
        let tasks = await taskModel.updateMany({assignedTo: deleted._id}, {assignedTo: dep.managerId});
        await userModel.findByIdAndDelete(id);
        res.status(200).json({status: "success", message: "user deleted successfully", data: deleted});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}
