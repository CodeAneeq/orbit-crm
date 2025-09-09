import React from 'react'

const LogCard = ({action, userId, createdAt, targetType, targetId}) => {
  return (
<div className="bg-white  rounded-xl mt-4 mb-4 hover:shadow-lg transition duration-300 max-sm:px-0">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
   
      <div>
        <p className="font-semibold text-gray-800">
          {action}
        </p>
        <p className=" text-gray-800 text-sm">
          Target Type: {targetType}
        </p>
        <p className=" text-gray-800 text-sm">
          Target Id: {targetId}
        </p>
        <p className="text-sm text-gray-500">by {userId}</p>
      </div>
    </div>
    <p className="text-xs text-gray-400">
        {createdAt}
    </p>
  </div>
</div>
  )
}

export default LogCard