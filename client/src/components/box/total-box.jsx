import React from 'react'

const TotalBox = ({heading, num}) => {
  return (
    <div className='w-1/4 h-28 rounded-lg bg-transparent border-1 border-gray-200 p-5 max-md:w-30'>
        <p>{heading}</p>
        <p className='text-2xl mt-2 font-medium'>{num}</p>
    </div>
  )
}

export default TotalBox