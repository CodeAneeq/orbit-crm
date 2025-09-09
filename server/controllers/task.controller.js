import { userModel } from "../models/auth.model.js";
import { clientModel } from "../models/client.model.js";
import { departmentModel } from "../models/department.model.js";
import { taskModel } from "../models/task.model.js";
import sendMail from "../utilities/email.send.js";
import { createLog } from "./logs.controller.js";
import { createNotification } from "./notification.controller.js";

// POST /api/tasks → Add task
export let addTask = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
             let {clientId, assignedTo, title, description, deadline} = req.body;
        if (!clientId || !assignedTo || !title || !description || !deadline) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let client = await clientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({status: "failed", message: "Client not found, id is wrong"});
        }
        let member = await userModel.findById(assignedTo);
        if (!member) {
            return res.status(404).json({status: "failed", message: "user not found, id is wrong"});
        }
        let attachment;
        if (req.files) {
            attachment = req.files.map((item) => {
                return item.path
            })
        }                
        let newTask = await taskModel({
            title,
            description,
            deadline,
            clientId,
            assignedTo,
            departmentId: member.departmentId
        })
        await newTask.save();
        if (attachment) {
            newTask.attachment = attachment;
        }
        await newTask.save();
         const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task Assign To You!</h1>
            <p>Task: ${newTask.title}</p>
            <p>DueDate: ${newTask.deadline}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "task added Successfully",
            targetId: newTask._id,
            targetType: "task",
            departmentId: user.departmentId
        });
         await createNotification({
           userId:  member._id,
           message: `new task assign to you`
        });
        res.status(201).json({status: "success", message: "task created successfully", data: newTask});
        } else if (user.role == "manager") {
             let {clientId, assignedTo, title, description, deadline} = req.body;
        if (!clientId || !assignedTo || !title || !description || !deadline) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let client = await clientModel.findOne({_id: clientId, departmentId: user.departmentId});
        if (!client) {
            return res.status(404).json({status: "failed", message: "Client not found, id is wrong"});
        }
        let member = await userModel.findOne({_id: assignedTo, departmentId: user.departmentId});
        if (!member) {
            return res.status(404).json({status: "failed", message: "user not found, id is wrong"});
        }
        let attachment;
        if (req.files) {
            attachment = req.files.map((item) => {
                return item.path
            })
        }                
        let newTask = await taskModel({
            title,
            description,
            deadline,
            clientId,
            assignedTo,
            departmentId: member.departmentId
        })
        await newTask.save();
        if (attachment) {
            newTask.attachment = attachment;
        }
        await newTask.save();
        const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task Assign To You!</h1>
            <p>Task: ${newTask.title}</p>
            <p>DueDate: ${newTask.deadline}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "task added Successfully",
            targetId: newTask._id,
            targetType: "task",
            departmentId: user.departmentId
        });
        await createNotification({
           userId:  member._id,
           message: `new task assign to you`
        });
        res.status(201).json({status: "success", message: "task created successfully", data: newTask});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

