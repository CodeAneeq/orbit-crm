import React from 'react'
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { openSidebar } from '../../redux/features/sidebar-slice';

const Navbar = () => {
  const isLogin = useSelector(state => state.user.isLogin);
  const dispatch = useDispatch();
  
  const open = () => {
    dispatch(openSidebar());    
  }

  return (
    <div className='h-16 w-full py-2 px-30 border-b-2 border-b-gray-200 max-md:px-5 flex justify-between'>
        <figure className='h-10'>
            <img className='h-full' src={logo} alt="" />
        </figure>
        {
          isLogin ?  <button className="flex flex-col justify-between w-8 h-6 p-1 focus:outline-none items-center mt-2.5 cursor-pointer" onClick={open}>
      <span className="block h-0.5 w-full bg-black rounded"></span>
      <span className="block h-0.5 w-full bg-black rounded"></span>
      <span className="block h-0.5 w-full bg-black rounded"></span>
    </button> : <></>
}
    </div>
  )
}

export default Navbar