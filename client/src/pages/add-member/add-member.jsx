import React, { useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import AuthInput from '../../components/input/auth-input'
import SquareBtn from '../../components/button/square-btn'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Toster from '../../components/toster/toster';
import { emailRegex, passwordRegex } from "../../services/helper";
import { useEffect } from 'react'

const AddMember = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loader, setLoader] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [txt, setTxt] = useState("");
    const [department, setDepartment] = useState([]);
    const [authError, setAuthError] = useState("");
    const [showError, setShowError] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [role, setRole] = useState("");


    const addMemberApi = async () => {
        const token = localStorage.getItem("token");
        setLoader(true);
        if (!emailRegex.test(email)) {
            setLoader(false);
            setShowError(true);
            return setAuthError("Email is not valid");
        }

        if (!passwordRegex.test(password)) {
            setLoader(false);
            setShowError(true);
            return setAuthError("Password is not valid");
        }

        try {
            setShowError(false);
            let payload = { name, email, password, departmentId: departmentName, role };
            const data = await axios.post(`${baseURL}/auth/api/sign-up`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoader(false);
            if (data.data.status == "success") {
                setTxt("Member added successfully");
                setShowToaster(true);
            }
        } catch (error) {
            setLoader(false);
            setShowError(false);
            console.log(error);
            setTxt(error.response.data.message);
            setShowToaster(true);
        }
    }

    const getDepartments = async () => {
        const token = localStorage.getItem("token");
        try {
            let data = await axios.get(`${baseURL}/department/api/get-departments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDepartment(data.data.data);
        } catch (error) {
            setShowToaster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
        }
    }

    useEffect(() => {
        getDepartments();
    }, [])

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToaster && <Toster txt={txt} show={showToaster} setShow={setShowToaster} />}
                <p><span className='text-gray-500'>Members /</span> Add Member</p>
                <h2 className='text-3xl font-medium mt-7'>Member Details</h2>
                <p className='text-xsm text-gray-500 mt-2'>View and manage member information</p>
                <div className='mt-7 flex flex-col gap-5'>
                    <AuthInput label={"Name"} placeholder={"Enter Name"} type={"text"} style={{ height: "32px" }} value={name} onChange={(e) => setName(e.target.value)} />
                    <AuthInput label={"Email"} placeholder={"Enter Email"} type={"text"} style={{ height: "32px" }} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <AuthInput label={"Password"} placeholder={"Enter Password"} type={"text"} style={{ height: "32px" }} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='mt-6'>
                    <label>Department</label>
                    <br />
                    <select name='departments' id='department' className='w-80 max-sm:w-70 mt-3 border-1 border-gray-200 rounded-lg p-2' onChange={(e) => setDepartmentName(e.target.value)}>
                        {
                            department?.map((item) => {
                                return <option value={item._id} key={item._id} >
                                    {item.name}
                                </option>
                            })
                        }
                    </select>
                </div>
                <div className='mt-6'>
                    <p>Role: </p>
                    <input type="radio" value="member" name='role' placeholder='Member' onChange={() => setRole("member")} />
                    <label className='ml-2'>Member</label>
                    <span className='ml-5'>
                        <input type="radio" value="manager" name='role' placeholder='Member' onChange={() => setRole("manager")} />
                        <label className='ml-2'>Manager</label>
                    </span>
                </div>
                <p className='text-red-500 mt-3 mb-2 text-sm'>{showError && authError}</p>
                <div className='flex justify-end gap-5 mt-5'>
                    <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/members")} />
                    <SquareBtn className={"bg-blue-500 text-white"} loading={loader} txt={"Save"} onClick={() => { addMemberApi() }} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddMember