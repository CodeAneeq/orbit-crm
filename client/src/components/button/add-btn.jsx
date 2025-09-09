import React from 'react'

const AddBtn = ({txt, onClick}) => {
  return (
    <div className='text-sm rounded-3xl px-4 cursor-pointer text-center h-5 py-4 flex justify-center items-center bg-gray-300 font-medium' onClick={onClick}>{txt}</div>
  )
}

export default AddBtn