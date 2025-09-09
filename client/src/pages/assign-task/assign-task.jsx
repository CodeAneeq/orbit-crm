import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import SquareBtn from '../../components/button/square-btn'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Toster from '../../components/toster/toster'


const AssignTask = () => {
    const navigate = useNavigate();
    const {id} = useParams();    
    const [memberName, setMemberName] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [txt, setTxt] = useState("");


    const assignTaskApi = async () => {
        const token = localStorage.getItem("token");
        setLoading(true)
        try {
            let payload = {assignedTo: memberName};
            const res = await axios.put(`${baseURL}/task/api/assign-task/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }               
            })
            setLoading(false);                        
            if (res.data.status == "success") {
                setTxt("task assigned successfully");
                setShowToaster(true);
            }
        } catch (error) {
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
            {showToaster && <Toster show={showToaster} setShow={setShowToaster} txt={txt}/>}
            <p><span className='text-gray-500'>Task /</span> Assign Task</p>
            <h2 className='text-3xl font-medium mt-7'>Assign Task</h2>
            <p className='text-xsm text-gray-500 mt-2'>View and manage task assign</p>
            <div className='mt-7 flex flex-col gap-5'>
                    <div>
                        <label>Assigned To</label>
                        <br />
                        <select name='member' id='member' className='w-80 max-sm:w-70 mt-3 border-1 border-gray-200 rounded-lg p-2' value={memberName} onChange={(e) => setMemberName(e.target.value)}>
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
                <SquareBtn className={"bg-gray-300"} txt={"Cancel"} onClick={() => navigate("/tasks")}/>
                <SquareBtn className={"bg-blue-500 text-white"} txt={"Save"} loading={loading} onClick={() => assignTaskApi()}/>
            </div>
        </div>
    </AdminLayout>
  )
}

export default AssignTask