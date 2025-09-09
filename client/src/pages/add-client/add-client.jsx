import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import AuthInput from '../../components/input/auth-input'
import SquareBtn from '../../components/button/square-btn'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Toster from '../../components/toster/toster'
import { emailRegex, phoneRegex } from '../../services/helper'

const AddClient = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [memberName, setMemberName] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [txt, setTxt] = useState("");
    const [showError, setShowError] = useState(false);
    const [inputError, setInputError] = useState("");

    const addClientApi = async () => {
        const token = localStorage.getItem("token");
        setLoading(true)
        if (!emailRegex.test(email)) {
            setLoading(false);
            setShowError(true);
            return setInputError("Email is not valid");
        }
        if (!phoneRegex.test(phone)) {
            setLoading(false);
            setShowError(true);
            return setInputError("Number is not valid");
        }
        try {
            setShowError(false);
            let payload = { name, email, phone, company, assignedTo: memberName };
            const data = await axios.post(`${baseURL}/client/api/add-client`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            if (data.data.status == "success") {
                setTxt("client added successfully");
                setShowToaster(true);
            }
        } catch (error) {
            setShowError(false);
            console.log(error);
            setTxt(error.response.data.message);
            setShowToaster(true);
            setLoading(false);
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
            setMemberName(users[0]._id);   // default first member id
        }
    }, [users]);

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToaster && <Toster show={showToaster} setShow={setShowToaster} txt={txt} />}
                <p><span className='text-gray-500'>Client /</span> Add Client</p>
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
                        <select name='departments' id='department' className='w-80 max-sm:w-70 mt-3 border-1 border-gray-200 rounded-lg p-2' value={memberName} onChange={(e) => setMemberName(e.target.value)}>
                            {
                                users.map((item) => {
                                    return <option value={item._id} key={item._id} >
                                        {item.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                    <p className='text-red-500 mt-3 mb-2 text-sm'>{showError && inputError}</p>

                </div>
                <div className='flex justify-end gap-5 mt-5'>
                    <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/clients")} />
                    <SquareBtn className={"bg-blue-500 text-white"} txt={"Save"} loading={loading} onClick={() => addClientApi()} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddClient