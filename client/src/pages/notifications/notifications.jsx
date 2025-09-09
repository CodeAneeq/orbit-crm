import React from 'react'
import AdminLayout from '../../components/layout/admin-layout';
import NotificationCard from '../../components/cards/notification-card';
import { useState } from 'react';
import axios from 'axios';
import baseURL from '../../services/baseURL';
import { useEffect } from 'react';
import Toster from '../../components/toster/toster';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
      const [txt, setTxt] = useState("");
      const [showToster, setShowToster] = useState("");

    const getNotifications = async () => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${baseURL}/notification/api/get-notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setNotifications(res.data.data);
        } catch (error) {
            console.log(error);
            setShowToster(true);
      setTxt(error?.response?.data?.message);
        }
    }

    const deleteNotification = async (id) => {
            const token = localStorage.getItem("token");        
            try {            
                let data = await axios.delete(`${baseURL}/notification/api/del-notification/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (data.data.status == "success") {
                    setShowToster(true);
                    setTxt("notification deleted successfully");
                }
                setNotifications(prev => prev.filter(item => item._id !== id));
            } catch (error) {
                setShowToster(true);
      setTxt(error?.response?.data?.message);
                console.log(error);
            }
        }

    const markNotification = async (id) => {
            const token = localStorage.getItem("token");        
            try {            
                let data = await axios.put(`${baseURL}/notification/api/mark-notification/${id}`, 
                    {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (data.data.status == "success") {
                    setShowToster(true);
                    setTxt("notification marked successfully");
                }
                setNotifications(prev => prev.map(item => item._id == id ? {...item, isRead: true} : item));
            } catch (error) {
                console.log(error);
                setShowToster(true);
      setTxt(error?.response?.data?.message);
            }
        }
    

    useEffect(() => {
        getNotifications();
    }, [])

  return (
    <AdminLayout>
        <div className='w-full pr-10 my-10 max-sm:pr-5'>
                    {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}

            <h1 className='text-3xl font-medium'>Notifications</h1>
            <div className='mt-5'>
                {
                    notifications.map((not) => (
                        <NotificationCard notification={not} onDelete={deleteNotification} onMarkRead={markNotification}></NotificationCard>
                    ))
                }
            </div>
        </div>
    </AdminLayout>
  )
}

export default Notifications