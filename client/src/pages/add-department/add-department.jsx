import React, { useState } from 'react';
import AdminLayout from '../../components/layout/admin-layout';
import Toster from '../../components/toster/toster';
import AuthInput from '../../components/input/auth-input';
import SquareBtn from '../../components/button/square-btn'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../services/baseURL';


const AddDepartment = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [txt, setTxt] = useState("");

    const addDepartmenrtApi = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            let payload = { name, description };
            const data = await axios.post(`${baseURL}/department/api/add-department`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            if (data.data.status == "success") {
                setTxt("department added successfully");
                setShowToaster(true);
            }
        } catch (error) {
            console.log(error);
            setTxt(error.response.data.message);
            setShowToaster(true);
            setLoading(false);
        }
    }

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToaster && <Toster show={showToaster} setShow={setShowToaster} txt={txt} />}
                <p><span className='text-gray-500'>Department /</span> Add Department</p>
                <h2 className='text-3xl font-medium mt-7'>Department Details</h2>
                <p className='text-xsm text-gray-500 mt-2'>View and manage client information</p>
                <div className='mt-7 flex flex-col gap-5'>
                    <AuthInput label={"Name"} placeholder={"Enter Name"} type={"text"} style={{ height: "32px" }} value={name} onChange={(e) => setName(e.target.value)} />
                    <div className='mt-5'>
                        <label className='text-start'>Notes</label>
                        <br />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={"Enter Description"} className='h-25 mt-5 py-2 w-80 px-4 border-1 border-gray-300 rounded-lg max-sm:w-70'></textarea>
                    </div>

                </div>
                <div className='flex justify-end gap-5 mt-5'>
                    <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/departments")} />
                    <SquareBtn className={"bg-blue-500 text-white"} txt={"Save"} loading={loading} onClick={() => addDepartmenrtApi()} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddDepartment