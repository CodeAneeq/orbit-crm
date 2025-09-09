import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import SquareBtn from '../../components/button/square-btn'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Toster from '../../components/toster/toster';

const AddLead = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState("")
    const [memberId, setMemberId] = useState("")
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
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

    const addLeadAPI = async () => {
        const token = localStorage.getItem("token");
        setLoading(true)
        try {
            let payload = { clientId, notes, assignedTo: memberId };

            let data = await axios.post(`${baseURL}/lead/api/add-lead`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            if (data.data.status == "success") {
                setTxt("Lead created successfully");
                setShowToaster(true);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setTxt(error.response.data.message);
            setShowToaster(true);
        }
    }

    useEffect(() => {
        getClients()
        getMembers()
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
                <p><span className='text-gray-500'>Leads /</span> Add Lead</p>
                <h2 className='text-3xl font-medium mt-7'>Lead Details</h2>
                <p className='text-xsm text-gray-500 mt-2'>View and manage lead information</p>
                <div className='mt-7 flex flex-col gap-5'>
                    <div>
                        <label>Select Client</label>
                        <br />
                        <select name="clients" id="clients" className='w-80 max-sm:w-70 mt-5 border-1 border-gray-200 rounded-lg p-2' value={clientId} onChange={(e) => setClientId(e.target.value)}>
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
                        <select name="members" id="members" value={memberId} className='w-80 max-sm:w-70 mt-5 border-1 border-gray-200  rounded-lg p-2' onChange={(e) => setMemberId(e.target.value)}>
                            {
                                users.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='mt-5'>
                        <label className='text-start'>Notes</label>
                        <br />
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={"Enter note"} className='h-25 mt-5 py-2 w-80 px-4 border-1 border-gray-300 rounded-lg max-sm:w-70'></textarea>
                    </div>

                </div>
                <div className='flex justify-end gap-5 mt-5'>
                    <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/leads")} />
                    <SquareBtn className={"bg-blue-500 text-white"} loading={loading} txt={"Save"} onClick={() => addLeadAPI()} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddLead