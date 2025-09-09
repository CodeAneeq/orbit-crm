import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import AddBtn from '../../components/button/add-btn'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/table/table'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Loader from '../../components/loader/loader'
import { useSelector } from 'react-redux'
import Toster from '../../components/toster/toster'

const Clients = () => {
  const navigate = useNavigate();
  const isLogin = useSelector(state => state.user.isLogin);
  const role = useSelector(state => state.user.role);
  const user = useSelector(state => state.user.userData);
  const [client, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txt, setTxt] = useState("");
  const [showToster, setShowToster] = useState("");
  const [UnAssignClients, setUnAssignClients] = useState([]);

  const member = [
    { heading: "Client Name", key: "Name" },
    { heading: "Client Details", key: "email" },
    { heading: "Client Company", key: "company" },
  ];

  const admin = [...member, {
    heading: "Actions",
    render: (row) => (
      <div>
        <span className='mr-5 text-green-500 cursor-pointer'
          onClick={() => navigate(`/update-client/${row._id}`)}>
          Edit
        </span>
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => deleteClient(row._id)}
        >
          Delete
        </span>
      </div>
    )
  }]


  const unAssignAdmin = [...member, {
    heading: "Actions",
    render: (row) => (
      <div>
        <span className='mr-5 text-green-500 cursor-pointer'
          onClick={() => navigate(`/update-client/${row._id}`)}>
          Edit
        </span>
        <span className='mr-5 text-green-500 cursor-pointer'
          onClick={() => navigate(`/assign-client/${row._id}`)}>
          Assign
        </span>
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => deleteClient(row._id)}
        >
          Delete
        </span>
      </div>
    )
  }]

  const getClients = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      let data = await axios.get(`${baseURL}/client/api/get-clients`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (role == "manager") {
        setClients(data.data.data.filter((item) => item.assignedTo !== user._id));
        setUnAssignClients(data.data.data.filter((item) => item.assignedTo == user._id));
      } else {
        setClients(data.data.data);
      }
      setLoading(false);
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  }

  const deleteClient = async (id) => {
    const token = localStorage.getItem("token");
    try {
      let data = await axios.delete(`${baseURL}/client/api/del-client/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.data.status == "success") {
        setShowToster(true);
        setTxt("Client deleted successfully");
      }
      setClients(prev => prev.filter(item => item._id !== id));
      setUnAssignClients(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
    }
  }

  useEffect(() => {
    getClients()
  }, [])

  return (
    <AdminLayout>
      <div className="w-full pr-10 my-10 max-sm:pr-5">
        {showToster && <Toster txt={txt} show={showToster} setShow={setShowToster} />}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* First Table Section */}
            <div className="flex justify-between">
              <h1 className="text-3xl font-medium">Clients</h1>
              {isLogin && (role === "admin" || role === "manager") && (
                <AddBtn
                  txt={"Add Client"}
                  onClick={() => navigate("/add-client")}
                />
              )}
            </div>
            {client.length > 0 ? (
              <Table
                data={client}
                columns={role === "admin" || role === "manager" ? admin : member}
              />
            ) : (
              <p className="mt-5">No Client Assign To You!</p>
            )}

            {/* Second Table Section */}
            {role === "manager" ? (
              <>
                <div className="flex justify-between mt-20">
                  <h1 className="text-3xl font-medium">UnAssign Clients</h1>
                </div>
                {UnAssignClients.length > 0 ? (
                  <Table
                    data={UnAssignClients}
                    columns={
                      role === "admin" || role === "manager" ? unAssignAdmin : member
                    }
                  />
                ) : (
                  <p className="mt-5">No Client is unAssign !</p>
                )}
              </>
            ) : null}
          </>
        )}
      </div>
    </AdminLayout>

  );
}

export default Clients