import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/admin-layout';
import baseURL from '../../services/baseURL';
import axios from 'axios';
import AuthInput from '../../components/input/auth-input';
import SquareBtn from '../../components/button/square-btn';
import Toster from '../../components/toster/toster';

const UpdateClient = () => {
    const { id } = useParams();
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [memberName, setMemberName] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [txt, setTxt] = useState("");


    const updateClientApi = async () => {
        const token = localStorage.getItem("token");
        setLoading(true)
        try {
            let payload = { name, email, phone, company, assignedTo: memberName };
            const data = await axios.put(`${baseURL}/client/api/update-client/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.data.status == "success") {
                setTxt("client updated successfully");
                setShowToaster(true);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setTxt(error.response.data.message);
            setShowToaster(true);
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

    useEffect(() => {
        getMembers();
    }, [])

    useEffect(() => {
        if (users.length > 0 && !memberName) {
            setMemberName(users[0]._id);
        }
    }, [users]);

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToaster && <Toster show={showToaster} txt={txt} setShow={setShowToaster} />}
                <p><span className='text-gray-500'>Client /</span> Update Client</p>
                <h2 className='text-3xl font-medium mt-7'>Client Details</h2>
                <p className='text-xsm text-gray-500 mt-2'>View and manage client information</p>
                <div className='mt-7 flex flex-col gap-5'>
                    <AuthInput label={"Name"} placeholder={"Enter Name"} type={"text"} style={{ height: "32px" }} value={name} onChange={(e) => setName(e.target.value)} />
                    <AuthInput label={"Email"} placeholder={"Enter Email"} type={"text"} style={{ height: "32px" }} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <AuthInput label={"Phone"} placeholder={"Enter Phone"} type={"text"} style={{ height: "32px" }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <AuthInput label={"Company"} placeholder={"Enter Company"} type={"text"} style={{ height: "32px" }} value={company} onChange={(e) => setCompany(e.target.value)} />
                    <div>
                        <label>Assigned To</label>
                        <br />
                        <select name='member' id='member' value={memberName} className='w-80 max-sm:w-70 mt-3 border-1 border-gray-200 rounded-lg p-2' onChange={(e) => setMemberName(e.target.value)}>
                            {
                                users.map((item) => {
                                    return <option value={item._id} key={item._id} >
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='flex justify-end gap-5 mt-5'>
                    <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/clients")} />
                    <SquareBtn className={"bg-blue-500 text-white"} loading={loading} txt={"Save"} onClick={() => updateClientApi()} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default UpdateClient