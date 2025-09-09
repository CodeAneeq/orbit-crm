import React from 'react'

const SquareBtn = ({ className, txt, onClick, loading = false }) => {
  return (
    <button
      disabled={loading}
      className={`w-35 h-10 rounded-md font-medium cursor-pointer flex items-center justify-center max-sm:w-30 ${
        loading ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        txt
      )}
    </button>
  )
}

export default SquareBtn
