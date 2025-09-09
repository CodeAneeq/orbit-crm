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

const Leads = () => {
  const role = useSelector(state => state.user.role);
  const user = useSelector(state => state.user.userData);
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unAssignLeads, setUnAssignLeads] = useState([]);
  const [txt, setTxt] = useState("");
  const [showToster, setShowToster] = useState("");


  const token = localStorage.getItem("token");


  const member = [
    { heading: "Lead Name", render: (row) => row?.clientId?.name },
    { heading: "Contact", render: (row) => row?.clientId?.email },
    {
      heading: "Status", render: (row) => (
        <select
          value={row.status || "New"}   // default agar status undefined ho
          onChange={(e) => changeLeadStatus(row._id, e.target.value)}
          className=" rounded px-2  py-1"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
        </select>
      )
    }];

  const admin = [...member, {
    heading: "Actions",
    render: (row) => (
      <div>
        <span
          className="text-red-500 cursor-pointer ml-2"
          onClick={() => deleteLead(row._id)}
        >
          Delete
        </span>
      </div>
    )
  }]

  const unAssignAdmin = [
    { heading: "Lead Name", render: (row) => row?.clientId?.name },
    { heading: "Contact", render: (row) => row?.clientId?.email },
    {
      heading: "Actions",
      render: (row) => (
        <div>
          <span className='mr-5 text-green-500 cursor-pointer'
            onClick={() => navigate(`/update-client/${row._id}`)}>
            Edit
          </span>
          <span className='mr-5 text-green-500 cursor-pointer'
            onClick={() => navigate(`/assign-lead/${row._id}`)}>
            Assign
          </span>
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => deleteLead(row._id)}
          >
            Delete
          </span>
        </div>
      )
    }]


  const getLeads = async () => {
    setLoading(true);
    try {
      let data = await axios.get(`${baseURL}/lead/api/get-leads`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (role == "manager") {
        setLeads(data.data.data.filter((item) => item.assignedTo !== user._id));
        setUnAssignLeads(data.data.data.filter((item) => item.assignedTo == user._id));
      } else {
        setLeads(data.data.data);
      }
      setUnAssignLeads(data.data.data.filter(item => item.assignedTo == user._id));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setShowToster(true);
      setTxt(error?.response?.data?.message);

    }
  }

  const deleteLead = async (id) => {
    try {
      let data = await axios.delete(`${baseURL}/lead/api/del-lead/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.data.status == "success") {
        setShowToster(true);
        setTxt("lead deleted successfully");
      }
      setLeads(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
    }
  }

  const changeLeadStatus = async (id, status) => {
    try {
      let payload = { status };
      let data = await axios.post(`${baseURL}/lead/api/change-lead-status/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.data.status == "success") {
        setLeads((prevLeads) => (
          prevLeads.map(item => item._id == id ? { ...item, status } : item)
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
    getLeads()
  }, [])

  return (
    <AdminLayout>
      <div className="w-full pr-10 my-10 max-sm:pr-5">
        {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Leads Section */}
            <div className="flex justify-between">

              <h1 className="text-3xl font-medium">Leads</h1>
              {(role === "admin" || role === "manager") && (
                <AddBtn txt="Add Lead" onClick={() => navigate("/add-lead")} />
              )}
            </div>

            {leads.length > 0 ? (
              <Table
                data={leads}
                columns={role === "admin" || role === "manager" ? admin : member}
              />
            ) : (
              <p className="mt-5">No lead assign to you</p>
            )}

            {/* UnAssign Leads (Only for Manager) */}
            {role === "manager" && (
              <>
                <div className="flex justify-between mt-15">
                  <h1 className="text-3xl font-medium">UnAssign Leads</h1>
                </div>

                {unAssignLeads.length > 0 ? (
                  <Table
                    data={unAssignLeads}
                    columns={role === "manager" ? unAssignAdmin : member}
                  />
                ) : (
                  <p className="mt-5">No unassign lead available</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AdminLayout>

  )
}

export default Leads