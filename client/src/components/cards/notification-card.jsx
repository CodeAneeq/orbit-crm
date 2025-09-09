import React from "react";
import { FaCheckCircle, FaTrash } from "react-icons/fa"; 

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  return (
    <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-3 border">
      {/* Message */}
      <p
        className={`text-sm ${
          notification.isRead ? "text-gray-500" : "text-black font-semibold"
        }`}
      >
        {notification.message}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {/* Mark as Read Button */}
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification._id)}
            className={`px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600`}
          >
            <FaCheckCircle/>
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(notification._id)}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          <FaTrash/>
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
