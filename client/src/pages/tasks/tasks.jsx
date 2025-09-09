import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import AddBtn from '../../components/button/add-btn'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/table/table'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader/loader'
import Toster from '../../components/toster/toster'

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [unAssignTasks, setUnAssignTasks] = useState([]);
  const token = localStorage.getItem("token");
  const role = useSelector(state => state.user.role);
  const user = useSelector(state => state.user.userData);
  const [loading, setLoading] = useState(false);
  const [txt, setTxt] = useState("");
  const [showToster, setShowToster] = useState("");

  const columns = [
    { heading: "Task Name", key: "title" },
    { heading: "Associate Client", render: (row) => row.clientId?.name },
    { heading: "Due Date", key: "deadline" },
    {
      heading: "status", render: (row) => {
        return <select
          value={row.status}   // default agar status undefined ho
          onChange={(e) => changeTaskStatus(row._id, e.target.value)}
          className=" rounded py-1"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      }
    },
  ];

  const adminColumn = [
    ...columns,
    {
      heading: "Actions", render: (row) => (
        role == "member" ? <div>
          <span className='mr-5 text-green-500 cursor-pointer'
            onClick={() => navigate(`/view-task/${row._id}`)}>
            View
          </span>

        </div> : <div>
          <span className='mr-5 text-green-500 cursor-pointer'
            onClick={() => navigate(`/update-task/${row._id}`)}>
            Edit
          </span>
          <span className='mr-5 text-green-500 cursor-pointer'
            onClick={() => navigate(`/view-task/${row._id}`)}>
            View
          </span>
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => deleteTask(row._id)}
          >
            Delete
          </span>
        </div>

      )
    }
  ]

  const managerColumn = [
    { heading: "Task Name", key: "title" },
    { heading: "Associate Client", render: (row) => row.clientId?.name },
    { heading: "Due Date", key: "deadline" },
    {
      heading: "Actions", render: (row) => (
        <div>
          <span className='mr-3 text-green-500 cursor-pointer'
            onClick={() => navigate(`/update-task/${row._id}`)}>
            Edit
          </span>
          <span className='mr-3 text-green-500 cursor-pointer'
            onClick={() => navigate(`/assign-task/${row._id}`)}>
            Assign
          </span>
          <span className='mr-3 text-green-500 cursor-pointer'
            onClick={() => navigate(`/view-task/${row._id}`)}>
            View
          </span>
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => deleteTask(row._id)}
          >
            Delete
          </span>
        </div>
      )
    }
  ]


  const getTasks = async () => {
    setLoading(true);
    try {
      let data = await axios.get(`${baseURL}/task/api/get-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.data.status == "success") {
        if (role == "manager") {
        setTasks(data.data.data.filter((item) => item.assignedTo !== user._id));
        setUnAssignTasks(data.data.data.filter((item) => item.assignedTo == user._id));
      } else {
        setTasks(data.data.data);
      }
      }
      setLoading(false);
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  }

  const deleteTask = async (id) => {
    try {
      let data = await axios.delete(`${baseURL}/task/api/del-task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.data.status == "success") {
        setShowToster(true);
        setTxt("task deleted successfully");
      }
      setTasks(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
    }
  }

  const changeTaskStatus = async (id, status) => {
    try {
      let payload = { status };
      let data = await axios.post(`${baseURL}/task/api/change-status/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.data.status == "success") {
        setTasks((prevTasks) => (
          prevTasks.map(item => item._id == id ? { ...item, status } : item)
        ))
      }
      console.log(data);
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
    }
  }


  useEffect(() => {
    getTasks()
  }, [])


  return (
    <AdminLayout>
      <div className='w-full pr-10 my-10 max-sm:pr-5'>
        {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Task Table */}
            <div className='flex justify-between'>
              <h1 className='text-3xl font-medium'>Tasks</h1>
              {(role === "admin" || role === "manager") && (
                <AddBtn txt={"Add Task"} onClick={() => navigate('/add-task')} />
              )}
            </div>
            {tasks.length > 0 ? (
              <Table data={tasks} columns={adminColumn} />
            ) : (
              <p className='mt-5'>No Task assign to you</p>
            )}

            {
              role == "manager" && <div className='mt-10'>
                <h1 className='text-2xl font-medium mb-3'>UnAssign Task</h1>
                {unAssignTasks.length > 0 ? (
                  <Table data={unAssignTasks} columns={managerColumn} />
                ) : (
                  <p>No Unassign Task Found</p>
                )}
              </div>
            }


          </>
        )}
      </div>
    </AdminLayout>

  )
}

export default Tasks