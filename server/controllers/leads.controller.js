// Leads
// PUT /api/leads/:id → Update lead

import { userModel } from "../models/auth.model.js";
import { clientModel } from "../models/client.model.js";
import { leadModel } from "../models/leads.model.js";
import { departmentModel } from "../models/department.model.js";
import sendMail from "../utilities/email.send.js";
import { createLog } from "./logs.controller.js";
import { createNotification } from "./notification.controller.js";


// POST /api/leads → Add lead
export let addLead = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let { clientId, assignedTo, notes } = req.body;
        if (!clientId || !assignedTo) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }
        let assignedUser = await userModel.findById(assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        let client = await clientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ status: "failed", message: "client not found" });
        }
        let newLead = new leadModel({
            clientId,
            assignedTo,
            departmentId: assignedUser.departmentId
        })
        await newLead.save();
        if (notes) {
            newLead.notes = notes;
        }
        await newLead.save();
        const dep = await departmentModel.findById(assignedUser.departmentId);
        const emailSend = await sendMail({
            email: assignedUser.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>New Lead Assigned To You!</h1>
            <p>Client: ${client.name}</p>
            <p>Department: ${dep.name}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: "lead added Successfully",
            targetId: newLead._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
         await createNotification({
                        userId: assignedUser._id,
                        message: "New lead Assign To You!"
                    })
        res.status(201).json({ status: "success", message: "Lead is created successfully", data: newLead });
        } else if(user.role == "manager") {
            let { clientId, assignedTo, notes } = req.body;
        if (!clientId || !assignedTo) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }
        let userExisted = await userModel.findOne({_id: assignedTo, departmentId: user.departmentId});
        if (!userExisted) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }
        let client = await clientModel.findOne({_id: clientId, departmentId: user.departmentId});
        if (!client) {
            return res.status(404).json({ status: "failed", message: "client not found" });
        }
        let newLead = new leadModel({
            clientId,
            assignedTo,
            departmentId: userExisted.departmentId
        })
        await newLead.save();
        if (notes) {
            newLead.notes = notes;
        }
        await newLead.save();
         const emailSend = sendMail({
            email: userExisted.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>New Lead Assigned To You!</h1>
            <p>Client: ${client.name}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: "lead added Successfully",
            targetId: newLead._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
        await createNotification({
                        userId: userExisted._id,
                        message: "New lead Assign To You!"
                    })
        res.status(201).json({ status: "success", message: "Lead is created successfully", data: newLead });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

// change status
export let changeStatusOfLead = async (req, res) => {
    try {
        let user = req.user;
        let { status } = req.body;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "Id is required" });
        }
        if (!status) {
            return res.status(400).json({ status: "failed", message: "status is required" });
        }
        if (user.role == "admin") {
            let lead = await leadModel.findById(id);
            lead.status = status;
            await lead.save();
            let existedUser = await userModel.findById(lead.assignedTo);
            const emailSend = await sendMail({
            email: existedUser.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>Lead Status is change</h1>
            <p>Lead: ${lead._id}</p>
            <p>New Status: ${lead.status}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
        await createLog({
            userId: user._id,
            action: "lead status change Successfully",
            targetId: lead._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
        await createNotification({
                        userId: existedUser._id,
                        message: `Status of lead ${lead._id} is change to ${status}`
                    })
            res.status(201).json({ status: "success", message: "status of lead is change successfully", data: lead });
        } else if(user.role == "member") {
            let lead = await leadModel.findById(id);
            if (lead.assignedTo.toString() !== user._id.toString()) {
                return res.status(402).json({ status: "failed", message: "you dont have access" });
            }
            lead.status = status;
            await lead.save()
            let existedUser = await userModel.findById(lead.assignedTo);
             const emailSend = await sendMail({
            email: existedUser.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>Lead Status is change</h1>
            <p>Lead: ${lead._id}</p>
            <p>New Status: ${lead.status}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "lead status change Successfully",
            targetId: lead._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
        await createNotification({
                        userId: existedUser._id,
                        message: `Status of lead ${lead._id} is change to ${status}`
                    })
            res.status(201).json({ status: "success", message: "status of lead is change successfully", data: lead });
        } else {
            let lead = await leadModel.findOne({_id: id, departmentId: user.departmentId});
            if (!lead) {
                return res.status(404).json({ status: "failed", message: "lead not found" });
            }
            lead.status = status;
            await lead.save();
            let existedUser = await userModel.findById(lead.assignedTo);
             const emailSend = await sendMail({
            email: existedUser.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>Lead Status is change</h1>
            <p>Lead: ${lead._id}</p>
            <p>New Status: ${lead.status}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "lead status change Successfully",
            targetId: lead._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
        await createNotification({
                        userId: existedUser._id,
                        message: `Status of lead ${lead._id} is change to ${status}`
        })
            res.status(201).json({ status: "success", message: "status of lead is change successfully", data: lead });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

// GET /api/leads → List leads (filter by assignedTo)
export let getLeads = async (req, res) => {
    try {
        let user = req.user;
        if (user.role == "admin") {
            let leads = await leadModel.find().populate({
                path: "clientId",
                model: "client",
                select: "name email phone"
            }); if (leads.length == 0) {
                return res.status(404).json({ status: "failed", message: "Leads not found, length is 0" });
            }
            res.status(200).json({ status: "success", message: "Leads fetch successfully", data: leads });
        }
        else if(user.role == "member") {
            let leads = await leadModel.find({ assignedTo: user._id }).populate({
                path: "clientId",
                model: "client",
                select: "name email phone"
            }); if (leads.length === 0) {
                return res.status(404).json({ status: "failed", message: "length of leads is null" });
            }
            res.status(200).json({ status: "success", message: "leads fetch successfully", data: leads });
        } else {
            let leads = await leadModel.find({ departmentId: user.departmentId  }).populate({
                path: "clientId",
                model: "client",
                select: "name email phone"
            }); if (leads.length === 0) {
                return res.status(404).json({ status: "failed", message: "length of leads is null" });
            }
            res.status(200).json({ status: "success", message: "leads fetch successfully", data: leads });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

// GET /api/leads/:id → Get lead details
export let getLeadById = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "Id is required" });
        }
        let lead = await leadModel.findById(id);
        if (!lead) {
            return res.status(404).json({ status: "failed", message: "lead not found. id is wrong" });
        }
        res.status(200).json({ status: "success", message: "lead fetch successfully", data: lead });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

// DELETE /api/leads/:id → Delete lead
export let delLead = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "id is required" });
        }
        let user = req.user;
        if (user.role == "admin") {
            let deleted = await leadModel.findById(id);
            let existedUser = await userModel.findById(deleted?.assignedTo);            
            await leadModel.findByIdAndDelete(id);
            const emailSend = await sendMail({
            email: existedUser?.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>Lead Deleted Successfully!</h1>
            <p>Lead: ${deleted?._id}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "lead deleted Successfully",
            targetId: deleted._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
            res.status(200).json({ status: "success", message: "lead deleted successfully", data: deleted });
        } else if(user.role == "manager") {
            let deleted = await leadModel.findOne({_id: id, departmentId: user.departmentId});
            if (!deleted) {
                return res.status(404).json({status: "failed", message: "Lead not found"});
            }
            let existedUser = await userModel.findById(deleted.assignedTo);
            await leadModel.findByIdAndDelete(id);
            const emailSend = await sendMail({
            email: existedUser.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>Lead Deleted successfully!</h1>
            <p>Lead: ${deleted._id}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: "lead deleted Successfully",
            targetId: deleted._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
            res.status(200).json({status: "failed", message: "lead deleted succussfully", data: deleted});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

export let assignLead = async (req, res) => {
    try {
        let user = req.user
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "Id is required"});
        }
        let {assignedTo} = req.body;
        let lead = await leadModel.findById(id);
        if (!lead) {
            return res.status(404).json({status: "failed", message: "lead not found"});
        }
        let member = await userModel.findOne({_id: assignedTo, departmentId: user.departmentId});
        if (!member) {
            return res.status(404).json({status: "failed", message: "user not found"});
        }
        lead.assignedTo = assignedTo;
        await lead.save()
        const dep = await departmentModel.findById(member.departmentId);
         const emailSend = await sendMail({
            email: member.email,
            subject: "Lead",
            html:  `
        <div>
            <h1>New Lead Assigned To You!</h1>
            <p>Lead: ${lead._id}</p>
            <p>Department: ${dep.name}</p>
        </div>
    `
        })
        if (!emailSend) {
            return res.status(500).json({status: "failed", message: "Bad Response"})
        }
         await createLog({
            userId: user._id,
            action: `lead assigned to ${member.name} Successfully`,
            targetId: lead._id,
            targetType: "lead",
            departmentId: user.departmentId
        });
        await createNotification({
                        userId:  member._id,
                        message: `new lead assign to you`
        });
        res.status(200).json({status: "success", message: "lead assigned successfully", data: lead});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "success", message: "internal server error"});
    }
}