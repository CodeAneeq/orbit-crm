import React, { useEffect } from 'react'

const Toster = ({ txt, show, setShow }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [setShow]);

  if (!show) return null;

  return (
    <div className="
      max-w-[90%] sm:max-w-md 
      bg-green-200 px-4 py-2 
      border-2 border-green-950 
      text-center absolute top-5 
      left-1/2 transform -translate-x-1/2
      text-gray-800 rounded-md shadow-md
    ">
      <p className="text-sm sm:text-base font-medium">{txt}</p>
    </div>
  )
}

export default Toster
