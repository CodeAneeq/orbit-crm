import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import AuthInput from '../../components/input/auth-input'
import SquareBtn from '../../components/button/square-btn'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Toster from '../../components/toster/toster'
import { dateRegex } from '../../services/helper'

const AddTask = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState("")
    const [memberId, setMemberId] = useState("")
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [attachments, setAttachment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateError, setDateError] = useState("");
    const [showToaster, setShowToaster] = useState(false);
    const [showError, setShowError] = useState(false);
    const [txt, setTxt] = useState("");


    const getClients = async () => {
        const token = localStorage.getItem("token");
        try {
            let data = await axios.get(`${baseURL}/client/api/get-clients`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setClients(data.data.data);
        } catch (error) {
            setShowToaster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
        }
    }


    const getMembers = async () => {
        const token = localStorage.getItem("token");
        try {
            let data = await axios.get(`${baseURL}/auth/api/get-users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(data.data.data);
        } catch (error) {
            setShowToaster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
        }
    }

    const addTaskAPI = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        if (!dateRegex.test(dueDate) || new Date(dueDate).getTime() <= Date.now) {
            setLoading(false);
            setShowError(true);
            return setDateError("Date is not valid")
        }
        try {
            setShowError(false);
            const formData = new FormData();
            formData.append("clientId", clientId);
            formData.append("assignedTo", memberId);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("deadline", dueDate);
            attachments.forEach((item) => (
                formData.append("image", item)
            ))

            let data = await axios.post(`${baseURL}/task/api/add-task`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            if (data.data.status == "success") {
                setTxt("task created successfully");
                setShowToaster(true);
            }
        } catch (error) {
            console.log(error);
            setShowError(false);
            setLoading(false);
            setTxt(error.response.data.message);
            setShowToaster(true);
        }
    }

    useEffect(() => {
        getClients();
        getMembers();
    }, [])


    useEffect(() => {
        if (users.length > 0 && !memberId) {
            setMemberId(users[0]._id);   // default first member id

        }
    }, [users]);
    useEffect(() => {
        if (clients.length > 0 && !clientId) {
            setClientId(clients[0]._id);
        }
    }, [clients]);

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToaster && <Toster txt={txt} show={showToaster} setShow={setShowToaster} />}
                <p><span className='text-gray-500'>Tasks /</span> Add Task</p>
                <h2 className='text-3xl font-medium mt-7'>Task Details</h2>
                <p className='text-xsm text-gray-500 mt-2'>View and manage task information</p>
                <div className='flex flex-col gap-5'>
                    <div className='mt-7 flex flex-col gap-5'>
                        <AuthInput label={"title"} placeholder={"Enter Title"} type={"text"} style={{ height: "32px" }} value={title} onChange={(e) => setTitle(e.target.value)} />
                        <AuthInput label={"description"} placeholder={"Enter Description"} type={"text"} style={{ height: "32px" }} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label>Attachments</label>
                        <br />
                        <input type="file" multiple className='border-1 border-gray-200 p-2 max-sm:w-70 rounded-lg w-80' onChange={(e) => setAttachment([...e.target.files])} />
                    </div>
                    <div>
                        <label>Select Client</label>
                        <br />
                        <select name="clients" id="clients" value={clientId} className='w-80 mt-3 max-sm:w-70 border-1 border-gray-200 rounded-lg p-2' onChange={(e) => setClientId(e.target.value)}>
                            {
                                clients.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <label>Select Member</label>
                        <br />
                        <select name="members" id="members" value={memberId} className='w-80 max-sm:w-70 mt-3 border-1 border-gray-200 rounded-lg p-2' onChange={(e) => setMemberId(e.target.value)}>
                            {
                                users.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <AuthInput label={"Deadline"} placeholder={"Enter Deadline"} type={"text"} style={{ height: "32px" }} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <p className='text-red-500 mt-3 mb-2 text-sm'>{showError && dateError}</p>
                </div>
                <div className='flex justify-end gap-5 mt-5'>
                    <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/tasks")} />
                    <SquareBtn className={"bg-blue-500 text-white"} txt={"Save"} loading={loading} onClick={() => addTaskAPI()} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddTask