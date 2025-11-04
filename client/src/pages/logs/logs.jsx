import React from 'react'
import AdminLayout from '../../components/layout/admin-layout'
import LogCard from '../../components/cards/log-card'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../services/baseURL'
import Toster from '../../components/toster/toster'
import Loader from '../../components/loader/loader'

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [txt, setTxt] = useState("");
    const [showToster, setShowToster] = useState("");

    const getLogs = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            let data = await axios.get(`${baseURL}/logs/api/get-all-logs`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLogs(data.data.data);
            setLoading(false);
        } catch (error) {
            setShowToster(true);
            setTxt(error?.response?.data?.message);
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getLogs();
    }, [])

    return (
        <AdminLayout>
            <div className='w-full pr-10 my-10 max-sm:pr-2'>
                {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}

                <h1 className='font-medium text-3xl'>Logs</h1>
                {
                    loading ? (<Loader></Loader>) : (

                        <div className='mt-6'>
                    {
                        logs.map((item) => (
                            <LogCard action={item.action} createdAt={item?.createdAt?.split(".")[0]} targetId={item.targetId} targetType={item.targetType} userId={item?.userId?.name || item?.userId} />
                        ))
                    }
                </div>
                )
                    }
            </div>
        </AdminLayout>
    )
}


export default Logs

