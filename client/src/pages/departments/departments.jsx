import React from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import Loader from '../../components/loader/loader'
import Table from '../../components/table/table'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import baseURL from '../../services/baseURL'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import AddBtn from '../../components/button/add-btn'
import Toster from '../../components/toster/toster'

const Departments = () => {
    const navigate = useNavigate();
    const role = useSelector(state => state.user.role);
    const isLogin = useSelector(state => state.user.isLogin);
    const [department, setDepartment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [txt, setTxt] = useState("");
    const [showToster, setShowToster] = useState("");

    const col = [
        { heading: "Department Name", key: "name" },
        {
            heading: "Members", key: "members"
        },
        {
            heading: "Actions",
            render: (row) => (
                <div>
                    <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => deleteDepartment(row._id)}
                    >
                        Delete
                    </span>
                </div>
            )
        }
    ];


    const getDepartments = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            let data = await axios.get(`${baseURL}/department/api/get-departments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDepartment(data.data.data);
            setLoading(false);
        } catch (error) {
            setShowToster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getDepartments();
    }, [])

    const deleteDepartment = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let data = await axios.delete(`${baseURL}/department/api/del-department/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.data.status == "success") {
                setTxt("department deleted successfully");
                setShowToster(true);
            }
            setDepartment(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            setShowToster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
        }
    }

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-5'>
                {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}
                {
                    loading ? <Loader></Loader> : <><div className='flex justify-between'>
                        <h1 className='text-3xl font-medium max-sm:text-lg'>Departments</h1>
                        {isLogin && role == "admin" ? <AddBtn txt={"Add Department"} onClick={() => navigate('/add-department')} /> : <></>}
                    </div>
                        {
                            department.length > 0 ? <Table data={department} columns={col} /> : <p className='mt-5'>DePARTMENT IS 0!</p>
                        }
                    </>
                }

            </div>
        </AdminLayout>
    )
}

export default Departments