// GET /api/tasks → List tasks (assigned tasks for team member, all for admin)
export let getTasks = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let allTasks = await taskModel.find().populate({
  path: "clientId",
  model: "client",
  select: "name"
});          
            if (allTasks.length == 0) {
                return res.status(404).json({status: "failed", message: "task not found, length is 0"});
            }
            return res.status(200).json({status: "success", message: "All tasks fetch succussfully", data: allTasks});
        } else if (user.role == "member") {
            let tasks = await taskModel.find({assignedTo: user._id}).populate(
               {
                 path: "clientId",
                 model: "client",
                 select: "name"
               }
            );
            if (tasks.length == 0) {
                return res.status(404).json({status: "failed", message: "tasks not found, no task is assigned to you"});
            }
            return res.status(200).json({status: "success", message: "All tasks fetch succussfully", data: tasks});
        } else {
            let tasks = await taskModel.find({departmentId: user.departmentId}).populate(
               {
                 path: "clientId",
                 model: "client",
                 select: "name"
               }
            );
            if (tasks.length == 0) {
                return res.status(404).json({status: "failed", message: "tasks not found, no task is assigned to you"});
            }
            return res.status(200).json({status: "success", message: "All tasks fetch succussfully", data: tasks});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export let getTaskById = async (req, res) => {
    try {
        let user = req.user;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "id is required"});
        }
        if (user.role == "member") {
            let task = await taskModel.findOne({assignedTo: user._id, _id: id});
            if (!task) {
                return res.status(404).json({status: "failed", message: "You dont have access to that task"});
            }
            res.status(200).json({status: "success", message: "tasks fetch succussfully", data: task});
        } else if (user.role == "admin") {
            let task = await taskModel.findById(id);
            if (!task) {
                return res.status(404).json({status: "failed", message: "task not found, id may wrong"});
            }
            res.status(200).json({status: "success", message: "task fetch succussfully", data: task});
        } else {
            let task = await taskModel.findOne({_id: id, departmentId: user.departmentId});
            if (!task) {
                return res.status(404).json({status: "failed", message: "task not found, id may wrong"});
            }
            res.status(200).json({status: "success", message: "task fetch succussfully", data: task});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

// DELETE /api/tasks/:id → Delete task
export let delTask = async (req, res) => {
    try {
        let id = req.params.id;                
        if (!id) {
            return res.status(400).json({status: "failed", message: "id is required"});
        }
        let user = req.user;
        if (user.role == "admin") {
            let deleted = await taskModel.findById(id);
            if (!deleted) {
                return res.status(404).json({status: "failed", message: "Task not found"});
            }
            let member = await userModel.findById(deleted.assignedTo);
            console.log(member);
            
            if (!member) {
                return res.status(404).json({status: "failed", message: "member not found"});
            }
           await taskModel.findByIdAndDelete(id);
            const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task delete successfully!</h1>
            <p>Task: ${deleted.title}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: "task deleted Successfully",
            targetId: deleted._id,
            targetType: "task",
            departmentId: user.departmentId
        });
            res.status(200).json({status: "success", message: "task deleted successfully", data: deleted});
        } else if (user.role == "manager") {
            let deleted = await taskModel.findOne({_id: id, departmentId: user.departmentId});
            if (!deleted) {
                return res.status(404).json({status: "failed", message: "Task not found"})
            } 
            let member = await userModel.findById(deleted.assignedTo);
            await taskModel.findByIdAndDelete(id);
            const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task delete successfully!</h1>
            <p>Task: ${deleted.title}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "task deleted Successfully",
            targetId: deleted._id,
            targetType: "task",
            departmentId: user.departmentId
        });
        res.status(200).json({status: "success", message: "task deleted successfully", data: deleted});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

