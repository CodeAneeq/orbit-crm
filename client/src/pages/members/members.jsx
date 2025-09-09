import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/admin-layout';
import AddBtn from '../../components/button/add-btn';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/table/table';
import axios from 'axios';
import baseURL from '../../services/baseURL';
import Loader from '../../components/loader/loader';
import { useSelector } from 'react-redux';
import Toster from '../../components/toster/toster';

const Members = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const role = useSelector(state => state.user.role);
    const [txt, setTxt] = useState("");
    const [showToster, setShowToster] = useState("");


    const columns = [
        { heading: "Name", key: "Name" },
        { heading: "Email", key: "email" },
        { heading: "Department", render: (row) => row?.departmentId?.name },

    ];

    const adminColumns = [
        ...columns,
        {
            heading: "Actions",
            render: (row) => (
                <div>
                    <span
                        className="text-red-500 cursor-pointer ml-2"
                        onClick={() => deleteMember(row._id)}
                    >
                        Delete
                    </span>
                </div>
            )
        }
    ]

    const getMembers = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            let data = await axios.get(`${baseURL}/auth/api/get-all-users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(data.data.data);
            setLoading(false);
        } catch (error) {
            setShowToster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
            setLoading(false);
        }
    }

    const deleteMember = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let data = await axios.delete(`${baseURL}/auth/api/del-user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.data.status == "success") {
                setShowToster(true);
                setTxt("Member deleted successfully");
            }
            setUsers(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            setShowToster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
        }
    }

    useEffect(() => {
        getMembers();
    }, [])

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}

                {
                    loading ? <Loader></Loader> : <>  <div className='flex justify-between'>
                        <h1 className='text-3xl font-medium max-sm:text-lg'>Team Members</h1>
                        {role == "admin" ? <AddBtn txt={"Add Member"} onClick={() => navigate('/add-member')} /> : <></>}
                    </div>
                        <Table data={users} columns={role == "admin" ? adminColumns : columns} /></>
                }

            </div>
        </AdminLayout>
    )
}

export default Members