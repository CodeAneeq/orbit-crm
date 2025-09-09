import React from 'react'

const PrimaryBtn = ({ text, onClick, disabled, loading }) => {
  return (
    <button
      className='bg-yellow-400 text-center w-80 h-11 font-medium rounded-4xl max-sm:w-70 cursor-pointer disabled:opacity-50'
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
          Loading...
        </span>
      ) : (
        text
      )}
    </button>
  )
}

export default PrimaryBtn