// PUT /api/tasks/:id → Update task status or details
export let updateTask = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "id is required"});
        }
        let user = req.user;
        if (user.role == "admin") {
             let {title, description, clientId, assignedTo, deadline} = req.body;
        if (!title || !description || !clientId || !assignedTo || !deadline) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
         let member = await userModel.findById(assignedTo);
         if (!member) {
            return res.status(404).json({status: "failed", message: "Member not found"})
         }
        const dep = await departmentModel.findById(member.departmentId);
        if (!dep) {
            return res.status(404).json({status: "failed", message: "department not found"});
        }
        let task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({status: "failed", message: "task not found, id may wrong"});
        }
        let attachment;
        if (req.files) {
            attachment = req.files.map((item) => {
                return item.path;
            })
        }
        task.title = title;
        task.description = description;
        task.clientId = clientId;
        task.assignedTo = assignedTo;
        task.deadline = deadline;
        task.attachment = attachment;
        task.departmentId = dep._id;
        await task.save();
       
        const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task updated successfully!</h1>
            <p>Task: ${task.title}</p>
            <p>Task: ${task.description}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: "task updated Successfully",
            targetId: task._id,
            targetType: "task",
            departmentId: user.departmentId
        });
        res.status(201).json({status: "success", message: "task updated successfully", data: task});
        } else if (user.role == "manager") {
            let {title, description, clientId, assignedTo, deadline} = req.body;
        if (!title || !description || !clientId || !assignedTo || !deadline) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let task = await taskModel.findOne({_id: id, departmentId: user.departmentId});
        if (!task) {
            return res.status(404).json({status: "failed", message: "task not found, id may wrong"});
        }
        let attachment;
        if (req.files) {
            attachment = req.files.map((item) => {
                return item.path;
            })
        }
        task.title = title;
        task.description = description;
        task.clientId = clientId;
        task.assignedTo = assignedTo;
        task.deadline = deadline;
        task.attachment = attachment;
        task.departmentId = user.departmentId;
        await task.save();
        let member = await userModel.findById(task.assignedTo);
        const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task updated successfully!</h1>
            <p>Task: ${task.title}</p>
            <p>Task: ${task.description}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "task updated Successfully",
            targetId: task._id,
            targetType: "task",
            departmentId: user.departmentId
        });
        res.status(201).json({status: "success", message: "task updated successfully", data: task});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export let changeStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let user = req.user;
        if (!id) {
            return res.status(400).json({status: "failed", message: "id is required"});
        }
        let {status} = req.body;
        if (!status) {
            return res.status(400).json({status: "failed", message: "status is required"});
        }
        if (user.role == "admin") {
            let task = await taskModel.findOne({_id: id});
            if (!task) {
                return res.status(404).json({status: "failed", message: "task not found"});
            }
            task.status = status;
            await task.save();
            let member = await userModel.findById(task.assignedTo);
            const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task status updated successfully!</h1>
            <p>Task: ${task.title}</p>
            <p>New Status: ${task.status}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "task status changed Successfully",
            targetId: task._id,
            targetType: "task",
            departmentId: user.departmentId
        });
         await createNotification({
           userId:  member._id,
           message: `status of task ${task._id} is change to ${status}`
        });
            res.status(200).json({status: "success", message: "status change successfully", data: task});
        } else if (user.role == "member") {
            let task = await taskModel.findOne({_id: id, assignedTo: user._id});
            if (!task) {
                return res.status(404).json({status: "failed", message: "task not found, or you dont have access"});
            }
            task.status = status;
            await task.save();
            let member = await userModel.findById(task.assignedTo);
            const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task status updated successfully!</h1>
            <p>Task: ${task.title}</p>
            <p>New Status: ${task.status}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
            await createLog({
            userId: user._id,
            action: "task status changed Successfully",
            targetId: task._id,
            targetType: "task",
            departmentId: user.departmentId
        });
        await createNotification({
           userId:  member._id,
           message: `status of task ${task._id} is change to ${status}`
        });
            res.status(200).json({status: "success", message: "status change successfully", data: task});
        } else {
            let task = await taskModel.findOne({_id: id, departmentId: user.departmentId});
            if (!task) {
                return res.status(404).json({status: "failed", message: "task not found, or you dont have access"});
            }
            task.status = status;
            await task.save();
            let member = await userModel.findById(task.assignedTo);
            const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task status updated successfully!</h1>
            <p>Task: ${task.title}</p>
            <p>New Status: ${task.status}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: "task status changed Successfully",
            targetId: task._id,
            targetType: "task",
            departmentId: user.departmentId
        });        
        await createNotification({
           userId:  member._id,
           message: `status of task ${task._id} is change to ${status}`
        });
            res.status(200).json({status: "success", message: "status change successfully", data: task});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export let assignTask = async (req, res) => {
    try {
        let user = req.user
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "Id is required"});
        }
        let {assignedTo} = req.body;
        let task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({status: "failed", message: "task not found"});
        }
        let member = await userModel.findOne({_id: assignedTo, departmentId: user.departmentId});
        if (!member) {
            return res.status(404).json({status: "failed", message: "user not found"});
        }
        task.assignedTo = assignedTo;
        await task.save()
            const emailSend = await sendMail({
            email: member.email,
            subject: "Task",
            html:  `
        <div>
            <h1>Task assigned to you successfully!</h1>
            <p>Task: ${task.title}</p>
            <p>Task Description: ${task.description}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: `task assign to ${member.name} Successfully`,
            targetId: task._id,
            targetType: "task",
            departmentId: user.departmentId
        });
        await createNotification({
           userId:  member._id,
           message: `new task assigned to you!`
        });
        res.status(200).json({status: "success", message: "task assigned successfully", data: task});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "success", message: "internal server error"});
    }
}