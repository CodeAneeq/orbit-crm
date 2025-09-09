import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import axios from 'axios';
import baseURL from '../../services/baseURL';
import TotalBox from '../../components/box/total-box'
import BarChartComponent from '../../components/charts/bar-chart';
import LineChartComponent from '../../components/charts/line-chart';
import Loader from '../../components/loader/loader';
import Toster from '../../components/toster/toster';

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inCompleteTasks, setInCompleteTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txt, setTxt] = useState("");
  const [showToster, setShowToster] = useState("");

  const getClients = async () => {
    setLoading(true)
    try {
      let data = await axios.get(`${baseURL}/client/api/get-clients`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false)
      setClients(data.data.data);
    } catch (error) {
      console.log(error);
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      setLoading(false);
    }
  }


  const getMembers = async () => {
    setLoading(true)

    try {
      let data = await axios.get(`${baseURL}/auth/api/get-all-users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(data.data.data);
      setLoading(false)

    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false)

    }
  }

  const getLeads = async () => {
    setLoading(true)

    try {
      let data = await axios.get(`${baseURL}/lead/api/get-leads`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeads(data.data.data);
      setLoading(false)

    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false)

    }
  }

  const getTasks = async () => {
    setLoading(true)

    try {
      let data = await axios.get(`${baseURL}/task/api/get-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.data.status == "success") {
        setTasks(data.data.data);
      }
      setLoading(false)

    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false)

    }
  }

  useEffect(() => {
    getClients();
    getMembers();
    getLeads();
    getTasks();
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      let inComplete = tasks.filter((item) => {
        return item.status != "Completed"
      })
      setInCompleteTasks(inComplete)
    }
  }, [tasks])

  return (
    <AdminLayout>
      <div className='py-8 w-full pr-10 max-sm:pr-5 overflow-x-hidden'>
        {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}
        {
          loading ? <Loader></Loader> : <><h1 className='text-3xl mb-5'>Dashboard</h1>
            <div className='top w-full flex gap-3 max-sm:flex-wrap '>
              <TotalBox heading={"Total Clients"} num={clients.length} />
              <TotalBox heading={"Total Leads"} num={leads.length} />
              <TotalBox heading={"Open Tasks"} num={inCompleteTasks.length} />
              <TotalBox heading={"Active Users"} num={users.length} />
            </div>
            <div className='mt-10'>
              <h2 className='text-3xl mb-5 '>Overview</h2>
              <div className='flex gap-5 w-full max-lg:flex-col '>
                <div className="box1 border rounded-lg w-1/2 max-lg:w-full">
                  <BarChartComponent />
                </div>
                <div className="box2 w-1/2 rounded-lg border max-lg:w-full">
                  <LineChartComponent></LineChartComponent>
                </div>
              </div>
            </div></>
        }
      </div>
    </AdminLayout>
  )
}

export default Dashboard