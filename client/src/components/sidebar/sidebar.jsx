import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { CiHome, CiLogout } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { IoIosCheckboxOutline } from "react-icons/io";
import { FaUsers } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/features/user-slice';
import { IoIosNotifications } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { closeSidebar } from '../../redux/features/sidebar-slice';
import {RxCross1} from 'react-icons/rx'

const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOpen = useSelector(state => state.sidebar.isOpen)
  const role = useSelector(state => state.user.role);
  const linkClass =
    "flex gap-2.5 px-3 rounded-2xl cursor-pointer py-1 items-center";

    const logOut = () => {
      dispatch(removeUser());
      navigate('/')
    }

    const close = () => {
      dispatch(closeSidebar());      
    }

  return (
    <div className={`w-80 max-md:${isOpen ? "w-80" : "w-0"} bg-white z-1 h-screen py-0 px-6 flex flex-col justify-between border-r border-r-gray-200 fixed left-0 top-0 overflow-y-auto max-sm:w-60`}>
      <div>
        <div className='flex justify-between'>
        <figure className="w-40 pt-4">
          <img src={logo} alt="Logo" />
        </figure>
        <div className='flex items-center mt-4 md:hidden' onClick={close}>
          <span><RxCross1/></span>
        </div>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {
            role == "admin" || role == "manager" ?   
            <>
            <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
              }
            >
              <CiHome /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <LuUsers /> Clients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <FaUsers /> Leads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <IoIosCheckboxOutline /> Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/members"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <CiUser /> Users
            </NavLink>
          </li> 
          {
            role == "admin" ? <li>
            <NavLink
              to="/departments"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <FaBuilding /> Departments
            </NavLink>
          </li>  : <></>
          }
          <li>
            <NavLink
              to="/logs"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <BsClockHistory /> Logs
            </NavLink>
          </li>
          {
            role == "manager" ? <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <IoIosNotifications /> Notifications
            </NavLink>
          </li>  : <></>
          }
          
          </> :   
          <>
            <li>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <LuUsers /> Clients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <FaUsers /> Leads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <IoIosCheckboxOutline /> Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logs"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <BsClockHistory /> Logs
            </NavLink>
          </li>
         <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-gray-200" : "hover:bg-gray-200"}`
              }
            >
              <IoIosNotifications /> Notifications
            </NavLink>
          </li>  : <></>
          </>
          }
        
      
        </ul>
      </div>
      <div className="mb-5">
        <p className='flex gap-2.5 cursor-pointer' onClick={logOut}>
          <span className='flex justify-center items-center'><CiLogout/></span>
          <span>Logout</span>
        </p>
      </div>
    </div>
  );
};

export default Sidebar;