import React from 'react'
import Sidebar from '../sidebar/sidebar'
import Navbar from '../navbar/navbar'
import { useSelector } from 'react-redux'

const AdminLayout = ({children}) => {
  const isOpen = useSelector(state => state.sidebar.isOpen);  
  
  return (
    <>
      <div className='hidden max-md:block max-md:w-screen'>
        <Navbar/>
      </div>
      <div className='flex gap-10 min-h-screen'>
        <div className={`max-md:${isOpen ? "block" : "hidden"}`}>
          <Sidebar></Sidebar>
        </div>
        <div className='flex-1 max-md:px-5 pl-80 max-md:pl-5'>
          {children}
        </div>
      </div>
    </>
  )
}

export default AdminLayout