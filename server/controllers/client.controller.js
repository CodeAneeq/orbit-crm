import { userModel } from "../models/auth.model.js";
import { clientModel } from "../models/client.model.js";
import { departmentModel } from "../models/department.model.js";
import sendMail from "../utilities/email.send.js";
import { createLog } from "./logs.controller.js";
import { createNotification } from "./notification.controller.js";

// POST /api/clients → Add client

let addClient = async (req, res) => {
    try {
        let userReq = req.user;
        if (userReq.role == "admin") {
            let { name, email, phone, company, assignedTo } = req.body;
            if (!name || !email || !phone || !company || !assignedTo) {
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }
            let user = await userModel.findById(assignedTo);
            if (!user) {
                return res.status(404).json({ status: "failed", message: "User not found id may wrong" });
            }
            const dep = await departmentModel.findById(user.departmentId);
            if (!dep) {
                return res.status(404).json({ status: "failed", message: "department not found" });
            }
            let client = new clientModel({
                name,
                email,
                phone,
                company,
                assignedTo,
                departmentId: dep._id
            });
            await client.save();
            await createLog({
                userId: userReq._id,
                action: "Client Added Successfully",
                targetId: client._id,
                targetType: "client",
                departmentId: userReq.departmentId
            });

            const emailSend = await sendMail({
                email: user.email,
                subject: "Client",
                html: `
        <div>
            <h1>Client assigned to you successfully!</h1>
            <p>Client: ${client.name}</p>
            <p>Client Email: ${client.email}</p>
        </div>
    `
            })
            if (!emailSend) {
                return res.status(500).json({ status: "failed", message: "Bad Response" })
            }
            await createNotification({
                userId: user._id,
                message: "New Client Assign To You!"
            })
            res.status(201).json({ status: "success", message: "Client created successfully", data: client });
        } else if (userReq.role == "manager") {
            let { name, email, phone, company, assignedTo } = req.body;
            if (!name || !email || !phone || !company || !assignedTo) {
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }
            let user = await userModel.findOne({ _id: assignedTo, departmentId: userReq.departmentId });
            if (!user) {
                return res.status(404).json({ status: "failed", message: "User not found id may wrong" });
            }
            let client = new clientModel({
                name,
                email,
                phone,
                company,
                assignedTo,
                departmentId: userReq.departmentId
            });
            await client.save();
            await createLog({
                userId: userReq._id,
                action: "Client Added Successfully",
                targetId: client._id,
                targetType: "client",
                departmentId: userReq.departmentId
            });

            const emailSend = await sendMail({
                email: user.email,
                subject: "Client",
                html: `
        <div>
            <h1>Client assigned to you successfully!</h1>
            <p>Client: ${client.name}</p>
            <p>Client Email: ${client.email}</p>
        </div>
    `
            })
            if (!emailSend) {
                return res.status(500).json({ status: "failed", message: "Bad Response" })
            }
             await createNotification({
                userId: user._id,
                message: "New Client Assign To You!"
            })
            res.status(201).json({ status: "success", message: "Client created successfully", data: client });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

let getClients = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let allClients = await clientModel.find();
            if (allClients.length == 0) {
                return res.status(404).json({ status: "failed", message: "Clients not found, length is 0" });
            }
            return res.status(200).json({ status: "success", message: "All clients fetch succussfully", data: allClients });
        } else if (user.role == "member") {
            let clients = await clientModel.find({ assignedTo: user._id });
            if (clients.length == 0) {
                return res.status(404).json({ status: "failed", message: "Clients not found, no client is assigned to you" });
            }
            return res.status(200).json({ status: "success", message: "All clients fetch succussfully", data: clients });
        } else {
            let clients = await clientModel.find({ departmentId: user.departmentId });
            if (clients.length == 0) {
                return res.status(404).json({ status: "failed", message: "Clients not found, no client is assigned to you" });
            }
            return res.status(200).json({ status: "success", message: "All clients fetch succussfully", data: clients });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

let getClientById = async (req, res) => {
    try {
        let user = req.user;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "id is required" });
        }
        let client = await clientModel.findById(id);
        if (!client) {
            return res.status(404).json({ status: "failed", message: "client not found, id may wrong" });
        }
        res.status(200).json({ status: "success", message: "client fetch succussfully", data: client })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

// PUT /api/clients/:id → Update client

let updateClient = async (req, res) => {
    try {
        let user = req.user;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "id is required" });
        }
        if (user.role == "admin") {
            let { name, email, phone, company, assignedTo } = req.body;
            if (!name || !email || !phone || !company || !assignedTo) {
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }
            let client = await clientModel.findById(id);
            if (!client) {
                return res.status(404).json({ status: "failed", message: "Client not found, id may wrong" });
            }
            const userExisted = await userModel.findById(assignedTo);
            if (!userExisted) {
                return res.status(404).json({ status: "failed", message: "user not found, id may wrong" });
            }
            client.name = name;
            client.email = email;
            client.phone = phone;
            client.company = company;
            client.assignedTo = assignedTo;
            await client.save();
            const emailSend = await sendMail({
                email: userExisted.email,
                subject: "Client",
                html: `
        <div>
            <h1>Client updated successfully!</h1>
            <p>Client: ${client.name}</p>
            <p>Client Email: ${client.email}</p>
        </div>
    `
            })
            if (!emailSend) {
                return res.status(500).json({ status: "failed", message: "Bad Response" })
            }
            await createLog({
                userId: user._id,
                action: "Client updated Successfully",
                targetId: client._id,
                targetType: "client",
                departmentId: user.departmentId
            });
             await createNotification({
                userId: user._id,
                message: "Client Assign To You!"
            })
            res.status(201).json({ status: "success", message: "Client updated successfully", data: client });
        } else if (user.role == "manager") {
            let { name, email, phone, company, assignedTo } = req.body;
            if (!name || !email || !phone || !company || !assignedTo) {
                return res.status(400).json({ status: "failed", message: "All fields are required" });
            }
            let client = await clientModel.findOne({ _id: id, departmentId: user.departmentId });
            if (!client) {
                return res.status(404).json({ status: "failed", message: "Client not found, id may wrong" });
            }
            const dep = await departmentModel.findById(user.departmentId);
            if (!dep) {
                return res.status(404).json({ status: "failed", message: "department not found" });
            }
            let userExisted = await userModel.findById(assignedTo);
            if (!userExisted) {
                return res.status(404).json({ status: "failed", message: "user not found" });
            }
            client.name = name;
            client.email = email;
            client.phone = phone;
            client.company = company;
            client.assignedTo = assignedTo;
            client.departmentId = user.departmentId;
            await client.save();
             await createLog({
                userId: user._id,
                action: "Client updated Successfully",
                targetId: client._id,
                targetType: "client",
                departmentId: user.departmentId
            });
            const emailSend = await sendMail({
                email: userExisted.email,
                subject: "Client",
                html: `
        <div>
            <h1>Client updated successfully successfully!</h1>
            <p>Client: ${client.name}</p>
            <p>Client Email: ${client.email}</p>
        </div>
    `
            })
            if (!emailSend) {
                return res.status(500).json({ status: "failed", message: "Bad Response" })
            }
            res.status(201).json({ status: "success", message: "Client updated successfully", data: client });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

// DELETE /api/clients/:id → Delete client

let delClient = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "id is required" });
        }
        let user = req.user;
        if (user.role == "admin") {
            let deleted = await clientModel.findById(id);
            await clientModel.findByIdAndDelete(id);
            const emailSend = await sendMail({
                email: user.email,
                subject: "Client",
                html: `
        <div>
            <h1>Client deleted successfully!</h1>
            <p>Client: ${deleted?.name}</p>
            <p>Client Email: ${deleted?.email}</p>
        </div>
    `
            })
            if (!emailSend) {
                return res.status(500).json({ status: "failed", message: "Bad Response" })
            }
            await createLog({
                userId: user._id,
                action: "Client deleted Successfully",
                targetId: deleted._id,
                targetType: "client",
                departmentId: user.departmentId
            });
            res.status(200).json({ status: "success", message: "Client deleted successfully", data: deleted });
        } else if (user.role == "manager") {
            let client = await clientModel.findOne({ _id: id, departmentId: user.departmentId });
            if (!client) {
                return res.status(404).json({ status: "failed", message: "Client Not Found" });
            }
            let deleted = await clientModel.findByIdAndDelete(id);
            const emailSend = await sendMail({
                email: user.email,
                subject: "Client",
                html: `
        <div>
            <h1>Client deleted successfully!</h1>
            <p>Client: ${deleted?.name}</p>
            <p>Client Email: ${deleted?.email}</p>
        </div>
    `
            })
            if (!emailSend) {
                return res.status(500).json({ status: "failed", message: "Bad Response" })
            }
             await createLog({
                userId: user._id,
                action: "Client deleted Successfully",
                targetId: deleted._id,
                targetType: "client",
                departmentId: user.departmentId
            });
            res.status(200).json({ status: "success", message: "Client deleted successfully", data: deleted });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

let assignClient = async (req, res) => {
    try {
        let user = req.user
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "Id is required" });
        }
        let { assignedTo } = req.body;
        let client = await clientModel.findById(id);
        if (!client) {
            return res.status(404).json({ status: "failed", message: "Client not found" });
        }
        let member = await userModel.findOne({ _id: assignedTo, departmentId: user.departmentId });
        if (!member) {
            return res.status(404).json({ status: "failed", message: "user not found" });
        }
        client.assignedTo = assignedTo;
        await client.save()
        const emailSend = await sendMail({
            email: member.email,
            subject: "Client",
            html: `
        <div>
            <h1>Client assigned to you successfully!</h1>
            <p>Client: ${client.name}</p>
            <p>Client Email: ${client.email}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({ status: "failed", message: "Bad Response" })
        }
         await createLog({
                userId: user._id,
                action: `Client assigned to ${member.name}`,
                targetId: client._id,
                targetType: "client",
                departmentId: user.departmentId
            });
             await createNotification({
                userId: member._id,
                message: "New Client Assign To You!"
            })
        res.status(200).json({ status: "success", message: "client assigned successfully", data: client });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "success", message: "internal server error" });
    }
}

export { addClient, updateClient, getClientById, delClient, getClients, assignClient }